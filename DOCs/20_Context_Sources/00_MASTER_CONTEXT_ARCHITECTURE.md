# 00 — Master Context Architecture Specification

**Document ID:** DFL-CTX-00  
**Status:** Active  
**Version:** 1.0  
**Last Updated:** 2026-08-13  
**Owner:** Frontend & AI Architecture Team

---

## 1. Purpose

This document defines the **complete architectural specification** for how DeployFix ingests, correlates, and uses project context from all 4 authorized sources. It serves as the authoritative reference for frontend UI/UX design, backend API design, Evidence Engine implementation, and Diagnosis Engine design.

---

## 2. The Four Context Sources

DeployFix accepts project context through exactly **four authorized channels**:

```
         USER PROJECT
              │
 ┌────────────┼────────────┐
 │            │            │
 ▼            ▼            ▼
GitHub    Deployment   Website
Repo      Platform     URL
 │            │            │
 └────────────┼────────────┘
              │
              ▼
     Manual File Upload
              │
              ▼
    ┌──────────────────┐
    │  PROJECT CONTEXT  │
    └────────┬─────────┘
             ▼
      EVIDENCE ENGINE
             ▼
   EVIDENCE CORRELATION
             ▼
      DIAGNOSIS ENGINE
             │
      ┌──────┴──────┐
      ▼             ▼
  Root Cause    Confidence
      │             │
      └──────┬──────┘
             ▼
        Explanation
             ▼
     Guided Recovery
```

---

## 3. Source Definitions

### Source 1 — GitHub Repository
- **Type:** Code + Architecture Source
- **Visibility:** Private (user must authorize)
- **Answers:** "What did the user build?"
- **Key Artifacts:** `package.json`, `Dockerfile`, `docker-compose.yml`, `.env.example`, `nginx.conf`, `.github/workflows/`, Prisma schema, source tree, README

### Source 2 — Deployment Platform
- **Type:** Runtime + Operations Source
- **Visibility:** Private (user must authorize)
- **Answers:** "What happened after it was deployed?"
- **Key Artifacts:** Deployment status, build logs, runtime logs, environment metadata, deployment history, service health

### Source 3 — Website URL
- **Type:** Public External Observation
- **Visibility:** Public only — no private data ever assumed
- **Answers:** "What is publicly visible from outside the system?"
- **Key Artifacts:** HTTP status, HTTPS/TLS state, redirects, response headers, observable errors, page structure
- **Hard Limits:** Must NEVER assume it can see source code, database, environment variables, private APIs, server filesystem, Docker config, CI/CD config

### Source 4 — Manual File Upload
- **Type:** User-provided Evidence (MVP capability)
- **Visibility:** User-controlled
- **Answers:** "What configuration/logs did the user provide directly?"
- **Key Artifacts:** Dockerfile, docker-compose.yml, nginx.conf, package.json, package-lock.json, .env.example, GitHub Actions YAML, deployment config, log files

---

## 4. Unified Project Context Model

All 4 sources merge into a single **Project Context** object:

```typescript
interface ProjectContext {
  projectId: string;
  projectName: string;
  createdAt: string;

  sources: {
    github?: GitHubContext;
    deployment?: DeploymentContext;
    website?: WebsiteContext;
    uploads?: UploadedFilesContext;
  };

  contextCompleteness: ContextCompletenessScore;
  evidenceItems: EvidenceItem[];
  diagnosis?: DiagnosisReport;
}
```

### Context Completeness Score

The system must calculate a **completeness score** (0–100%) based on how many sources have been provided:

| Sources Provided | Min Score | Diagnosis Quality |
|-----------------|-----------|-------------------|
| 0 | 0% | Cannot diagnose |
| Website URL only | 20% | Surface-level only |
| File Upload only | 35% | Configuration-level |
| Website + Uploads | 55% | Moderate |
| GitHub | +25% | Deep code + config |
| Deployment Platform | +20% | Runtime + build state |

---

## 5. Evidence Correlation Rules

The Evidence Engine must apply **deterministic correlation logic** before invoking AI:

### Rule: Port Mismatch Detection
```
IF github.dockerfile.EXPOSE !== nginx.proxy_pass.port
THEN evidence: PortMismatchEvidence { severity: CRITICAL }
```

### Rule: Build Failure Propagation
```
IF deployment.buildLogs.contains("ERROR")
AND website.httpStatus === 502
THEN evidence: BuildFailurePropagationEvidence
```

### Rule: Missing Environment Variables
```
IF github.envExample.keys.any(k => !deployment.envVars.contains(k))
THEN evidence: MissingEnvVarEvidence
```

### Rule: TLS Misconfiguration
```
IF website.https === false
AND nginx.ssl_certificate present
THEN evidence: TLSMisconfigurationEvidence
```

---

## 6. Diagnosis Confidence Boundaries

| Context Completeness | Max Confidence | Diagnosis Type |
|---------------------|----------------|----------------|
| < 20% | Cannot produce | — |
| 20–40% | 50% | Speculative |
| 40–60% | 70% | Moderate |
| 60–80% | 85% | Strong |
| 80–100% | 95% | High-confidence |

> **Architectural Lock:** DeployFix must NEVER produce a diagnosis confidence higher than the context completeness allows. The AI must be constrained by evidence, not speculation.

---

## 7. Frontend Implications

The frontend must:
1. **Show which sources are connected** — always visible in Project Context Panel
2. **Show context completeness score** — gauge/progress indicator
3. **Show what each additional source would unlock** — motivate users to connect more sources
4. **Qualify all diagnoses** with the sources that produced them
5. **Prevent diagnosis initiation** if context completeness < 20%

---

## 8. Related Documents

| Document | Path |
|----------|------|
| GitHub Integration Spec | [`01_GITHUB_INTEGRATION.md`](./01_GITHUB_INTEGRATION.md) |
| Deployment Platform Spec | [`02_DEPLOYMENT_PLATFORM.md`](./02_DEPLOYMENT_PLATFORM.md) |
| Website URL Spec | [`03_WEBSITE_URL.md`](./03_WEBSITE_URL.md) |
| File Upload Spec | [`04_FILE_UPLOAD.md`](./04_FILE_UPLOAD.md) |
| Project Context Panel UI | [`05_PROJECT_CONTEXT_PANEL.md`](./05_PROJECT_CONTEXT_PANEL.md) |
| Evidence Engine Spec | [`06_EVIDENCE_ENGINE.md`](./06_EVIDENCE_ENGINE.md) |
| Diagnosis Engine Spec | [`07_DIAGNOSIS_ENGINE.md`](./07_DIAGNOSIS_ENGINE.md) |
| Context Completeness UI | [`08_CONTEXT_COMPLETENESS.md`](./08_CONTEXT_COMPLETENESS.md) |
| Integration Roadmap | [`09_INTEGRATION_ROADMAP.md`](./09_INTEGRATION_ROADMAP.md) |
