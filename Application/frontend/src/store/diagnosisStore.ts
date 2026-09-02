import { create } from 'zustand';
import {
  EvidenceSource,
  DiagnosisOutput,
  ProjectContextModel,
  ContextCompletenessScore,
  UploadedFile,
  CompletenessLevel,
  ContextSourceId
} from '@/types/diagnosis.types';

export function computeCompleteness(sources: ProjectContextModel['sources']): ContextCompletenessScore {
  let websiteScore = 0;
  let uploadsScore = 0;
  let githubScore = 0;

  const hasWebsite = Boolean(sources.website?.connected && sources.website?.url);
  const hasUploads = Boolean(sources.uploads?.connected && sources.uploads?.files && sources.uploads.files.length > 0);
  const hasGithub = Boolean(sources.github?.connected);

  if (hasWebsite) websiteScore = 30;

  if (hasUploads) {
    uploadsScore = 15;
    const fileTypes = new Set(sources.uploads.files.map((f) => f.type));
    if (fileTypes.has('dockerfile')) uploadsScore += 5;
    if (fileTypes.has('nginx_conf') || fileTypes.has('docker_compose')) uploadsScore += 5;
    if (fileTypes.has('log')) uploadsScore += 5;
    if (fileTypes.has('env_example')) uploadsScore += 5;
    uploadsScore = Math.min(35, uploadsScore);
  }

  if (hasGithub) githubScore = 35;

  const totalScore = websiteScore + uploadsScore + githubScore;
  const activeSourcesCount = [hasWebsite, hasUploads, hasGithub].filter(Boolean).length;
  const canRunDiagnosis = activeSourcesCount >= 1;

  let level: CompletenessLevel = 'none';
  if (totalScore === 0) level = 'none';
  else if (totalScore <= 30) level = 'minimal';
  else if (totalScore <= 50) level = 'low';
  else if (totalScore <= 70) level = 'moderate';
  else if (totalScore <= 90) level = 'strong';
  else level = 'comprehensive';

  let nextRecommendedSource: ContextSourceId | undefined;
  let nextSourceGain = 0;

  if (!hasWebsite) {
    nextRecommendedSource = 'website';
    nextSourceGain = 30;
  } else if (!hasUploads) {
    nextRecommendedSource = 'uploads';
    nextSourceGain = 35;
  } else if (!hasGithub) {
    nextRecommendedSource = 'github';
    nextSourceGain = 35;
  }

  let maxConfidence = 0;
  if (!canRunDiagnosis) {
    maxConfidence = 0;
  } else if (activeSourcesCount === 1) {
    maxConfidence = 60;
  } else if (activeSourcesCount === 2) {
    maxConfidence = 80;
  } else {
    maxConfidence = 96;
  }

  return {
    score: totalScore,
    level,
    sourceContributions: {
      website: websiteScore,
      uploads: uploadsScore,
      github: githubScore,
    },
    nextRecommendedSource,
    nextSourceGain,
    canRunDiagnosis,
    maxConfidence,
  };
}

const initialSources: ProjectContextModel['sources'] = {
  website: {
    connected: true,
    url: 'https://my-shop.railway.app',
    inspectedAt: '2026-08-13 17:40',
    httpStatus: 502,
    httpsEnabled: true,
    tlsValid: true,
    serverHeader: 'nginx/1.24.0',
    responseTimeMs: 1240,
    errorPageDetected: true,
  },
  uploads: {
    connected: true,
    files: [
      { id: 'f-1', name: 'Dockerfile', type: 'dockerfile', sizeBytes: 2450, status: 'complete', evidenceCount: 3 },
      { id: 'f-2', name: 'docker-compose.yml', type: 'docker_compose', sizeBytes: 3120, status: 'complete', evidenceCount: 5 },
      { id: 'f-3', name: 'nginx.conf', type: 'nginx_conf', sizeBytes: 1890, status: 'complete', evidenceCount: 2 },
      { id: 'f-4', name: 'app.log', type: 'log', sizeBytes: 14200, status: 'complete', evidenceCount: 7 },
    ],
    totalEvidenceCount: 17,
  },
  github: { connected: false },
};

const initialCompleteness = computeCompleteness(initialSources);

export interface DiagnosisState {
  sources: EvidenceSource[];
  projectContext: ProjectContextModel;
  isAnalyzing: boolean;
  currentDiagnosis: DiagnosisOutput | null;
  diagnosisHistory: DiagnosisOutput[];
  error: string | null;

  // Context Source Operations
  connectWebsite: (url: string) => void;
  disconnectWebsite: () => void;
  uploadFile: (file: { name: string; type: UploadedFile['type']; sizeBytes: number; content?: string }) => void;
  removeUploadedFile: (id: string) => void;
  clearAllFiles: () => void;
  connectGitHub: (owner: string, repo: string, branch: string) => void;
  disconnectGitHub: () => void;
  clearAllSources: () => void;
  loadSampleSources: () => void;

  // Standard Store Actions
  addSource: (source: EvidenceSource) => void;
  removeSource: (id: string) => void;
  updateSource: (id: string, value: string) => void;
  setAnalyzing: (isAnalyzing: boolean) => void;
  runFullDiagnosis: () => void;
  setDiagnosis: (output: DiagnosisOutput | null) => void;
  clearDiagnosis: () => void;
  setError: (msg: string | null) => void;
}

export const useDiagnosisStore = create<DiagnosisState>((set, get) => ({
  sources: [],
  projectContext: {
    projectId: 'proj-001',
    projectName: 'MyShop Platform',
    createdAt: new Date().toISOString(),
    sources: initialSources,
    completeness: initialCompleteness,
  },
  isAnalyzing: false,
  currentDiagnosis: null,
  diagnosisHistory: [],
  error: null,

  connectWebsite: (url) => {
    set((state) => {
      const updatedWebsite = {
        connected: true,
        url,
        inspectedAt: new Date().toISOString().substring(0, 16).replace('T', ' '),
        httpStatus: 502,
        httpsEnabled: url.startsWith('https'),
        tlsValid: true,
        serverHeader: 'nginx/1.24.0',
        responseTimeMs: 1240,
        errorPageDetected: true,
      };

      const updatedSources = { ...state.projectContext.sources, website: updatedWebsite };
      const completeness = computeCompleteness(updatedSources);

      return {
        error: null,
        projectContext: {
          ...state.projectContext,
          sources: updatedSources,
          completeness,
        },
      };
    });
  },

  disconnectWebsite: () => {
    set((state) => {
      const updatedSources = {
        ...state.projectContext.sources,
        website: { connected: false, url: undefined },
      };
      const completeness = computeCompleteness(updatedSources);
      return {
        projectContext: {
          ...state.projectContext,
          sources: updatedSources,
          completeness,
        },
      };
    });
  },

  uploadFile: ({ name, type, sizeBytes }) => {
    // Secret rejection rule check
    if (name.includes('.env') && !name.includes('.example')) {
      set({ error: 'This file appears to contain real secrets. DeployFix cannot accept files with private credentials. Please use .env.example format.' });
      return;
    }

    const newFile: UploadedFile = {
      id: `file-${Date.now()}`,
      name,
      type,
      sizeBytes,
      status: 'complete',
      evidenceCount: 3,
    };

    set((state) => {
      const currentFiles = state.projectContext.sources.uploads.files || [];
      const updatedFiles = [...currentFiles, newFile];
      const updatedUploads = {
        connected: true,
        files: updatedFiles,
        totalEvidenceCount: updatedFiles.reduce((acc, f) => acc + (f.evidenceCount || 0), 0),
      };

      const updatedSources = { ...state.projectContext.sources, uploads: updatedUploads };
      const completeness = computeCompleteness(updatedSources);

      return {
        error: null,
        projectContext: {
          ...state.projectContext,
          sources: updatedSources,
          completeness,
        },
      };
    });
  },

  removeUploadedFile: (id) => {
    set((state) => {
      const updatedFiles = (state.projectContext.sources.uploads.files || []).filter((f) => f.id !== id);
      const updatedUploads = {
        connected: updatedFiles.length > 0,
        files: updatedFiles,
        totalEvidenceCount: updatedFiles.reduce((acc, f) => acc + (f.evidenceCount || 0), 0),
      };

      const updatedSources = { ...state.projectContext.sources, uploads: updatedUploads };
      const completeness = computeCompleteness(updatedSources);

      return {
        projectContext: {
          ...state.projectContext,
          sources: updatedSources,
          completeness,
        },
      };
    });
  },

  clearAllFiles: () => {
    set((state) => {
      const updatedUploads = {
        connected: false,
        files: [],
        totalEvidenceCount: 0,
      };
      const updatedSources = { ...state.projectContext.sources, uploads: updatedUploads };
      const completeness = computeCompleteness(updatedSources);

      return {
        projectContext: {
          ...state.projectContext,
          sources: updatedSources,
          completeness,
        },
      };
    });
  },

  connectGitHub: (owner, repo, branch) => {
    set((state) => {
      const updatedGitHub = {
        connected: true,
        repoOwner: owner,
        repoName: repo,
        branch,
        syncedAt: 'Just now',
        artifactsCount: 6,
      };

      const updatedSources = { ...state.projectContext.sources, github: updatedGitHub };
      const completeness = computeCompleteness(updatedSources);

      return {
        error: null,
        projectContext: {
          ...state.projectContext,
          sources: updatedSources,
          completeness,
        },
      };
    });
  },

  disconnectGitHub: () => {
    set((state) => {
      const updatedSources = { ...state.projectContext.sources, github: { connected: false } };
      const completeness = computeCompleteness(updatedSources);
      return {
        projectContext: {
          ...state.projectContext,
          sources: updatedSources,
          completeness,
        },
      };
    });
  },

  clearAllSources: () => {
    set((state) => {
      const clearedSources: ProjectContextModel['sources'] = {
        website: { connected: false },
        uploads: { connected: false, files: [], totalEvidenceCount: 0 },
        github: { connected: false },
      };
      const completeness = computeCompleteness(clearedSources);
      return {
        projectContext: {
          ...state.projectContext,
          sources: clearedSources,
          completeness,
        },
        currentDiagnosis: null,
        error: null,
      };
    });
  },

  loadSampleSources: () => {
    set((state) => {
      const sampleSources: ProjectContextModel['sources'] = {
        website: {
          connected: true,
          url: 'https://my-shop.railway.app',
          inspectedAt: '2026-08-13 17:40',
          httpStatus: 502,
          httpsEnabled: true,
          tlsValid: true,
          serverHeader: 'nginx/1.24.0',
          responseTimeMs: 1240,
          errorPageDetected: true,
        },
        uploads: {
          connected: true,
          files: [
            { id: 'f-1', name: 'Dockerfile', type: 'dockerfile', sizeBytes: 2450, status: 'complete', evidenceCount: 3 },
            { id: 'f-2', name: 'docker-compose.yml', type: 'docker_compose', sizeBytes: 3120, status: 'complete', evidenceCount: 5 },
            { id: 'f-3', name: 'nginx.conf', type: 'nginx_conf', sizeBytes: 1890, status: 'complete', evidenceCount: 2 },
            { id: 'f-4', name: 'app.log', type: 'log', sizeBytes: 14200, status: 'complete', evidenceCount: 7 },
          ],
          totalEvidenceCount: 17,
        },
        github: { connected: false },
      };
      const completeness = computeCompleteness(sampleSources);
      return {
        projectContext: {
          ...state.projectContext,
          sources: sampleSources,
          completeness,
        },
        error: null,
      };
    });
  },

  addSource: (source) => set((state) => ({ sources: [...state.sources, source] })),
  removeSource: (id) => set((state) => ({ sources: state.sources.filter((s) => s.id !== id) })),
  updateSource: (id, value) =>
    set((state) => ({
      sources: state.sources.map((s) => (s.id === id ? { ...s, value } : s)),
    })),

  setAnalyzing: (isAnalyzing) => set({ isAnalyzing }),

  runFullDiagnosis: () => {
    const { projectContext } = get();
    const { completeness, sources } = projectContext;

    if (!completeness.canRunDiagnosis) {
      set({
        error:
          'Diagnosis cannot run. Please select or connect at least 1 of the 3 context sources (Website URL, File Uploads, or GitHub Repository).',
      });
      return;
    }

    set({ isAnalyzing: true, error: null });

    setTimeout(() => {
      // Sources list
      const activeSources: string[] = [];
      if (sources.website.connected) activeSources.push('Website URL');
      if (sources.uploads.connected) activeSources.push('Uploaded Files');
      if (sources.github.connected) activeSources.push('GitHub Repository');

      // Qualification statement
      let qualification = `Based on evidence from ${activeSources.join(' + ')}.`;
      if (!sources.github.connected) {
        qualification += ' Connect GitHub to enable deep code analysis.';
      }

      // Calculated score capped by completeness maxConfidence
      const rawScore = 78;
      const confidenceScore = Math.min(rawScore, completeness.maxConfidence);

      const diagnosisResult: DiagnosisOutput = {
        id: `diag-${Date.now()}`,
        sessionId: 'sess-active',
        createdAt: new Date().toISOString().substring(0, 16).replace('T', ' '),
        problem: '502 Bad Gateway / Upstream Service Connection Refused',
        rootCause: 'Port Configuration Mismatch: Container exposes port 5000, but reverse proxy (nginx) routes traffic to localhost:3000. The application container is running, but nginx cannot reach the service.',
        confidenceScore,
        confidenceLevel: confidenceScore >= 75 ? 'HIGH' : confidenceScore >= 50 ? 'MEDIUM' : 'LOW',
        contextQualification: qualification,
        sourcesUsed: activeSources,
        affectedServices: ['web-gateway', 'api-server'],
        evidence: [
          {
            finding: 'Dockerfile specifies EXPOSE 5000',
            source: 'DOCKERFILE',
            sourceLabel: 'Uploaded Dockerfile',
            severity: 'critical',
          },
          {
            finding: 'nginx.conf contains proxy_pass http://localhost:3000',
            source: 'CONFIG_FILE',
            sourceLabel: 'Uploaded nginx.conf',
            severity: 'critical',
          },
          {
            finding: 'Public HTTP Inspection returned 502 Bad Gateway',
            source: 'PRODUCTION_URL',
            sourceLabel: 'Website URL Inspection',
            severity: 'critical',
          },
          {
            finding: 'Runtime log: connect ECONNREFUSED 0.0.0.0:5000',
            source: 'LOG_TEXT',
            sourceLabel: 'Application Logs',
            severity: 'major',
          },
        ],
        recoverySteps: [
          {
            stepNumber: 1,
            title: 'Align Container Exposed Port in Dockerfile',
            description: 'Change exposed port to match the nginx upstream proxy setting (3000), or update app server binding.',
            command: 'sed -i "s/EXPOSE 5000/EXPOSE 3000/g" Dockerfile',
            codeDiff: {
              file: 'Dockerfile',
              oldCode: 'EXPOSE 5000\nCMD ["npm", "start"]',
              newCode: 'EXPOSE 3000\nCMD ["npm", "start"]',
            },
            verification: 'Run `docker build -t app .` and verify container binds port 3000',
          },
          {
            stepNumber: 2,
            title: 'Update Nginx Proxy Target Configuration',
            description: 'Alternatively, update nginx.conf proxy_pass to forward incoming traffic to port 5000.',
            command: 'sed -i "s/3000/5000/g" nginx.conf && nginx -s reload',
            codeDiff: {
              file: 'nginx.conf',
              oldCode: 'location / {\n  proxy_pass http://localhost:3000;\n}',
              newCode: 'location / {\n  proxy_pass http://localhost:5000;\n}',
            },
            verification: 'Execute `curl -I https://my-shop.railway.app` and expect HTTP 200 OK',
          },
        ],
        verificationChecklist: [
          'Verify Docker container environment variable PORT is set to match proxy target',
          'Ensure nginx configuration passes Host and X-Forwarded-For headers correctly',
          'Run automated verification request to confirm HTTP 200 response',
        ],
      };

      set((state) => ({
        currentDiagnosis: diagnosisResult,
        diagnosisHistory: [diagnosisResult, ...state.diagnosisHistory],
        isAnalyzing: false,
      }));
    }, 1500);
  },

  setDiagnosis: (currentDiagnosis) => set({ currentDiagnosis, isAnalyzing: false }),
  clearDiagnosis: () => set({ currentDiagnosis: null, error: null }),
  setError: (error) => set({ error, isAnalyzing: false }),
}));
