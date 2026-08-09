# 07 — AI Security & Data Privacy Guide

---

## Document Metadata

| Field               | Value                                                             |
|---------------------|-------------------------------------------------------------------|
| **Document Name**   | AI Security & Data Privacy Guide                                  |
| **Document ID**     | DFIX-AI-007                                                       |
| **Version**         | 1.0.0                                                             |
| **Status**          | Approved                                                          |
| **Owner**           | Technical Lead & Security Architect                               |
| **Reviewer**        | Full Engineering Team                                             |
| **Classification**  | Internal — Confidential                                           |
| **Created Date**    | 2026-08-09                                                        |
| **Last Updated**    | 2026-08-09                                                        |
| **Project**         | DeployFix Lab                                                     |
| **Project Code**    | DFIX                                                              |

---

# 1. Overview & Core Security Principles

DeployFix Lab handles project configurations, container environment variables, and system logs. To protect sensitive credentials, the AI engine enforces 4 strict security controls:

### 1. Pre-Flight Secret Sanitization & Redaction
Before any evidence payload or project context is transmitted to an external LLM provider, all environment variables and log lines pass through `secret-redactor.ts`:
* Passwords, database connection strings, JWT secrets, and API keys are scrubbed using regex pattern replacement (`[REDACTED_SECRET]`).

### 2. Zero Shell Execution Privileges
The AI system operates purely as a read-and-diagnose advisor. It does NOT have permissions to spawn shell processes (`child_process.exec`), run arbitrary Docker commands, or modify host filesystems without explicit user approval.

### 3. Read-Only Context Parsing
Repository AST parsers and log analyzers access filesystems in read-only mode (`fs.constants.R_OK`).

### 4. API Key Protection
External LLM provider keys (`OPENAI_API_KEY`) are managed strictly on the backend application server via environment variables and NEVER exposed to frontend clients or committed to source repositories.
