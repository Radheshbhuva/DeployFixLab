# 04 — Diagnosis Engine Specification

---

## Document Metadata

| Field               | Value                                                             |
|---------------------|-------------------------------------------------------------------|
| **Document Name**   | Diagnosis Engine Specification                                    |
| **Document ID**     | DFIX-AI-004                                                       |
| **Version**         | 1.0.0                                                             |
| **Status**          | Approved                                                          |
| **Owner**           | Technical Lead & Reliability Architect                            |
| **Reviewer**        | Full Engineering Team                                             |
| **Classification**  | Internal — Confidential                                           |
| **Created Date**    | 2026-08-09                                                        |
| **Last Updated**    | 2026-08-09                                                        |
| **Project**         | DeployFix Lab                                                     |
| **Project Code**    | DFIX                                                              |

---

# 1. Overview & Diagnostic Pipeline

The **Diagnosis Engine** (`ai/diagnosis/`) is the central intelligence core of DeployFix Lab. It evaluates normalized evidence against deterministic diagnostic rules and combines the outputs with AI provider reasoning to produce a high-confidence root cause diagnosis.

```
Evidence Payload
       │
       ▼
Deterministic Rules Evaluation (`ai/rules/`)
       │
       ▼
Evidence Correlator (`evidence-correlator.ts`)
       │
       ▼
AI Provider Reasoning (`ai/providers/`)
       │
       ▼
Root Cause Engine (`root-cause-engine.ts`)
       │
       ▼
Confidence Calculator (`confidence-engine.ts`)
       │
       ▼
Validated Diagnostic Output (`diagnosis-schema.ts`)
```

---

# 2. Key Modules & Sub-Components

1. **`diagnosis-engine.ts`**: Orchestrates the diagnostic execution pipeline from evidence ingestion to final JSON output generation.
2. **`evidence-correlator.ts`**: Cross-references symptoms (e.g. `502 Bad Gateway`) with underlying evidence (e.g. `Nginx upstream port 5000 refused`).
3. **`root-cause-engine.ts`**: Pinpoints the exact line number, configuration key, or container state responsible for system failure.
4. **`confidence-engine.ts`**: Calculates a calibrated confidence percentage (0% to 100%) based on rule matches, evidence completeness, and model certainty.
5. **`diagnosis-schema.ts`**: Enforces strict Zod schema validation on diagnostic outputs.
