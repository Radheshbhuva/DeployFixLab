# 04 — DeployFix Lab: 4-Source Evidence Ingestion Showcase Specification

---

## Document Metadata

| Field | Value |
|---|---|
| **Document Name** | 4-Source Evidence Ingestion Showcase Specification |
| **Document ID** | DFIX-SPEC-021-04 |
| **Version** | 1.0.0 |
| **Status** | Approved |
| **Component** | `ContextSourcesShowcase.tsx` |

---

## 1. Section Positioning & Narrative

DeployFix Lab's primary technical moat is its **Multi-Source Context Ingestion Engine**.

Generic troubleshooting tools look at a single stack trace. DeployFix Lab simultaneously digests **4 distinct architectural layers**:

```
                         ┌────────────────────────────────────────────────────────┐
                         │           4-SOURCE EVIDENCE CORRELATION               │
                         └───────────────────────────┬────────────────────────────┘
                                                     │
             ┌───────────────────────┬───────────────┴───────────────┬───────────────────────┐
             ▼                       ▼                               ▼                       ▼
    ┌─────────────────┐    ┌─────────────────┐             ┌─────────────────┐     ┌─────────────────┐
    │ 🌐 WEBSITE URL  │    │ 📁 FILE UPLOADS │             │ 🐙 GITHUB REPO  │     │ ☁️ DEPLOY CLOUD │
    │ • HTTP Status   │    │ • Dockerfiles   │             │ • Commit Diffs  │     │ • Vercel / ECS  │
    │ • DNS Latency   │    │ • Compose YAML  │             │ • Workflows     │     │ • Container Log │
    │ • TLS Expiry    │    │ • Secret Filter │             │ • Tree Struct   │     │ • Exit Codes    │
    └─────────────────┘    └─────────────────┘             └─────────────────┘     └─────────────────┘
             │                       │                               │                       │
             └───────────────────────┴───────────────┬───────────────┴───────────────────────┘
                                                     ▼
                                     ┌───────────────────────────────┐
                                     │  CONTEXT COMPLETENESS: 100%   │
                                     │  CONFIDENCE CAPPED: 98% MAX   │
                                     └───────────────────────────────┘
```

---

## 2. Interactive Tabbed Interface Specification

The `ContextSourcesShowcase.tsx` component features a 4-tab interactive switcher where users can inspect real input formats, security rules, and output telemetry:

```tsx
export interface ContextSourceData {
  id: 'url' | 'files' | 'github' | 'deployment';
  title: string;
  badge: string;
  icon: string;
  description: string;
  capabilities: string[];
  securityNote: string;
  codeSnippet: string;
  previewMetrics: {
    label: string;
    value: string;
    status: 'good' | 'warn' | 'neutral';
  }[];
}

export const CONTEXT_SOURCES_DATA: ContextSourceData[] = [
  {
    id: 'url',
    title: 'Website URL & Live Health Probes',
    badge: 'LIVE TELEMETRY',
    icon: 'Globe',
    description: 'Executes non-invasive HTTP GET probes, DNS resolution queries, SSL handshake validations, and latency audits against live deployment endpoints.',
    capabilities: [
      'Automatic HTTP status code detection (200, 404, 500, 502, 504)',
      'TLS certificate expiry and cipher validation',
      'Response latency & TTFB distribution tracking',
      'Security header presence audit (HSTS, CSP, X-Frame-Options)'
    ],
    securityNote: 'Read-only probes with configurable timeouts (max 5000ms). Zero payload transmission.',
    codeSnippet: `// Live Probe Execution
curl -I --connect-timeout 3 https://staging.app.io/api/health

HTTP/2 502 Bad Gateway
server: nginx/1.25.3
date: Wed, 19 Aug 2026 12:00:00 GMT
x-deployfix-latency: 412ms
x-upstream-status: 111 Connection Refused`,
    previewMetrics: [
      { label: 'HTTP Status', value: '502 Bad Gateway', status: 'warn' },
      { label: 'Latency', value: '412ms', status: 'neutral' },
      { label: 'TLS Cert', value: 'Valid (248 days)', status: 'good' }
    ]
  },
  {
    id: 'files',
    title: 'Multi-File Config & Log Ingestion',
    badge: 'ZERO-SECRET AUDIT',
    icon: 'FileCode',
    description: 'Upload Dockerfiles, docker-compose.yml, Nginx configurations, and application server logs. Automated regex engine detects and strips secrets before ingestion.',
    capabilities: [
      'Multi-stage Dockerfile layer optimization check',
      'Docker Compose service dependency and network audit',
      'Instant regex stripping of JWT keys, DB passwords, and AWS tokens',
      'Drag-and-drop batch upload with size and MIME validation'
    ],
    securityNote: 'Client-side secret redaction ensures plain-text credentials never leave the browser.',
    codeSnippet: `# Docker Compose Ingestion (Sanitized)
version: "3.8"
services:
  backend:
    build: ./backend
    environment:
      DATABASE_URL: "postgresql://postgres:[REDACTED]@postgres:5432/app"
      JWT_SECRET: "[REDACTED_32_BYTES]"
    ports:
      - "5000:5000"`,
    previewMetrics: [
      { label: 'Secrets Filtered', value: '2 Redacted', status: 'good' },
      { label: 'Compose Valid', value: '3 Services', status: 'good' },
      { label: 'Log Lines', value: '1,420 Lines', status: 'neutral' }
    ]
  },
  {
    id: 'github',
    title: 'GitHub Repository Context',
    badge: 'VCS CORRELATION',
    icon: 'GitBranch',
    description: 'Correlate recent git commits, pull request file diffs, and GitHub Actions CI/CD workflows against the exact moment an incident occurred.',
    capabilities: [
      'Branch and commit SHA pinning for exact reproducibility',
      'CI/CD workflow YAML step failure inspection',
      'Changed file tree inspection to identify recent code regressions',
      'Direct linking to offending PR lines'
    ],
    securityNote: 'Uses scoped GitHub Personal Access Tokens or public repo URL read permissions.',
    codeSnippet: `// Commit Diff Ingested (SHA: a7782aa)
diff --git a/backend/src/config/database.ts b/backend/src/config/database.ts
- host: process.env.DB_HOST || "postgres"
+ host: "127.0.0.1" // ERROR: breaks inside container!`,
    previewMetrics: [
      { label: 'Recent Commits', value: '5 Inspected', status: 'neutral' },
      { label: 'Offending Diff', value: 'Line 14 Found', status: 'warn' },
      { label: 'CI Status', value: 'Failed on Step 3', status: 'warn' }
    ]
  },
  {
    id: 'deployment',
    title: 'Deployment Platform Telemetry',
    badge: 'PLATFORM LOGS',
    icon: 'Cloud',
    description: 'Ingest build artifacts, runtime container events, exit codes, and platform logs from Vercel, AWS ECS, Docker Swarm, and Kubernetes.',
    capabilities: [
      'Container crash loop backoff and OOMKilled exit code analysis',
      'Port binding mismatch detection',
      'Build step log extraction and dependency failure identification',
      'Microservice restart counter telemetry'
    ],
    securityNote: 'Read-only log stream subscription with automatic buffer rotation.',
    codeSnippet: `// Runtime Container Event Log
2026-08-19T12:00:04.12Z container "backend-api" died
exitCode: 137 (OOMKilled)
reason: Container memory limit (512MB) exceeded
restartCount: 4`,
    previewMetrics: [
      { label: 'Exit Code', value: '137 (OOM)', status: 'warn' },
      { label: 'Restarts', value: '4 Cycles', status: 'warn' },
      { label: 'Platform', value: 'AWS ECS / Docker', status: 'good' }
    ]
  }
];
```

---

## 3. Visual Layout Specification

```tsx
<section id="sources" className="py-24 px-4 max-w-7xl mx-auto">
  <div className="text-center mb-16">
    <span className="text-cyan-400 font-mono text-xs uppercase tracking-widest">Multi-Source Ingestion Engine</span>
    <h2 className="text-3xl md:text-4xl font-bold text-slate-100 mt-2">Correlate All 4 Context Layers</h2>
    <p className="text-slate-400 max-w-2xl mx-auto mt-4 text-base">
      Single-log debugging is obsolete. DeployFix Lab synchronizes network health, code diffs, configuration files, and container logs into one holistic diagnosis.
    </p>
  </div>

  {/* 4 Source Switcher Tabs */}
  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
    {/* Tab Buttons with active cyan glowing border */}
  </div>

  {/* Active Tab Showcase Card */}
  <div className="rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-xl p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 shadow-2xl">
    {/* Left Column (5 cols): Description, Capabilities checklist, Security Badge */}
    {/* Right Column (7 cols): Terminal Code Block & Telemetry KPI Metrics */}
  </div>
</section>
```
