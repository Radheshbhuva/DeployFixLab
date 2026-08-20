# DeployFix Lab — GitHub Repository Integration: Debugging & Troubleshooting Guide

| Property | Value |
| :--- | :--- |
| **Document Name** | Debugging & Troubleshooting Operational Guide |
| **Document ID** | DFL-GH-DEBUG-005 |
| **Version** | 1.0.0 |
| **Status** | Approved |
| **Category** | Operations & Troubleshooting |
| **Owner** | DeployFix Lab Reliability Engineering Team |
| **Created On** | 2026-08-17 |
| **Last Updated** | 2026-08-17 |
| **Repository** | DeployFix Lab (`Radheshbhuva/DeployFixLab`) |

---

## 1. Master Diagnostic Decision Flowchart

When diagnosing any GitHub Integration failure, traverse this decision tree:

```text
[ Issue Detected ]
       │
       ▼
[ Is it an Auth / App Connection Issue? ]
  ├── YES ──► Check Section 2: OAuth / GitHub App Failures
  └── NO
       │
       ▼
[ Is GitHub API returning 403 / 429? ]
  ├── YES ──► Check Section 3: Rate Limiting & Octokit Throttling
  └── NO
       │
       ▼
[ Did snapshot download / extraction fail? ]
  ├── YES ──► Check Section 4: Tarball & Ephemeral Workspace Bugs
  └── NO
       │
       ▼
[ Did parser fail or return empty context? ]
  ├── YES ──► Check Section 5: Parser & AST Syntax Failures
  └── NO
       │
       ▼
[ Did Supabase / Prisma fail to save context? ]
  ├── YES ──► Check Section 6: Database & Prisma Persistence Errors
  └── NO
       │
       ▼
[ Did Webhook fail to trigger rescan? ]
  └── YES ──► Check Section 7: Webhook Signature & Event Delivery Faults
```

---

## 2. Category 1: GitHub App & OAuth Installation Failures

### 2.1 Error: `Invalid CSRF State or State Mismatch`
- **Symptom:** User completes GitHub authorization popup, but backend returns `400 Bad Request: Invalid OAuth state parameter`.
- **Root Cause:**
  - Frontend opened auth popup with state token `A`, but user reloaded or completed another session with state token `B`.
  - State cookie / cache expired before user finished installation on GitHub.
- **Diagnostic Command:**
  ```bash
  # Check backend session state logs
  grep "CSRF_STATE_VALIDATION_FAILED" backend.log
  ```
- **Remediation:**
  1. Ensure OAuth state parameter has a 10-minute TTL stored in signed HTTP-only cookies or Redis session cache.
  2. Clear stale browser session cookies and retry connection.

### 2.2 Error: `Bad credentials / Invalid App Private Key (PEM)`
- **Symptom:** Backend fails with `HttpError 401: 'A JSON web token could not be verified'`.
- **Root Cause:**
  - `GITHUB_APP_PRIVATE_KEY` has corrupted newline characters in the `.env` file or is improperly formatted.
- **Fix:**
  - Ensure RSA Private Key is stored with explicit newlines or base64 encoded:
    ```typescript
    const privateKey = process.env.GITHUB_APP_PRIVATE_KEY_BASE64
      ? Buffer.from(process.env.GITHUB_APP_PRIVATE_KEY_BASE64, 'base64').toString('utf-8')
      : process.env.GITHUB_APP_PRIVATE_KEY.replace(/\\n/g, '\n');
    ```

---

## 3. Category 2: Rate Limiting & Octokit Throttling

### 3.1 Error: `HttpError 403: API rate limit exceeded`
- **Symptom:** Scans suddenly fail with rate-limit errors during high repository traffic.
- **Root Cause:**
  - GitHub App installation tokens have a rate limit of **5,000 requests per hour per installation**.
  - Making individual `octokit.rest.repos.getContent` requests for every file in large repositories exhausts quotas rapidly.
- **Remediation:**
  1. **Enforce Snapshot Tarball Strategy:** Never fetch files individually. Always use `GET /repos/{owner}/{repo}/tarball/{ref}` which consumes exactly **1 API request** for the entire repository.
  2. **Inspect Rate Limit Headers:**
     ```bash
     curl -H "Authorization: Bearer <INSTALLATION_TOKEN>" \
          -H "Accept: application/vnd.github.v3+json" \
          https://api.github.com/rate_limit
     ```
  3. **Implement Exponential Backoff:** Use `@octokit/plugin-retry` and `@octokit/plugin-throttling` with jitter.

---

## 4. Category 3: Repository Ingestion & Ephemeral Workspace Bugs

### 4.1 Error: `Tarball extraction exceeded max file/size limit (Zip Bomb Protection)`
- **Symptom:** Scan fails with `SecurityException: Tarball uncompressed size exceeded 200MB limit`.
- **Root Cause:** Repository contains large binaries, node_modules checked into git, or deliberate decompression bombs.
- **Remediation:**
  - Streaming tar parser must abort immediately if uncompressed byte counter crosses `200MB` or file count crosses `5,000`:
    ```typescript
    let totalBytes = 0;
    tarExtractStream.on('entry', (header) => {
      totalBytes += header.size;
      if (totalBytes > 200 * 1024 * 1024) {
        tarExtractStream.destroy(new Error("ARCHIVE_SIZE_EXCEEDED"));
      }
    });
    ```

### 4.2 Error: `Path Traversal in Archive Header (Symlink Attack)`
- **Symptom:** Archive contains entry pointing to `../../etc/passwd`.
- **Root Cause:** Malicious archive designed to escape scratch workspace.
- **Remediation:**
  - Validate all relative paths before extraction:
    ```typescript
    const targetPath = path.resolve(scratchDir, header.name);
    if (!targetPath.startsWith(scratchDir)) {
      throw new Error(`SECURITY_ALERT: Malicious path traversal detected: ${header.name}`);
    }
    ```

---

## 5. Category 4: Sensitive Data & Secret Leakage Prevention

### 5.1 Verification Checklist for Secret Redaction
Before any project context is returned to the frontend or persisted to Supabase, run this verification:

| File / Pattern | Required Handling | Verification Status |
| :--- | :--- | :--- |
| `.env` / `.env.local` | Complete deletion from scratch workspace; never read into memory. | Mandatory Filter |
| `.env.example` | Extract key names only (e.g. `["PORT", "DATABASE_URL"]`); scrub all values. | Mandatory Redactor |
| Private Keys (`*.pem`, `id_rsa`) | Immediate purge upon detection. | Mandatory Filter |
| High-Entropy API Tokens (`ghp_`, `sk_live_`, `AIza`) | Regex scrubbed with `[REDACTED_SECRET]` placeholder. | Mandatory Redactor |

### 5.2 Emergency Secret Scrub Verification Command
```bash
# Verify no secrets exist in generated project context JSON
node -e '
  const ctx = require("./test-context.json");
  const str = JSON.stringify(ctx);
  if (/ghp_[0-9a-zA-Z]{36}|sk_live_[0-9a-zA-Z]{24}/.test(str)) {
    console.error("CRITICAL: Secret pattern leaked into Project Context!");
    process.exit(1);
  }
  console.log("PASS: Project Context clean of known secret patterns.");
'
```

---

## 6. Category 5: Parser Failures & AST Syntax Errors

### 6.1 Issue: `Malformed package.json / SyntaxError: Unexpected token in JSON`
- **Symptom:** Ingestion crashes if a repository contains comments in `package.json` or invalid JSON formatting.
- **Remediation:**
  - Use resilient JSON parsers (`json5` or `strip-json-comments`) wrapped in non-throwing try/catch:
    ```typescript
    try {
      return JSON.parse(stripComments(content));
    } catch (err) {
      logger.warn(`Failed to parse package.json: ${err.message}`);
      return { detectedFrameworks: [], parseError: true };
    }
    ```

### 6.2 Issue: `Complex Multi-Stage Dockerfile Port Detection`
- **Symptom:** Dockerfile contains multiple `FROM` stages; parser incorrectly extracts `EXPOSE` from the builder stage instead of the runtime runner stage.
- **Remediation:**
  - The Dockerfile parser must track build stages and only extract `EXPOSE` directives following the final `FROM` statement.

---

## 7. Category 6: Prisma / Supabase Sync & Persistence Errors

### 7.1 Error: `PrismaClientKnownRequestError: P2002 Unique constraint failed on github_installation_id`
- **Symptom:** Re-connecting an existing GitHub App installation causes a database constraint collision.
- **Remediation:**
  - Always use `prisma.gitHubConnection.upsert` keyed by `githubInstallationId` rather than plain `create`.

### 7.2 Error: `PrismaClientValidationError: Invalid value for jsonb field parsedArtifacts`
- **Symptom:** Saving deep nested metadata fails Prisma validation.
- **Remediation:**
  - Validate `parsedArtifacts` against `github-context.types.ts` before executing `prisma.projectContext.create`.

---

## 8. Category 7: Webhook Signature Verification & Delivery Faults

### 8.1 Error: `Webhook Error: Signature verification failed (HTTP 401)`
- **Symptom:** GitHub webhooks are delivered, but backend rejects them with `401 Unauthorized`.
- **Root Cause:**
  - Express `express.json()` middleware parsed the request body before HMAC calculation, altering raw payload bytes.
- **Fix:**
  - Capture the raw request buffer specifically on the webhook route:
    ```typescript
    app.use('/api/github/webhooks', express.raw({ type: 'application/json' }), (req, res, next) => {
      const signature = req.headers['x-hub-signature-256'] as string;
      const hmac = crypto.createHmac('sha256', process.env.GITHUB_WEBHOOK_SECRET!);
      const digest = 'sha256=' + hmac.update(req.body).digest('hex');
      if (crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest))) {
        req.body = JSON.parse(req.body.toString());
        next();
      } else {
        res.status(401).send("Invalid signature");
      }
    });
    ```

---

## 9. cURL Diagnostics Cheat Sheet

```bash
# 1. Health Check GitHub Backend Route
curl -i -X GET http://localhost:5000/api/github/connect \
     -H "Authorization: Bearer <USER_JWT>"

# 2. Trigger Synthetic Scan
curl -i -X POST http://localhost:5000/api/github/repositories/repo_123/scan \
     -H "Authorization: Bearer <USER_JWT>" \
     -H "Content-Type: application/json" \
     -d '{"branch": "main"}'

# 3. Test Public Repo Fallback Scan
curl -i -X POST http://localhost:5000/api/github/public-scan \
     -H "Authorization: Bearer <USER_JWT>" \
     -H "Content-Type: application/json" \
     -d '{"url": "https://github.com/expressjs/express"}'
```
