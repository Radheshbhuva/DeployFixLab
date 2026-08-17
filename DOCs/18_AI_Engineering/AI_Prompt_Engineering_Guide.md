# 03 — AI Prompt Engineering Guide

---

## Document Metadata

| Field               | Value                                                             |
|---------------------|-------------------------------------------------------------------|
| **Document Name**   | AI Prompt Engineering Guide                                       |
| **Document ID**     | DFIX-AI-012                                                       |
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

Provide a standardized approach for writing prompts used during AI-assisted development and LLM inference calls within DeployFix Lab.

---

# 2. Standard Prompt Structure

Every prompt MUST specify:
1. **Objective:** Specific goal or scenario to evaluate.
2. **Project Context:** Application framework, container stack, environment variables.
3. **Evidence Package:** Normalized log entries, HTTP health probe responses, and config snippets.
4. **Constraints:** Non-negotiable security boundaries (no auto production edits, read-only mode).
5. **Expected Output:** Machine-readable JSON adhering to `AI_Diagnosis_Output_Schema.md`.
