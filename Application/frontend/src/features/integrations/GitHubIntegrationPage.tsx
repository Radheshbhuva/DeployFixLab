import React, { useCallback, useEffect, useState } from 'react';
import {
  Github,
  RefreshCw,
  Link2,
  Link2Off,
  CheckCircle2,
  AlertTriangle,
  Scan,
  ChevronRight,
  GitBranch,
  Lock,
  Globe,
  GitFork,
  Zap,
  AlertCircle,
  Info,
  ArrowRight,
  Loader2,
  BookOpen,
} from 'lucide-react';
import {
  disconnectGitHub,
  getGitHubConnectionStatus,
  getRepositoryContext,
  GHConnectionStatus,
  GHContextResponse,
  GHDiagnostic,
  GHRepository,
  initiateGitHubConnection,
  listGitHubRepositories,
  publicRepoScan,
  triggerRepositoryScan,
} from '@/services/github.service';
import { useSearchParams } from 'react-router-dom';

// ─── Severity badge helper ────────────────────────────────────────────────────

const SEVERITY_STYLES: Record<string, string> = {
  CRITICAL: 'bg-red-500/15 text-red-400 border border-red-500/25',
  HIGH: 'bg-orange-500/15 text-orange-400 border border-orange-500/25',
  MEDIUM: 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/25',
  LOW: 'bg-blue-500/15 text-blue-400 border border-blue-500/25',
  INFO: 'bg-slate-500/15 text-slate-400 border border-slate-500/25',
};

const SEVERITY_ICONS: Record<string, React.ReactNode> = {
  CRITICAL: <AlertTriangle className="w-3.5 h-3.5" />,
  HIGH: <AlertCircle className="w-3.5 h-3.5" />,
  MEDIUM: <AlertCircle className="w-3.5 h-3.5" />,
  LOW: <Info className="w-3.5 h-3.5" />,
  INFO: <Info className="w-3.5 h-3.5" />,
};

function SeverityBadge({ severity }: { severity: string }) {
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${SEVERITY_STYLES[severity] ?? ''}`}>
      {SEVERITY_ICONS[severity]}
      {severity}
    </span>
  );
}

// ─── Diagnostic Card ──────────────────────────────────────────────────────────

function DiagnosticCard({ diag }: { diag: GHDiagnostic }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="rounded-xl border border-border-default bg-bg-raised overflow-hidden transition-all">
      <button
        className="w-full flex items-start gap-3 p-4 text-left hover:bg-bg-surface transition-colors"
        onClick={() => setExpanded((e) => !e)}
      >
        <div className="mt-0.5 flex-shrink-0">
          <SeverityBadge severity={diag.severity} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-text-primary leading-snug">{diag.title}</p>
          <p className="text-xs text-text-muted mt-0.5 truncate">{diag.message}</p>
        </div>
        <ChevronRight className={`w-4 h-4 text-text-muted flex-shrink-0 transition-transform mt-1 ${expanded ? 'rotate-90' : ''}`} />
      </button>
      {expanded && (
        <div className="border-t border-border-default px-4 pb-4 pt-3 space-y-3 bg-bg-surface/50">
          {diag.fileAffected && (
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-text-muted w-20 flex-shrink-0">File</span>
              <code className="text-xs text-brand-primary font-mono bg-brand-primary/10 px-1.5 py-0.5 rounded">{diag.fileAffected}</code>
            </div>
          )}
          {diag.rootCause && (
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-widest text-text-muted block mb-1">Root Cause</span>
              <p className="text-xs text-text-secondary leading-relaxed">{diag.rootCause}</p>
            </div>
          )}
          {diag.recommendation && (
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-widest text-text-muted block mb-1">Recommendation</span>
              <p className="text-xs text-status-success leading-relaxed">{diag.recommendation}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Tech Stack Chip ──────────────────────────────────────────────────────────

function StackChip({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="flex items-center gap-2 bg-bg-raised rounded-lg px-3 py-1.5 border border-border-default">
      <span className="text-[10px] font-semibold uppercase tracking-widest text-text-muted">{label}</span>
      <span className="text-xs font-semibold text-text-primary">{value}</span>
    </div>
  );
}

// ─── Completeness Ring ────────────────────────────────────────────────────────

function CompletenessRing({ score }: { score: number }) {
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  const color = score >= 70 ? '#22c55e' : score >= 40 ? '#f59e0b' : '#ef4444';

  return (
    <div className="relative flex items-center justify-center">
      <svg width="72" height="72" viewBox="0 0 72 72" className="-rotate-90">
        <circle cx="36" cy="36" r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
        <circle
          cx="36" cy="36" r={radius} fill="none"
          stroke={color} strokeWidth="6"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-700"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-sm font-bold text-text-primary leading-none">{score}</span>
        <span className="text-[9px] text-text-muted leading-none">/ 100</span>
      </div>
    </div>
  );
}

// ─── Repo Card ────────────────────────────────────────────────────────────────

interface RepoCardProps {
  repo: GHRepository;
  onScan: (id: string, branch: string) => void;
  scanning: boolean;
}

function RepoCard({ repo, onScan, scanning }: RepoCardProps) {
  return (
    <div className="rounded-xl border border-border-default bg-bg-raised p-4 flex flex-col gap-3 hover:border-brand-primary/40 transition-all">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-violet-600/15 border border-violet-500/25 flex items-center justify-center flex-shrink-0">
          <Github className="w-4 h-4 text-violet-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-text-primary truncate">{repo.fullName}</p>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span className="inline-flex items-center gap-1 text-[10px] text-text-muted">
              <GitBranch className="w-3 h-3" />{repo.defaultBranch}
            </span>
            {repo.visibility === 'private' ? (
              <span className="inline-flex items-center gap-1 text-[10px] text-amber-400"><Lock className="w-3 h-3" />Private</span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[10px] text-text-muted"><Globe className="w-3 h-3" />Public</span>
            )}
            {repo.sourceType === 'public_url' && (
              <span className="inline-flex items-center gap-1 text-[10px] text-text-muted"><GitFork className="w-3 h-3" />Public Scan</span>
            )}
          </div>
        </div>
      </div>
      {repo.lastSyncedAt && (
        <p className="text-[11px] text-text-muted">
          Last synced: {new Date(repo.lastSyncedAt).toLocaleString()}
        </p>
      )}
      <button
        onClick={() => onScan(repo.id, repo.defaultBranch)}
        disabled={scanning}
        className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-brand-primary/10 hover:bg-brand-primary/20 border border-brand-primary/30 text-brand-primary text-xs font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {scanning ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Scan className="w-3.5 h-3.5" />}
        {scanning ? 'Scanning…' : 'Scan Repository'}
      </button>
    </div>
  );
}

function extractErrorMessage(e: unknown): string {
  if (e && typeof e === 'object') {
    const axiosErr = e as { response?: { data?: { error?: { message?: string } } }; message?: string };
    if (axiosErr.response?.data?.error?.message) {
      return axiosErr.response.data.error.message;
    }
    if (axiosErr.message) return axiosErr.message;
  }
  return String(e);
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export const GitHubIntegrationPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<GHConnectionStatus | null>(null);
  const [repositories, setRepositories] = useState<GHRepository[]>([]);
  const [scanResult, setScanResult] = useState<GHContextResponse | null>(null);
  const [selectedRepoId, setSelectedRepoId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [scanning, setScanningId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [publicUrl, setPublicUrl] = useState('');
  const [publicScanning, setPublicScanning] = useState(false);

  const loadStatus = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const s = await getGitHubConnectionStatus();
      setStatus(s);
      if (s.connected) {
        const repos = await listGitHubRepositories();
        setRepositories(repos);
      }
    } catch (err) {
      const msg = extractErrorMessage(err);
      if (msg.includes('503') || msg.includes('GITHUB_APP_NOT_CONFIGURED')) {
        setStatus({ connected: false, connection: null });
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadStatus();
    // Handle redirect back from GitHub App installation
    if (searchParams.get('connected') === 'true') {
      void loadStatus();
    }
  }, [loadStatus, searchParams]);

  const handleConnect = async () => {
    try {
      setConnecting(true);
      setError(null);
      const { installationUrl } = await initiateGitHubConnection();
      window.location.href = installationUrl;
    } catch (e) {
      const msg = extractErrorMessage(e);
      if (msg.includes('GITHUB_APP_NOT_CONFIGURED') || msg.includes('503')) {
        setError('GitHub App credentials are not configured on the server yet. You can still scan any public repository immediately below!');
      } else {
        setError(msg);
      }
      setConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnectGitHub();
      setStatus({ connected: false, connection: null });
      setRepositories([]);
      setScanResult(null);
    } catch {
      setError('Failed to disconnect GitHub.');
    }
  };

  const handleScan = async (repoId: string, branch: string) => {
    try {
      setScanningId(repoId);
      setError(null);
      await triggerRepositoryScan(repoId, branch);
      const ctx = await getRepositoryContext(repoId);
      setSelectedRepoId(repoId);
      setScanResult(ctx);
    } catch (e) {
      setError(extractErrorMessage(e));
    } finally {
      setScanningId(null);
    }
  };

  const handlePublicScan = async () => {
    if (!publicUrl.trim()) return;
    try {
      setPublicScanning(true);
      setError(null);
      const result = await publicRepoScan(publicUrl.trim());
      if (result.repositoryId) {
        const ctx = await getRepositoryContext(result.repositoryId);
        setSelectedRepoId(result.repositoryId);
        setScanResult(ctx);
        // Add to repos list if not already there
        const repo: GHRepository = {
          id: result.repositoryId,
          owner: publicUrl.split('/')[3] ?? '',
          name: publicUrl.split('/')[4] ?? '',
          fullName: `${publicUrl.split('/')[3] ?? ''}/${publicUrl.split('/')[4] ?? ''}`,
          defaultBranch: 'main',
          visibility: 'public',
          url: publicUrl,
          sourceType: 'public_url',
          lastSyncedAt: new Date().toISOString(),
        };
        setRepositories((prev) => [repo, ...prev.filter((r) => r.id !== result.repositoryId)]);
      }
    } catch (e) {
      setError(extractErrorMessage(e));
    } finally {
      setPublicScanning(false);
    }
  };

  return (
    <div className="min-h-full p-6 space-y-6 max-w-5xl mx-auto">
      {/* ── Page Header ── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center">
              <Github className="w-5 h-5 text-violet-400" />
            </div>
            GitHub Integration
          </h1>
          <p className="text-sm text-text-muted mt-1">
            Connect your repositories to enable intelligent deployment diagnostics and automated context analysis.
          </p>
        </div>
        <button
          onClick={() => void loadStatus()}
          className="p-2 rounded-lg border border-border-default hover:bg-bg-raised text-text-muted hover:text-text-primary transition-all"
          title="Refresh"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* ── Error Banner ── */}
      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-amber-500/25 bg-amber-500/8 p-4">
          <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-300">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-brand-primary animate-spin" />
        </div>
      ) : (
        <>
          {/* ── Connection Status Card ── */}
          <div className="rounded-2xl border border-border-default bg-bg-surface p-6">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${status?.connected ? 'bg-green-600/15 border border-green-500/30' : 'bg-bg-raised border border-border-default'}`}>
                  <Github className={`w-6 h-6 ${status?.connected ? 'text-green-400' : 'text-text-muted'}`} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-semibold text-text-primary">GitHub App</h2>
                    {status?.connected ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3" />Connected
                      </span>
                    ) : (
                      <span className="text-xs font-semibold text-text-muted bg-bg-raised border border-border-default px-2 py-0.5 rounded-full">
                        Not Connected
                      </span>
                    )}
                  </div>
                  {status?.connected && status.connection ? (
                    <p className="text-sm text-text-secondary mt-0.5">
                      {status.connection.githubAccount} · Connected {new Date(status.connection.connectedAt).toLocaleDateString()}
                    </p>
                  ) : (
                    <p className="text-sm text-text-muted mt-0.5">Install the GitHub App to connect your repositories</p>
                  )}
                </div>
              </div>
              {status?.connected ? (
                <button
                  onClick={() => void handleDisconnect()}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 text-sm font-semibold transition-all"
                >
                  <Link2Off className="w-4 h-4" />Disconnect
                </button>
              ) : (
                <button
                  onClick={() => void handleConnect()}
                  disabled={connecting}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-primary/80 text-white text-sm font-semibold transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {connecting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Link2 className="w-4 h-4" />}
                  {connecting ? 'Redirecting…' : 'Connect GitHub App'}
                </button>
              )}
            </div>
          </div>

          {/* ── Public Repo Scanner (always visible) ── */}
          <div className="rounded-2xl border border-border-default bg-bg-surface p-5">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-4 h-4 text-amber-400" />
              <h2 className="text-sm font-semibold text-text-primary">Public Repository Scanner</h2>
              <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full uppercase tracking-wider">No App Required</span>
            </div>
            <p className="text-xs text-text-muted mb-3">
              Instantly scan any public GitHub repository for deployment configuration issues — no GitHub App installation needed.
            </p>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Github className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type="url"
                  value={publicUrl}
                  onChange={(e) => setPublicUrl(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && void handlePublicScan()}
                  placeholder="https://github.com/owner/repository"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-bg-raised border border-border-default text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-primary/50 transition-colors"
                />
              </div>
              <button
                onClick={() => void handlePublicScan()}
                disabled={publicScanning || !publicUrl.trim()}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-400 text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {publicScanning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Scan className="w-4 h-4" />}
                {publicScanning ? 'Scanning…' : 'Scan'}
              </button>
            </div>
          </div>

          {/* ── Repositories Grid ── */}
          {repositories.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-widest mb-3">
                Repositories ({repositories.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {repositories.map((repo) => (
                  <RepoCard
                    key={repo.id}
                    repo={repo}
                    onScan={(id, branch) => void handleScan(id, branch)}
                    scanning={scanning === repo.id}
                  />
                ))}
              </div>
            </div>
          )}

          {/* ── Scan Results Panel ── */}
          {scanResult && selectedRepoId && (
            <div className="rounded-2xl border border-brand-primary/30 bg-bg-surface overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-border-default bg-brand-primary/5">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                  <div>
                    <h2 className="text-sm font-semibold text-text-primary">Scan Results</h2>
                    <p className="text-xs text-text-muted">{scanResult.repository.fullName}</p>
                  </div>
                </div>
                {scanResult.context && (
                  <CompletenessRing score={scanResult.context.completenessScore} />
                )}
              </div>

              <div className="p-5 space-y-5">
                {/* Tech Stack */}
                {scanResult.context && (
                  <div>
                    <h3 className="text-xs font-semibold text-text-muted uppercase tracking-widest mb-3">Detected Tech Stack</h3>
                    <div className="flex flex-wrap gap-2">
                      {scanResult.context.languages.map((l) => (
                        <StackChip key={l} label="Language" value={l} />
                      ))}
                      <StackChip label="Frontend" value={scanResult.context.frontendFramework} />
                      <StackChip label="Backend" value={scanResult.context.backendFramework} />
                      <StackChip label="Build" value={scanResult.context.buildTool} />
                      <StackChip label="Database" value={scanResult.context.databaseEngine} />
                      <StackChip label="ORM" value={scanResult.context.orm} />
                    </div>
                    {/* Infrastructure Flags */}
                    <div className="flex flex-wrap gap-2 mt-3">
                      {[
                        { key: 'dockerDetected', label: 'Docker' },
                        { key: 'dockerCompose', label: 'Compose' },
                        { key: 'nginxDetected', label: 'Nginx' },
                        { key: 'ciDetected', label: 'CI/CD' },
                        { key: 'prismaDetected', label: 'Prisma' },
                      ].map(({ key, label }) => {
                        const active = scanResult.context?.[key as keyof typeof scanResult.context] as boolean;
                        return (
                          <span
                            key={key}
                            className={`text-[11px] font-semibold px-2.5 py-1 rounded-full transition-all ${active ? 'bg-green-500/15 text-green-400 border border-green-500/25' : 'bg-bg-raised text-text-muted border border-border-default'}`}
                          >
                            {label}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Diagnostics */}
                {scanResult.diagnosticsCount > 0 ? (
                  <div>
                    <h3 className="text-xs font-semibold text-text-muted uppercase tracking-widest mb-3 flex items-center gap-2">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                      Diagnostics ({scanResult.diagnosticsCount})
                    </h3>
                    <div className="space-y-2">
                      {scanResult.diagnostics.map((d) => (
                        <DiagnosticCard key={d.id} diag={d} />
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 rounded-xl bg-green-500/8 border border-green-500/20 p-4">
                    <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-green-400">No Issues Detected</p>
                      <p className="text-xs text-text-muted">Configuration files passed all diagnostic rules.</p>
                    </div>
                  </div>
                )}

                {/* Action CTA */}
                <div className="flex items-center gap-2 pt-2">
                  <a
                    href="/diagnosis"
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-primary text-white text-sm font-semibold hover:bg-brand-primary/80 transition-all"
                  >
                    Open AI Diagnosis <ArrowRight className="w-4 h-4" />
                  </a>
                  <a
                    href={`/labs`}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border-default text-text-secondary text-sm font-semibold hover:bg-bg-raised transition-all"
                  >
                    <BookOpen className="w-4 h-4" /> Run Scenario Labs
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* ── Empty State (no repos, not loading) ── */}
          {!loading && repositories.length === 0 && !scanResult && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 rounded-2xl bg-violet-600/15 border border-violet-500/25 flex items-center justify-center mb-4">
                <Github className="w-8 h-8 text-violet-400" />
              </div>
              <h3 className="text-base font-semibold text-text-primary mb-1">No repositories connected</h3>
              <p className="text-sm text-text-muted max-w-xs mb-6">
                Connect your GitHub App to analyse private repositories, or use the public scanner above for instant results.
              </p>
              <button
                onClick={() => void handleConnect()}
                disabled={connecting}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-all"
              >
                <Link2 className="w-4 h-4" /> Connect GitHub App
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
