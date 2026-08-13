# 20 — DeployFix Context Sources

## Overview

This folder documents the **4 primary context source systems** that DeployFix uses to understand a user's application before diagnosis.

All four sources feed a unified **Project Context** layer, which then drives the **Evidence Engine** and **Diagnosis Engine**.

---

## Architecture Summary

```
          USER PROJECT
               │
┌──────────────┼──────────────┐
│              │              │
▼              ▼              ▼
GitHub     Deployment    Website URL
Repo       Platform
│              │              │
└──────────────┼──────────────┘
               │
               ▼
       Manual File Upload
               │
               ▼
      ┌─────────────────┐
      │  PROJECT CONTEXT │
      └────────┬────────┘
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

## Files in This Folder

| # | File | Purpose |
|---|------|---------|
| 00 | [`README.md`](./README.md) | This index — overview & architecture |
| 01 | [`00_MASTER_CONTEXT_ARCHITECTURE.md`](./00_MASTER_CONTEXT_ARCHITECTURE.md) | Master spec for all 4 context sources |
| 02 | [`01_GITHUB_INTEGRATION.md`](./01_GITHUB_INTEGRATION.md) | GitHub Repo source — UI/UX + data spec |
| 03 | [`02_DEPLOYMENT_PLATFORM.md`](./02_DEPLOYMENT_PLATFORM.md) | Deployment platform source — UI/UX + data spec |
| 04 | [`03_WEBSITE_URL.md`](./03_WEBSITE_URL.md) | Website URL source — UI/UX + public inspection spec |
| 05 | [`04_FILE_UPLOAD.md`](./04_FILE_UPLOAD.md) | Manual file upload source — UI/UX + file analysis spec |
| 06 | [`05_PROJECT_CONTEXT_PANEL.md`](./05_PROJECT_CONTEXT_PANEL.md) | Unified Project Context UI panel spec |
| 07 | [`06_EVIDENCE_ENGINE.md`](./06_EVIDENCE_ENGINE.md) | Evidence Engine — correlation + extraction spec |
| 08 | [`07_DIAGNOSIS_ENGINE.md`](./07_DIAGNOSIS_ENGINE.md) | Diagnosis Engine — root cause + confidence spec |
| 09 | [`08_CONTEXT_COMPLETENESS.md`](./08_CONTEXT_COMPLETENESS.md) | Context completeness scoring & UI indicators |
| 10 | [`09_INTEGRATION_ROADMAP.md`](./09_INTEGRATION_ROADMAP.md) | V1 → V5 staged integration roadmap |

---

## Versioning Roadmap

| Version | Context Sources Available |
|---------|--------------------------|
| **V1** | Website URL + Manual File Upload |
| **V2** | + GitHub Repository Integration |
| **V3** | + Deployment Platform Integration |
| **V4** | + Monitoring Integration |
| **V5** | + DeployFix Agent (Automated) |

---

## Key Rule (Architecture Lock)

> **DeployFix must never diagnose beyond the evidence available to it.**

The AI's confidence score and diagnosis depth must scale directly with the completeness of the context provided. A Website URL–only diagnosis must clearly state it is based on publicly observable information only.

---

*Maintained by: Antigravity Agent — DeployFix Lab Frontend Team*
*Last Updated: 2026-08-13*
