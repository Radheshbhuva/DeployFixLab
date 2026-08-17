# 05 — AI System Rules

---

## Document Metadata

| Field               | Value                                                             |
|---------------------|-------------------------------------------------------------------|
| **Document Name**   | AI System Rules                                                   |
| **Document ID**     | DFIX-AI-014                                                       |
| **Version**         | 1.0.0                                                             |
| **Status**          | Approved                                                          |
| **Owner**           | AI Engineering Lead                                               |
| **Reviewer**        | Technical Lead                                                    |
| **Classification**  | Internal — Confidential                                           |
| **Created Date**    | 2026-08-09                                                        |
| **Last Updated**    | 2026-08-09                                                        |
| **Project**         | DeployFix Lab                                                     |
| **Project Code**    | DFIX                                                              |

---

# 1. Mandatory Operating Rules

1. **Evidence-Based Diagnosis:** Diagnoses MUST be backed by verified evidence. Never guess or hallucinate missing configuration settings.
2. **Least Privilege Security:** V1 operates as a read-only advisor. The AI system SHALL NOT execute arbitrary shell commands, modify cloud production resources, or perform autonomous remediation without user consent.
3. **Structured Output:** All internal diagnostic responses MUST parse against `AI_Diagnosis_Output_Schema.md`.
