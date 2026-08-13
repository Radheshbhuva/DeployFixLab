import React, { useState } from 'react';
import { useDiagnosisStore } from '@/store/diagnosisStore';
import { ContextCompletenessGauge } from '@/components/ui/ContextCompletenessGauge';
import { FileUploadZone } from './FileUploadZone';
import { Globe, FileUp, Github, Rocket, CheckCircle2, ArrowRight, Layers } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';

export const ProjectContextPanel: React.FC = () => {
  const {
    projectContext,
    connectWebsite,
    uploadFile,
    removeUploadedFile,
    connectGitHub,
    disconnectGitHub,
    connectDeployment,
    disconnectDeployment,
    runFullDiagnosis,
    isAnalyzing,
    error,
  } = useDiagnosisStore();

  const { completeness, sources } = projectContext;

  // Modals state
  const [showWebsiteModal, setShowWebsiteModal] = useState(false);
  const [websiteInputUrl, setWebsiteInputUrl] = useState(sources.website.url || 'https://my-shop.railway.app');

  const [showGitHubModal, setShowGitHubModal] = useState(false);
  const [githubOwner, setGithubOwner] = useState('Radheshbhuva');
  const [githubRepo, setGithubRepo] = useState('DeployFixLab');
  const [githubBranch, setGithubBranch] = useState('main');

  const [showDeploymentModal, setShowDeploymentModal] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<'railway' | 'render' | 'vercel' | 'flyio' | 'other'>('railway');
  const [serviceName, setServiceName] = useState('my-shop-api');

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

  const handleDeploymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    connectDeployment(selectedPlatform, serviceName);
    setShowDeploymentModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-400" />
            <h2 className="text-xl font-bold text-slate-100">Project Context Engine</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Correlates evidence across Website URL, File Uploads, GitHub, and Deployment Platform.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          isLoading={isAnalyzing}
          disabled={!completeness.canRunDiagnosis || isAnalyzing}
          onClick={runFullDiagnosis}
          className="shadow-lg shadow-indigo-500/20"
        >
          <div className="flex items-center gap-2">
            <span>🔬 Run Diagnosis Engine</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </Button>
      </div>

      {/* Context Completeness Gauge */}
      <ContextCompletenessGauge completeness={completeness} />

      {/* 4 Context Sources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Source 1: Website URL (V1 MVP) */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-100 text-sm">Website URL Inspection</h4>
                  <span className="text-[11px] text-emerald-400 font-medium">Public Observation (V1)</span>
                </div>
              </div>

              {sources.website.connected ? (
                <span className="flex items-center gap-1 text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Connected (+20%)
                </span>
              ) : (
                <span className="text-xs text-slate-400 bg-slate-800 px-2 py-0.5 rounded font-mono">+20%</span>
              )}
            </div>

            {sources.website.connected ? (
              <div className="mt-3 bg-slate-950/60 border border-slate-800 rounded-lg p-3 text-xs space-y-1.5 font-mono">
                <div className="text-slate-300 truncate font-semibold">{sources.website.url}</div>
                <div className="flex items-center gap-3 text-slate-400 text-[11px]">
                  <span className="text-red-400 font-bold">HTTP {sources.website.httpStatus}</span>
                  <span>TLS: {sources.website.tlsValid ? '✅ Valid' : '❌ Invalid'}</span>
                  <span>Server: {sources.website.serverHeader}</span>
                  <span>{sources.website.responseTimeMs}ms</span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400 mt-2">
                Inspect public HTTP headers, TLS certificate, and status code (Headless observation).
              </p>
            )}
          </div>

          <div className="pt-2 border-t border-slate-800/60 flex justify-end">
            <Button variant="ghost" size="sm" onClick={() => setShowWebsiteModal(true)}>
              {sources.website.connected ? 'Update URL' : 'Inspect URL'}
            </Button>
          </div>
        </div>

        {/* Source 2: Manual File Upload (V1 MVP) */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
                  <FileUp className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-100 text-sm">Deployment File Uploads</h4>
                  <span className="text-[11px] text-indigo-400 font-medium">Configuration & Logs (V1)</span>
                </div>
              </div>

              {sources.uploads.connected ? (
                <span className="flex items-center gap-1 text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Connected (+35%)
                </span>
              ) : (
                <span className="text-xs text-slate-400 bg-slate-800 px-2 py-0.5 rounded font-mono">+35%</span>
              )}
            </div>

            <div className="mt-3">
              <FileUploadZone
                files={sources.uploads.files}
                onUpload={uploadFile}
                onRemove={removeUploadedFile}
                error={error}
              />
            </div>
          </div>
        </div>

        {/* Source 3: GitHub Repository (V2 Feature) */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
                  <Github className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-100 text-sm">GitHub Repository</h4>
                  <span className="text-[11px] text-purple-400 font-medium">Code & Architecture (V2)</span>
                </div>
              </div>

              {sources.github.connected ? (
                <span className="flex items-center gap-1 text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Connected (+25%)
                </span>
              ) : (
                <span className="text-xs text-slate-400 bg-slate-800 px-2 py-0.5 rounded font-mono">+25%</span>
              )}
            </div>

            {sources.github.connected ? (
              <div className="mt-3 bg-slate-950/60 border border-slate-800 rounded-lg p-3 text-xs space-y-1">
                <div className="font-semibold text-slate-200">
                  {sources.github.repoOwner}/{sources.github.repoName}
                </div>
                <div className="text-slate-400 text-[11px]">
                  Branch: <span className="text-indigo-400 font-mono">{sources.github.branch}</span> · Synced {sources.github.syncedAt}
                </div>
                <div className="text-emerald-400 text-[11px] pt-1">
                  ✓ {sources.github.artifactsCount} repository artifacts ingested (Dockerfile, package.json, nginx.conf)
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400 mt-2">
                Connect GitHub to automatically analyze Dockerfile, docker-compose.yml, package.json, and CI/CD workflows.
              </p>
            )}
          </div>

          <div className="pt-2 border-t border-slate-800/60 flex justify-end gap-2">
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

        {/* Source 4: Deployment Platform (V3 Feature) */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                  <Rocket className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-100 text-sm">Deployment Platform</h4>
                  <span className="text-[11px] text-blue-400 font-medium">Runtime Operations (V3)</span>
                </div>
              </div>

              {sources.deployment.connected ? (
                <span className="flex items-center gap-1 text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Connected (+20%)
                </span>
              ) : (
                <span className="text-xs text-slate-400 bg-slate-800 px-2 py-0.5 rounded font-mono">+20%</span>
              )}
            </div>

            {sources.deployment.connected ? (
              <div className="mt-3 bg-slate-950/60 border border-slate-800 rounded-lg p-3 text-xs space-y-1">
                <div className="font-semibold text-slate-200 capitalize">
                  {sources.deployment.platform} — {sources.deployment.serviceName}
                </div>
                <div className="text-red-400 font-medium text-[11px]">
                  Status: 🔴 {sources.deployment.status?.toUpperCase()} (Deploy {sources.deployment.lastDeployAt})
                </div>
                {sources.deployment.runtimeLogsSnippet && (
                  <div className="bg-slate-900 text-red-300 font-mono text-[10px] p-2 rounded mt-1 overflow-x-auto truncate border border-slate-800">
                    {sources.deployment.runtimeLogsSnippet}
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-slate-400 mt-2">
                Connect Railway, Render, Vercel, or Fly.io to ingest deployment build logs, runtime crash traces, and environment metadata.
              </p>
            )}
          </div>

          <div className="pt-2 border-t border-slate-800/60 flex justify-end gap-2">
            {sources.deployment.connected ? (
              <Button variant="ghost" size="sm" onClick={() => disconnectDeployment()}>
                Disconnect
              </Button>
            ) : (
              <Button variant="primary" size="sm" onClick={() => setShowDeploymentModal(true)}>
                Connect Platform
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
          <p className="text-xs text-slate-400">
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

      {/* GitHub Connect Modal (V2 Spec) */}
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

      {/* Deployment Connect Modal (V3 Spec) */}
      <Modal isOpen={showDeploymentModal} onClose={() => setShowDeploymentModal(false)} title="Connect Deployment Platform">
        <form onSubmit={handleDeploymentSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Select Platform</label>
            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value as any)}
              className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-sm rounded-lg p-2.5 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="railway">Railway</option>
              <option value="render">Render</option>
              <option value="vercel">Vercel</option>
              <option value="flyio">Fly.io</option>
              <option value="other">Other Platform</option>
            </select>
          </div>
          <Input
            label="Service / App Name"
            value={serviceName}
            onChange={(e) => setServiceName(e.target.value)}
            required
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => setShowDeploymentModal(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Connect Platform
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
