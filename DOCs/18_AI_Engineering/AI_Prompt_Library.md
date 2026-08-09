# 04 — AI Prompt Library

---

## Document Metadata

| Field               | Value                                                             |
|---------------------|-------------------------------------------------------------------|
| **Document Name**   | AI Prompt Library                                                 |
| **Document ID**     | DFIX-AI-013                                                       |
| **Version**         | 1.0.0                                                             |
| **Status**          | Approved                                                          |
| **Owner**           | AI Engineering Lead                                               |
| **Reviewer**        | Full Engineering Team                                             |
| **Classification**  | Internal — Confidential                                           |
| **Created Date**    | 2026-08-09                                                        |
| **Last Updated**    | 2026-08-09                                                        |
| **Project**         | DeployFix Lab                                                     |
| **Project Code**    | DFIX                                                              |

---

# 1. Purpose

The AI Prompt Library provides standardized prompt templates for diagnostic inference, root-cause generation, and guided recovery planning.

---

# 2. Key Prompt Templates

* **System Prompt:** Instructs the LLM to act as the DeployFix AI Diagnosis Engine adhering to the **Read $\rightarrow$ Analyze $\rightarrow$ Explain $\rightarrow$ Guide** philosophy.
* **Root Cause Prompt:** Evaluates correlated evidence (log errors, health probes, config keys) to identify the specific root cause.
* **Guided Recovery Prompt:** Generates step-by-step human remediation instructions.
