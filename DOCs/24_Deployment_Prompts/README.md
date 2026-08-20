# DeployFix Lab — 24_Deployment_Prompts Specification Suite

**Document ID:** DEP-PROMPT-INDEX  
**Category:** Deployment Engineering & AI Prompts  
**Status:** Active  
**Maintained By:** Lead SRE & DevOps Team  

---

## 📚 Document Index

| Document File | Purpose & Scope |
|---|---|
| **[`00_MASTER_DEPLOYMENT_BRIEF.md`](./00_MASTER_DEPLOYMENT_BRIEF.md)** | Multi-tier cloud deployment architecture (Vercel + Render + Supabase + GitHub Actions). |
| **[`01_IMPLEMENTATION_PLAN.md`](./01_IMPLEMENTATION_PLAN.md)** | Step-by-step phased roadmap for provisioning, configuring, and verifying production releases. |
| **[`02_ENVIRONMENT_AND_SECRETS_SPEC.md`](./02_ENVIRONMENT_AND_SECRETS_SPEC.md)** | Frontend, Backend, and GitHub Secrets matrix with security constraints and defaults. |
| **[`03_DATABASE_AND_MIGRATIONS_SPEC.md`](./03_DATABASE_AND_MIGRATIONS_SPEC.md)** | Supabase PostgreSQL setup with PgBouncer connection pooling and Prisma migration workflows. |
| **[`04_BACKEND_DEPLOYMENT_SPEC.md`](./04_BACKEND_DEPLOYMENT_SPEC.md)** | Render `render.yaml` blueprint, multi-stage `Dockerfile`, `/health` probes, and graceful shutdown. |
| **[`05_FRONTEND_DEPLOYMENT_SPEC.md`](./05_FRONTEND_DEPLOYMENT_SPEC.md)** | Vercel Edge SPA hosting configuration (`vercel.json`), routing rewrites, and caching headers. |
| **[`06_CICD_GITHUB_ACTIONS_SPEC.md`](./06_CICD_GITHUB_ACTIONS_SPEC.md)** | GitHub Actions CI/CD workflows for automated testing, type checking, and production deploy. |
| **[`07_PRODUCTION_VERIFICATION_AND_ROLLBACK_SPEC.md`](./07_PRODUCTION_VERIFICATION_AND_ROLLBACK_SPEC.md)** | 5-point post-deploy smoke test protocol, automated rollback thresholds, and recovery steps. |
| **[`08_AI_PROMPT_SUITE_MASTER_PROMPT.md`](./08_AI_PROMPT_SUITE_MASTER_PROMPT.md)** | Master prompt for guiding AI agents and developer copilots through production deployments. |

---

## 🚀 Quick Execution Guide

1. **Frontend Deployment Config:** Add `frontend/vercel.json` with SPA routing rewrites.
2. **Backend Deployment Config:** Add `backend/render.yaml` with service blueprint and `/health` probe.
3. **Database Migration:** Run `npx prisma migrate deploy` in `backend/`.
4. **CI/CD Automation:** Configure `.github/workflows/ci.yml` and `.github/workflows/deploy.yml`.
5. **Work History Recording:** After every deployment update, record in `DOCs/Development_History/Deployment Work History.md`.
