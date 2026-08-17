# 04 — File & Directory Structure Standard

---

## Document Metadata

| Field               | Value                                                             |
|---------------------|-------------------------------------------------------------------|
| **Document Name**   | File & Directory Structure Standard                               |
| **Document ID**     | DFIX-ENG-004                                                      |
| **Version**         | 1.0.0                                                             |
| **Status**          | Approved                                                          |
| **Owner**           | Principal Systems Architect                                       |
| **Reviewer**        | Technical Lead, Full Engineering Team                             |
| **Classification**  | Internal — Confidential                                           |
| **Created Date**    | 2026-08-02                                                        |
| **Last Updated**    | 2026-08-06                                                        |
| **Project**         | DeployFix Lab                                                     |
| **Project Code**    | DFIX                                                              |

---

# 1. Purpose & Core Organization

This document establishes the official **File & Directory Structure Standard** for the entire **DeployFix Lab** repository. Adhering to a uniform layout prevents directory pollution, simplifies developer onboarding, streamlines CI/CD build scripts, and enforces architectural boundaries.

---

# 2. Master Repository Directory Layout

```
DeployFix_Lab/
├── .github/                    # GitHub Actions workflows & PR templates
│   ├── workflows/              # CI/CD deployment pipelines
│   └── PULL_REQUEST_TEMPLATE.md
├── DOCs/                       # Centralized Engineering Documentation Tree
│   ├── 01_Project_Management/  # Project charter, vision, roadmap
│   ├── 02_Requirements/        # PRD, SRS, FRS, acceptance criteria, RTM
│   ├── 03_Architecture/        # System, frontend, backend, docker, ADRs
│   ├── 04_Engineering_Standards/# Coding, naming, branching, review standards
│   ├── 05_AI_Development_System/# AI prompts, rules, workflows
│   └── Development_History/    # Work journals & history logs
├── backend/                    # Node.js Express REST API micro-service
│   ├── src/
│   │   ├── config/             # DB & env setup
│   │   ├── controllers/        # Request handlers
│   │   ├── middleware/         # Express middlewares
│   │   ├── modules/            # Feature domains (auth, labs, chaos)
│   │   ├── services/           # Core business logic
│   │   └── server.ts           # Entry point
│   ├── prisma/                 # Database migrations & schema
│   ├── Dockerfile              # Multi-stage Docker build
│   └── package.json
├── frontend/                   # React 18 + Vite SPA Client Application
│   ├── src/
│   │   ├── components/         # Shared UI primitives
│   │   ├── features/           # Modular domain components
│   │   ├── hooks/              # Custom React hooks
│   │   ├── services/           # Axios API services
│   │   └── store/              # Zustand global state slices
│   ├── Dockerfile              # Multi-stage Docker build
│   └── package.json
├── nginx/                      # Nginx reverse proxy configuration & Dockerfile
│   ├── conf.d/                 # Default proxy routing configs
│   └── Dockerfile
├── docker-compose.yml          # Container orchestration specification
├── .gitignore                  # Source control ignore rules
├── LICENSE                     # Open source license
└── README.md                   # Primary repository entry documentation
```

---

# 3. Rules & Placement Guidelines

1. **Documentation Placement:** ALL documentation files MUST reside inside the `DOCs/` hierarchy. No orphan markdown files in the root folder except `README.md`.
2. **Environment Configuration:** Sensitive secrets belong ONLY in local `.env` files (listed in `.gitignore`). Environment template files (`.env.example`) must be checked into git.
3. **Module Independence:** Frontend, Backend, and Nginx directories MUST remain self-contained with their own `Dockerfile` and dependency manifests (`package.json`).
