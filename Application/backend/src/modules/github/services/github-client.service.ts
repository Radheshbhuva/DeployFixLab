// ─────────────────────────────────────────────────────────────────────────────
// github-client.service.ts
// Downloads repository snapshot tarballs via the GitHub REST API using
// native Node.js https — no ESM-only dependency issues.
// ─────────────────────────────────────────────────────────────────────────────

import * as tar from 'tar';
import fs from 'fs';
import path from 'path';
import https from 'https';
import { IncomingMessage } from 'http';
import { SanitizationService } from './sanitization.service';

// Safe resolver for tar.x across both CJS and ESM interop
const tarExtract = (tar as unknown as { x?: typeof tar.x; default?: { x?: typeof tar.x } }).x
  || (tar as unknown as { default?: { x?: typeof tar.x } }).default?.x
  || tar.extract;

/** Maximum decompressed byte count (200 MB) */
const MAX_EXTRACT_BYTES = 200 * 1024 * 1024;
/** Maximum number of files to extract */
const MAX_FILE_COUNT = 5_000;

const GITHUB_API_BASE = 'https://api.github.com';
const USER_AGENT = 'DeployFix-Lab/1.0 (github-client)';

function buildHeaders(token?: string): Record<string, string> {
  const headers: Record<string, string> = {
    'User-Agent': USER_AGENT,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };
  const auth = token ?? process.env.GITHUB_PAT;
  if (auth) headers.Authorization = `Bearer ${auth}`;
  return headers;
}

/** Makes an HTTPS GET and follows redirects (up to 5 hops), resolving with the final IncomingMessage. */
function get(url: string, headers: Record<string, string>, maxRedirects = 5): Promise<IncomingMessage> {
  return new Promise((resolve, reject) => {
    https.get(url, { headers }, (res) => {
      const isRedirect = [301, 302, 303, 307, 308].includes(res.statusCode ?? 0);
      if (isRedirect && res.headers.location && maxRedirects > 0) {
        const redirectUrl = res.headers.location.startsWith('http')
          ? res.headers.location
          : new URL(res.headers.location, url).toString();
        // Consume redirect response body to free socket
        res.resume();
        // Do NOT send GitHub auth headers to external redirect targets (e.g., AWS S3 / codeload)
        const nextHeaders = redirectUrl.includes('api.github.com')
          ? headers
          : { 'User-Agent': USER_AGENT };
        resolve(get(redirectUrl, nextHeaders, maxRedirects - 1));
      } else {
        resolve(res);
      }
    }).on('error', reject);
  });
}

/** Reads an HTTPS stream as text (for JSON API responses). */
function readText(res: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    res.on('data', (chunk: Buffer) => chunks.push(chunk));
    res.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
    res.on('error', reject);
  });
}

// ─── Public API ───────────────────────────────────────────────────────────────

export interface GitHubRepoInfo {
  id: number;
  owner: string;
  name: string;
  fullName: string;
  defaultBranch: string;
  visibility: string;
  url: string;
  isFork: boolean;
}

/**
 * Fetches the list of repositories accessible to an installation token.
 * Used after GitHub App OAuth callback.
 */
export async function listInstallationRepositories(installationToken: string): Promise<GitHubRepoInfo[]> {
  const headers = buildHeaders(installationToken);
  const res = await get(`${GITHUB_API_BASE}/installation/repositories?per_page=100`, headers);
  const body = await readText(res);

  if (res.statusCode !== 200) {
    throw new Error(`GitHub API error ${res.statusCode}: ${body}`);
  }

  const data = JSON.parse(body) as {
    repositories: Array<{
      id: number; owner: { login: string }; name: string; full_name: string;
      default_branch: string; visibility: string; html_url: string; fork: boolean; private: boolean;
    }>;
  };

  return (data.repositories ?? []).map((r) => ({
    id: r.id,
    owner: r.owner?.login ?? '',
    name: r.name,
    fullName: r.full_name,
    defaultBranch: r.default_branch,
    visibility: r.visibility ?? (r.private ? 'private' : 'public'),
    url: r.html_url,
    isFork: r.fork,
  }));
}

/**
 * Downloads a repository tarball and extracts it into destDir.
 * Returns the list of extracted file paths (relative to destDir).
 */
export async function extractRepoSnapshot(
  owner: string,
  repo: string,
  ref: string,
  destDir: string,
  installationToken?: string,
): Promise<string[]> {
  const headers = buildHeaders(installationToken);
  const tarballUrl = `${GITHUB_API_BASE}/repos/${owner}/${repo}/tarball/${ref}`;

  const stream = await get(tarballUrl, headers);

  if (stream.statusCode && stream.statusCode >= 400) {
    const body = await readText(stream);
    throw new Error(`Failed to download tarball: HTTP ${stream.statusCode} — ${body}`);
  }

  const extractedFiles: string[] = [];
  let totalBytes = 0;
  let fileCount = 0;

  return new Promise((resolve, reject) => {
    const extractor = tarExtract({
      cwd: destDir,
      strip: 1,
      filter: (filePath) => {
        if (SanitizationService.isBlacklisted(filePath)) return false;
        if (fileCount >= MAX_FILE_COUNT) return false;
        return true;
      },
    });

    stream.on('data', (chunk: Buffer) => {
      totalBytes += chunk.length;
      if (totalBytes > MAX_EXTRACT_BYTES) {
        stream.destroy(new Error('Repository archive exceeds 200 MB limit'));
      }
    });

    extractor.on('entry' as never, (entry: { path: string }) => {
      fileCount++;
      extractedFiles.push(entry.path);
    });

    stream.pipe(extractor);
    extractor.on('finish', () => resolve(extractedFiles));
    extractor.on('error', (err: Error) => reject(err));
    stream.on('error', (err: Error) => reject(err));
  });
}

/**
 * Fetches a single file's content via the GitHub API.
 * Returns null if not found or not a text file.
 */
export async function fetchFileContent(
  owner: string,
  repo: string,
  filePath: string,
  ref: string,
  installationToken?: string,
): Promise<string | null> {
  try {
    const headers = buildHeaders(installationToken);
    const res = await get(
      `${GITHUB_API_BASE}/repos/${owner}/${repo}/contents/${encodeURIComponent(filePath)}?ref=${ref}`,
      headers,
    );
    if (res.statusCode !== 200) return null;
    const body = await readText(res);
    const data = JSON.parse(body) as { content?: string; encoding?: string };
    if (data.content && data.encoding === 'base64') {
      return Buffer.from(data.content.replace(/\n/g, ''), 'base64').toString('utf-8');
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Recursively walks a local directory and returns all relative file paths.
 */
export async function walkDirectory(baseDir: string): Promise<string[]> {
  const results: string[] = [];
  async function walk(dir: string) {
    let entries: fs.Dirent[];
    try {
      entries = await fs.promises.readdir(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        await walk(fullPath);
      } else {
        results.push(path.relative(baseDir, fullPath).replace(/\\/g, '/'));
      }
    }
  }
  await walk(baseDir);
  return results;
}
