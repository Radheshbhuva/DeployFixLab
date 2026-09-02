# 00 — DeployFix Master Context Architecture

## 1. Overview & Vision

DeployFix is an **evidence-based diagnostic platform**. Its core premise is that accurate diagnoses cannot be made from a single log file or error message in isolation.

To diagnose production deployment failures accurately, DeployFix correlates evidence across **3 distinct context layers**:

```
┌─────────────────────────────────────────────────────────┐
│                   DEPLOYFIX AI ENGINE                   │
│                                                         │
│   ┌───────────────┐ ┌───────────────┐ ┌─────────────┐   │
│   │   Layer 1:    │ │   Layer 2:    │ │  Layer 3:   │   │
│   │  Website URL  │ │ Manual Files  │ │ GitHub Repo │   │
│   │  (External)   │ │  (Configs)    │ │   (Code)    │   │
│   └───────┬───────┘ └───────┬───────┘ └──────┬──────┘   │
│           │                 │                │          │
│           └─────────────────┼────────────────┘          │
│                             ▼                           │
│                 ┌───────────────────────┐               │
│                 │    EVIDENCE ENGINE    │               │
│                 │  (Correlation Layer)  │               │
│                 └───────────┬───────────┘               │
│                             ▼                           │
│                 ┌───────────────────────┐               │
│                 │   DIAGNOSIS ENGINE    │               │
│                 │ (Root Cause Analysis) │               │
│                 └───────────────────────┘               │
└─────────────────────────────────────────────────────────┘
```

---

## 2. The 3 Context Sources

### Source 1 — GitHub Repository
- **Type:** Code + Architecture Source
- **Visibility:** Private (user must authorize)
- **Answers:** "What did the user build?"
- **Key Artifacts:** `package.json`, `Dockerfile`, `docker-compose.yml`, `.env.example`, `nginx.conf`, `.github/workflows/`, Prisma schema, source tree, README

### Source 2 — Website URL
- **Type:** Public External Observation
- **Visibility:** Public only — no private data ever assumed
- **Answers:** "What is publicly visible from outside the system?"
- **Key Artifacts:** HTTP status, HTTPS/TLS state, redirects, response headers, observable errors, page structure
- **Hard Limits:** Must NEVER assume it can see source code, database, environment variables, private APIs, server filesystem, Docker config, CI/CD config

### Source 3 — Manual File Upload
- **Type:** User-provided Evidence (MVP capability)
- **Visibility:** User-controlled
- **Answers:** "What configuration/logs did the user provide directly?"
- **Key Artifacts:** Dockerfile, docker-compose.yml, nginx.conf, package.json, package-lock.json, .env.example, GitHub Actions YAML, deployment config, log files

---

## 3. Unified Project Context Model

All 3 sources merge into a single **Project Context** object:

```typescript
interface ProjectContext {
  projectId: string;
  projectName: string;
  createdAt: string;

  sources: {
    github?: GitHubContext;
    website?: WebsiteContext;
    uploads?: UploadedFilesContext;
  };

  contextCompleteness: ContextCompletenessScore;
  evidenceItems: EvidenceItem[];
  diagnosis?: DiagnosisReport;
}
```

### Context Completeness Score

The system calculates a **completeness score** (0–100%) based on the sources provided:

| Sources Provided | Min Score | Diagnosis Quality |
|-----------------|-----------|-------------------|
| 0 | 0% | Cannot diagnose |
| Website URL only | 30% | Surface-level only |
| File Upload only | 35% | Configuration-level |
| Website + Uploads | 65% | Moderate |
| GitHub | +35% | Deep code + config |

---

## 4. Evidence Correlation Rules

The Evidence Engine applies **deterministic correlation logic** before invoking AI:

### Rule: Port Mismatch Detection
```
IF dockerfile.EXPOSE !== nginx.proxy_pass.port
THEN evidence: PortMismatchEvidence { severity: CRITICAL }
```

### Rule: Missing Environment Variables
```
IF envExample.keys.any(k => !container.envVars.contains(k))
THEN evidence: MissingEnvVarEvidence
```

### Rule: TLS Misconfiguration
```
IF website.https === false
AND nginx.ssl_certificate present
THEN evidence: TLSMisconfigurationEvidence
```

---

## 5. Diagnosis Confidence Boundaries

| Context Completeness | Max Confidence | Diagnosis Type |
|---------------------|----------------|----------------|
| < 20% | Cannot produce | — |
| 20–40% | 60% | Speculative |
| 40–70% | 80% | Moderate |
| 70–100% | 96% | High-confidence |

> **Architectural Lock:** DeployFix must NEVER produce a diagnosis confidence higher than the context completeness allows. The AI must be constrained by evidence, not speculation.

---

## 6. Frontend Implications

The frontend must:
1. **Show which sources are connected** — always visible in Project Context Panel
2. **Show context completeness score** — gauge/progress indicator
3. **Show what each additional source would unlock** — motivate users to connect more sources
4. **Qualify all diagnoses** with the sources that produced them
5. **Prevent diagnosis initiation** if context completeness is 0%

---

## 7. Related Documents

| Document | Path |
|----------|------|
| GitHub Integration Spec | [`01_GITHUB_INTEGRATION.md`](./01_GITHUB_INTEGRATION.md) |
| Website URL Spec | [`03_WEBSITE_URL.md`](./03_WEBSITE_URL.md) |
| File Upload Spec | [`04_FILE_UPLOAD.md`](./04_FILE_UPLOAD.md) |
| Project Context Panel UI | [`05_PROJECT_CONTEXT_PANEL.md`](./05_PROJECT_CONTEXT_PANEL.md) |
| Evidence Engine Spec | [`06_EVIDENCE_ENGINE.md`](./06_EVIDENCE_ENGINE.md) |
| Diagnosis Engine Spec | [`07_DIAGNOSIS_ENGINE.md`](./07_DIAGNOSIS_ENGINE.md) |
| Context Completeness UI | [`08_CONTEXT_COMPLETENESS.md`](./08_CONTEXT_COMPLETENESS.md) |
| Integration Roadmap | [`09_INTEGRATION_ROADMAP.md`](./09_INTEGRATION_ROADMAP.md) |
