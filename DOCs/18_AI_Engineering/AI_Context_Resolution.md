# 02 — AI Context Resolution

---

## Document Metadata

| Field               | Value                                                             |
|---------------------|-------------------------------------------------------------------|
| **Document Name**   | AI Context Resolution                                             |
| **Document ID**     | DFIX-AI-011                                                       |
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

This document defines how AI gathers and resolves project context before generating any implementation or documentation.

---

# 2. Context Resolution Priority

1. Approved Architecture Decision Records (ADRs)
2. System & Layered Architecture Specifications
3. Software Requirements Specification (SRS)
4. Product Requirements Document (PRD)
5. Domain Specifications (`DOCs/08_Database/`, `DOCs/09_API/`, etc.)
6. Engineering Standards & Guidelines
7. Development & Work History

---

# 3. Context Ingestion & Conflict Resolution Rules

* **Mandatory Sources:** Before starting a diagnostic task, the AI engine requires at least ONE primary source: GitHub Repository, Production Website URL, or Deployment/Configuration Files.
* **Distinction of Evidence:** The AI MUST clearly distinguish between *Available Evidence*, *Missing Evidence*, *Inferred Information*, *Confirmed Information*, and *Unknown Information*. Never present inferences as confirmed facts.
