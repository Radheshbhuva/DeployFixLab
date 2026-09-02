# 20 — DeployFix Context Sources

## Overview

This folder documents the **3 primary context source systems** that DeployFix uses to understand a user's application before diagnosis:
1. **Website URL Inspection**
2. **Manual File Uploads**
3. **GitHub Repository Integration**

All three sources feed a unified **Project Context** layer, which then drives the **Evidence Engine** and **Diagnosis Engine**.

---

## Architecture Summary

```
          USER PROJECT
               │
┌──────────────┼──────────────┐
│              │              │
▼              ▼              ▼
GitHub     Website URL    Manual Files
Repo       Endpoint       (Configs & Logs)
│              │              │
└──────────────┼──────────────┘
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
| 01 | [`00_MASTER_CONTEXT_ARCHITECTURE.md`](./00_MASTER_CONTEXT_ARCHITECTURE.md) | Master spec for 3 context sources |
| 02 | [`01_GITHUB_INTEGRATION.md`](./01_GITHUB_INTEGRATION.md) | GitHub Repo source — UI/UX + data spec |
| 03 | [`03_WEBSITE_URL.md`](./03_WEBSITE_URL.md) | Website URL source — UI/UX + public inspection spec |
| 04 | [`04_FILE_UPLOAD.md`](./04_FILE_UPLOAD.md) | Manual file upload source — UI/UX + file analysis spec |
| 05 | [`05_PROJECT_CONTEXT_PANEL.md`](./05_PROJECT_CONTEXT_PANEL.md) | Unified Project Context UI panel spec |
| 06 | [`06_EVIDENCE_ENGINE.md`](./06_EVIDENCE_ENGINE.md) | Evidence Engine — correlation + extraction spec |
| 07 | [`07_DIAGNOSIS_ENGINE.md`](./07_DIAGNOSIS_ENGINE.md) | Diagnosis Engine — root cause + confidence spec |
| 08 | [`08_CONTEXT_COMPLETENESS.md`](./08_CONTEXT_COMPLETENESS.md) | Context completeness scoring & UI indicators |
| 09 | [`09_INTEGRATION_ROADMAP.md`](./09_INTEGRATION_ROADMAP.md) | V1 → V3 staged integration roadmap |

---

## Versioning Roadmap

| Version | Context Sources Available |
|---------|--------------------------|
| **V1** | Website URL + Manual File Upload |
| **V2** | + GitHub Repository Integration |
| **V3** | + Continuous Verification & Chaos Sandboxes |

---

## Key Rule (Architecture Lock)

> **DeployFix must never diagnose beyond the evidence available to it.**

The AI's confidence score and diagnosis depth must scale directly with the completeness of the context provided. A Website URL–only diagnosis must clearly state it is based on publicly observable information only.

---

*Maintained by: Antigravity Agent — DeployFix Lab Frontend Team*
