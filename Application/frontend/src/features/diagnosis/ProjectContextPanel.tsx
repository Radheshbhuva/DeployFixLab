import React, { useState } from 'react';
import { useDiagnosisStore } from '@/store/diagnosisStore';
import { ContextCompletenessGauge } from '@/components/ui/ContextCompletenessGauge';
import { FileUploadZone } from './FileUploadZone';
import { Globe, FileUp, Github, CheckCircle2, ArrowRight, Layers, AlertCircle, RotateCcw, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';

export const ProjectContextPanel: React.FC = () => {
  const {
    projectContext,
    connectWebsite,
    disconnectWebsite,
    uploadFile,
    removeUploadedFile,
    connectGitHub,
    disconnectGitHub,
    clearAllSources,
    loadSampleSources,
    runFullDiagnosis,
    isAnalyzing,
    error,
  } = useDiagnosisStore();

  const { completeness, sources } = projectContext;

  const activeSourcesCount = [
    Boolean(sources.website?.connected && sources.website?.url),
    Boolean(sources.uploads?.connected && sources.uploads?.files && sources.uploads.files.length > 0),
    Boolean(sources.github?.connected),
  ].filter(Boolean).length;

  // Modals state
  const [showWebsiteModal, setShowWebsiteModal] = useState(false);
  const [websiteInputUrl, setWebsiteInputUrl] = useState(sources.website.url || 'https://my-shop.railway.app');

  const [showGitHubModal, setShowGitHubModal] = useState(false);
  const [githubOwner, setGithubOwner] = useState('Radheshbhuva');
  const [githubRepo, setGithubRepo] = useState('DeployFixLab');
  const [githubBranch, setGithubBranch] = useState('main');

  const handleWebsiteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!websiteInputUrl) return;
    connectWebsite(websiteInputUrl);
    setShowWebsiteModal(false);
  };

  const handleGitHubSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    connectGitHub(githubOwner, githubRepo, githubBranch);
    setShowGitHubModal(false);
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header & Title */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-border-default pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-brand-primary" />
            <h2 className="text-xl font-bold text-text-primary">Project Context Engine</h2>
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-mono font-semibold border ${
                activeSourcesCount >= 1
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                  : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
              }`}
            >
              {activeSourcesCount}/3 Sources Connected
            </span>
          </div>
          <p className="text-xs text-text-secondary mt-1">
            Correlates evidence across Website URL, File Uploads, and GitHub Repository. Select at least <strong>1 of 3</strong> sources to diagnose.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {activeSourcesCount > 0 ? (
            <Button variant="ghost" size="sm" onClick={clearAllSources} title="Reset all connected sources">
              <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
              Clear All
            </Button>
          ) : (
            <Button variant="ghost" size="sm" onClick={loadSampleSources} title="Load sample incident context">
              <Sparkles className="w-3.5 h-3.5 mr-1.5 text-brand-primary" />
              Load Sample Context
            </Button>
          )}

          <Button
            variant="primary"
            size="md"
            isLoading={isAnalyzing}
            disabled={!completeness.canRunDiagnosis || isAnalyzing}
            onClick={runFullDiagnosis}
            className="shadow-lg shadow-blue-500/20"
            title={!completeness.canRunDiagnosis ? 'Connect at least 1 context source to run diagnosis' : 'Run AI Diagnosis'}
          >
            <div className="flex items-center gap-2">
              <span>🔬 Run Diagnosis Engine</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </Button>
        </div>
      </div>

      {/* Error Alert if Validation Fails */}
      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-semibold block mb-0.5">Validation Rule Triggered</span>
            {error}
          </div>
        </div>
      )}

      {/* Empty State Banner when 0 sources are connected */}
      {activeSourcesCount === 0 && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-500" />
          <div>
            <span className="font-semibold block mb-0.5">No Context Connected</span>
            Please connect at least <strong>1 of the 3 context sources</strong> below (Website URL, File Uploads, or GitHub Repository) to synthesize evidence and run the AI Diagnosis.
          </div>
        </div>
      )}

      {/* Context Completeness Gauge Component */}
      <ContextCompletenessGauge completeness={completeness} />

      {/* 3 Source Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
        {/* Source 1: Website URL */}
        <div className="bg-bg-surface border border-border-default rounded-xl p-4 space-y-3 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-text-primary text-sm">Website URL</h4>
                  <span className="text-[11px] text-text-muted">Public Endpoint Probe</span>
                </div>
              </div>

              {sources.website.connected ? (
                <span className="flex items-center gap-1 text-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Connected (+30%)
                </span>
              ) : (
                <span className="text-xs text-text-muted bg-bg-raised border border-border-default px-2 py-0.5 rounded font-mono">+30%</span>
              )}
            </div>

            {sources.website.connected ? (
              <div className="mt-3 bg-bg-raised border border-border-default rounded-lg p-3 text-xs space-y-1">
                <div className="font-mono text-text-primary truncate">{sources.website.url}</div>
                <div className="flex items-center justify-between text-text-muted text-[11px] pt-1">
                  <span>HTTP {sources.website.httpStatus} (502 Gateway)</span>
                  <span className="text-status-warning">TLS Valid (248d)</span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-text-secondary mt-2">
                Provide a staging or production URL to test live HTTP status, TLS handshake, and reverse proxy headers.
              </p>
            )}
          </div>

          <div className="pt-2 border-t border-border-default flex justify-end gap-2">
            {sources.website.connected ? (
              <Button variant="ghost" size="sm" onClick={disconnectWebsite}>
                Disconnect
              </Button>
            ) : (
              <Button variant="primary" size="sm" onClick={() => setShowWebsiteModal(true)}>
                Inspect URL
              </Button>
            )}
          </div>
        </div>

        {/* Source 2: File Uploads */}
        <div className="bg-bg-surface border border-border-default rounded-xl p-4 space-y-3 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500">
                  <FileUp className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-text-primary text-sm">File Uploads</h4>
                  <span className="text-[11px] text-text-muted">Configs & Logs</span>
                </div>
              </div>

              {sources.uploads.connected && (sources.uploads.files?.length || 0) > 0 ? (
                <span className="flex items-center gap-1 text-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" /> {sources.uploads.files.length} Files (+35%)
                </span>
              ) : (
                <span className="text-xs text-text-muted bg-bg-raised border border-border-default px-2 py-0.5 rounded font-mono">+35%</span>
              )}
            </div>

            {/* Drag & Drop Upload Zone */}
            <div className="mt-3">
              <FileUploadZone
                files={sources.uploads.files || []}
                onUpload={uploadFile}
                onRemove={removeUploadedFile}
                error={error}
              />
            </div>
          </div>
        </div>

        {/* Source 3: GitHub Repository */}
        <div className="bg-bg-surface border border-border-default rounded-xl p-4 space-y-3 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-500">
                  <Github className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-text-primary text-sm">GitHub Repository</h4>
                  <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">Code & CI Sync</span>
                </div>
              </div>

              {sources.github.connected ? (
                <span className="flex items-center gap-1 text-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Synced (+35%)
                </span>
              ) : (
                <span className="text-xs text-text-muted bg-bg-raised border border-border-default px-2 py-0.5 rounded font-mono">+35%</span>
              )}
            </div>

            {sources.github.connected ? (
              <div className="mt-3 bg-bg-raised border border-border-default rounded-lg p-3 text-xs space-y-1">
                <div className="font-semibold text-text-primary">
                  {sources.github.repoOwner}/{sources.github.repoName}
                </div>
                <div className="text-text-muted text-[11px]">
                  Branch: <span className="font-mono text-text-primary">{sources.github.branch}</span> • Synced {sources.github.syncedAt}
                </div>
                <div className="text-[11px] text-indigo-500 font-medium pt-1">
                  ✓ {sources.github.artifactsCount || 6} repository artifacts parsed
                </div>
              </div>
            ) : (
              <p className="text-xs text-text-secondary mt-2">
                Connect your repository to auto-sync Dockerfiles, docker-compose.yml, GitHub Actions workflows, and recent commit diffs.
              </p>
            )}
          </div>

          <div className="pt-2 border-t border-border-default flex justify-end gap-2">
            {sources.github.connected ? (
              <Button variant="ghost" size="sm" onClick={disconnectGitHub}>
                Disconnect
              </Button>
            ) : (
              <Button variant="primary" size="sm" onClick={() => setShowGitHubModal(true)}>
                Connect Repo
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Website Inspection Modal */}
      <Modal isOpen={showWebsiteModal} onClose={() => setShowWebsiteModal(false)} title="Inspect Website URL">
        <form onSubmit={handleWebsiteSubmit} className="space-y-4">
          <Input
            label="Target Website URL"
            value={websiteInputUrl}
            onChange={(e) => setWebsiteInputUrl(e.target.value)}
            placeholder="https://your-app.railway.app"
            required
          />
          <p className="text-xs text-text-muted">
            DeployFix will perform a public HTTP inspection (HTTP status, TLS validity, server headers). No private credentials or internal data are accessed.
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => setShowWebsiteModal(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Inspect URL
            </Button>
          </div>
        </form>
      </Modal>

      {/* GitHub Connect Modal */}
      <Modal isOpen={showGitHubModal} onClose={() => setShowGitHubModal(false)} title="Connect GitHub Repository">
        <form onSubmit={handleGitHubSubmit} className="space-y-4">
          <Input
            label="Repository Owner"
            value={githubOwner}
            onChange={(e) => setGithubOwner(e.target.value)}
            required
          />
          <Input
            label="Repository Name"
            value={githubRepo}
            onChange={(e) => setGithubRepo(e.target.value)}
            required
          />
          <Input
            label="Target Branch"
            value={githubBranch}
            onChange={(e) => setGithubBranch(e.target.value)}
            required
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => setShowGitHubModal(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Connect Repository
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
