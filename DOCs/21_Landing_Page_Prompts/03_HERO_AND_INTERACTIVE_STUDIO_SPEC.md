# 03 — DeployFix Lab: Hero & Interactive Studio Specification

---

## Document Metadata

| Field | Value |
|---|---|
| **Document Name** | Hero & Interactive Studio Specification |
| **Document ID** | DFIX-SPEC-021-03 |
| **Version** | 1.0.0 |
| **Status** | Approved |
| **Components** | `HeroSection.tsx`, `InteractiveStudioPreview.tsx` |

---

## 1. Hero Content & Copywriting Strategy

### Top Announcement Badge
```tsx
<div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono mb-6">
  <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
  <span>DeployFix V2 Live Engine — 4-Source Context & Zero-Secret Safety</span>
  <ArrowRight className="w-3.5 h-3.5" />
</div>
```

### Main Headline & Subheadline
- **H1 Headline:**  
  ```
  Stop Guessing in Production.
  Diagnose Broken Deployments with Multi-Source Evidence.
  ```
  *(Gradient highlighted text on "Multi-Source Evidence" with `bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent`)*
- **Subheadline:**  
  ```
  Ingest container logs, Dockerfiles, GitHub diffs, and URL health probes into an AI reasoning engine. Get deterministic root-cause diagnosis, capped confidence scores, and verified remediation playbooks in seconds.
  ```

### Dual Call-to-Actions (CTAs)
1. **Primary Button (`ButtonPrimary`)**:
   - Label: `"Start Free Lab"` or `"Launch Incident Sandbox"`
   - Icon: `<Zap className="w-4 h-4 mr-2" />`
   - Destination: `/register` or `/dashboard`
   - Style: `bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-semibold px-6 py-3.5 rounded-xl shadow-lg shadow-cyan-500/20 transition-all hover:scale-[1.02]`
2. **Secondary Button (`ButtonGhost`)**:
   - Label: `"View Live Demo"`
   - Icon: `<PlayCircle className="w-4 h-4 mr-2 text-cyan-400" />`
   - Action: Smooth scroll to `#interactive-demo` or toggle interactive studio sample
   - Style: `border border-slate-700 hover:border-slate-600 bg-slate-900/60 hover:bg-slate-800 text-slate-200 font-medium px-6 py-3.5 rounded-xl backdrop-blur-sm transition-all`

---

## 2. Interactive Studio Preview Component (`InteractiveStudioPreview.tsx`)

The hero section features a **live, fully interactive simulation of the DeployFix Diagnosis Engine**. Visitors can switch between 3 sample production incidents to see immediate evidence correlation in action:

```
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│ 🔴 INCIDENT SIMULATOR: [1. Postgres ECONNREFUSED]  [2. Nginx 502 Bad Gateway]  [3. Port Collision] │
├──────────────────────────────────────────────────────┬──────────────────────────────────────┤
│ 📋 INGESTED MULTI-SOURCE EVIDENCE                    │ ⚡ DETERMINISTIC AI DIAGNOSIS        │
│                                                      │                                      │
│ • [Log Stream] FATAL: connection refused 5432        │ 🎯 Root Cause: Host network mismatch │
│ • [Dockerfile] EXPOSE 5432 (declared)                │ 📊 Capped Confidence: 94% [HIGH]     │
│ • [Compose] backend depends_on: db (healthy)         │ 🛡️ Secrets Filtered: 2 items (safe)   │
│ • [URL Probe] HTTP 500 Internal Error (412ms)        ├──────────────────────────────────────┤
│                                                      │ 🔧 GUIDED REMEDIATION PLAN           │
│                                                      │ Step 1: Change DB_HOST=localhost to  │
│                                                      │         DB_HOST=postgres in .env     │
│                                                      │ ```bash                              │
│                                                      │ sed -i 's/localhost/postgres/' .env  │
│                                                      │ docker-compose restart backend       │
│                                                      │ ```                                  │
└──────────────────────────────────────────────────────┴──────────────────────────────────────┘
```

### Scenario Presets for the Interactive Simulator

```typescript
export interface SampleIncident {
  id: string;
  title: string;
  badge: string;
  severity: 'critical' | 'major' | 'warning';
  evidence: Array<{
    source: string;
    text: string;
    icon: string;
  }>;
  rootCause: string;
  confidenceScore: number;
  confidenceTier: 'HIGH' | 'MODERATE' | 'LOW';
  remediationTitle: string;
  remediationCommand: string;
  codeDiff: string;
}

export const SAMPLE_INCIDENTS: SampleIncident[] = [
  {
    id: 'postgres-conn',
    title: 'Postgres Connection Refused',
    badge: 'DATABASE',
    severity: 'critical',
    evidence: [
      { source: 'CONTAINER LOG', text: 'FATAL: connect ECONNREFUSED 127.0.0.1:5432', icon: 'Terminal' },
      { source: 'DOCKER COMPOSE', text: 'Service "backend" attempts connection to localhost instead of service name "postgres"', icon: 'Box' },
      { source: 'URL PROBE', text: 'GET https://api.prod/health -> HTTP 500 (340ms)', icon: 'Globe' },
      { source: 'ENV AUDIT', text: 'DATABASE_URL="postgresql://user:***@127.0.0.1:5432/app" [Secrets Redacted]', icon: 'ShieldCheck' }
    ],
    rootCause: 'Backend is configured to connect to 127.0.0.1 (container localhost) instead of Docker bridge hostname "postgres".',
    confidenceScore: 94,
    confidenceTier: 'HIGH',
    remediationTitle: 'Update Database Hostname in Container Environment',
    remediationCommand: 'export DATABASE_URL="postgresql://user:password@postgres:5432/app" && docker-compose restart backend',
    codeDiff: '- DATABASE_URL=postgresql://user:pass@127.0.0.1:5432/app\n+ DATABASE_URL=postgresql://user:pass@postgres:5432/app'
  },
  {
    id: 'nginx-upstream',
    title: 'Nginx 502 Bad Gateway',
    badge: 'PROXY / NETWORKING',
    severity: 'critical',
    evidence: [
      { source: 'NGINX ACCESS', text: '10.0.0.1 - "GET /api/v1/tasks" 502 157 "-"', icon: 'Globe' },
      { source: 'NGINX ERROR', text: 'connect() failed (111: Connection refused) while connecting to upstream backend:3000', icon: 'Terminal' },
      { source: 'DOCKER HEALTH', text: 'Container "backend-api" is in "CrashLoopBackoff" state (OOMKilled exit code 137)', icon: 'AlertTriangle' }
    ],
    rootCause: 'Upstream Node.js process crashed due to V8 heap out-of-memory error during large JSON serialization.',
    confidenceScore: 91,
    confidenceTier: 'HIGH',
    remediationTitle: 'Increase Container Memory Limit & Node Max Old Space',
    remediationCommand: 'docker update --memory=2g backend-api && docker restart backend-api',
    codeDiff: '- deploy.resources.limits.memory: 512M\n+ deploy.resources.limits.memory: 2048M\n+ environment: NODE_OPTIONS="--max-old-space-size=1536"'
  },
  {
    id: 'port-collision',
    title: 'Port 3000 Collision',
    badge: 'DOCKER CONFIG',
    severity: 'major',
    evidence: [
      { source: 'DOCKER DAEMON', text: 'Error response: driver failed programming external connectivity on endpoint: Bind for 0.0.0.0:3000 failed: port is already allocated', icon: 'Box' },
      { source: 'COMPOSE AUDIT', text: 'Both frontend dev server and API gateway declare host port mapping 3000:3000', icon: 'GitBranch' }
    ],
    rootCause: 'Host port 3000 is concurrently claimed by the frontend preview container and backend API gateway.',
    confidenceScore: 98,
    confidenceTier: 'HIGH',
    remediationTitle: 'Remap API Gateway Host Port to 5000',
    remediationCommand: 'docker-compose up -d --force-recreate',
    codeDiff: '- ports: ["3000:3000"]\n+ ports: ["5000:3000"]'
  }
];
```

---

## 3. Component Hierarchy

```
<HeroSection>
  ├── <BadgeAnnouncement />
  ├── <H1HeadlineWithGradient />
  ├── <Subheadline />
  ├── <HeroCtaButtonGroup />
  └── <InteractiveStudioPreview>
        ├── <ScenarioTabBar />           {/* Toggle between 3 sample incidents */}
        ├── <EvidenceColumn>             {/* Left panel: Multi-source log cards */}
        │     └── <EvidenceItemCard />
        └── <DiagnosisResultColumn>      {/* Right panel: Confidence gauge + diff */}
              ├── <ConfidenceScoreBar />
              ├── <RootCauseCard />
              ├── <DiffPreviewBlock />
              └── <CopyCommandButton />
```
