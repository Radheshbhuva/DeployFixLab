# 08 — Architecture Decision Record (ADR) Log

---

## Document Metadata

| Field               | Value                                                             |
|---------------------|-------------------------------------------------------------------|
| **Document Name**   | Architecture Decision Record (ADR) Log                            |
| **Document ID**     | DFIX-ARCH-008                                                     |
| **Version**         | 1.0.0                                                             |
| **Status**          | Active                                                            |
| **Owner**           | Principal Architect & Technical Lead                              |
| **Reviewer**        | Full Engineering Team                                             |
| **Classification**  | Internal — Confidential                                           |
| **Created Date**    | 2026-08-02                                                        |
| **Last Updated**    | 2026-08-06                                                        |
| **Project**         | DeployFix Lab                                                     |
| **Project Code**    | DFIX                                                              |

---

# Master ADR Index

| ADR ID | Decision Title | Status | Date | Decision Summary |
|---|---|---|---|---|
| **ADR-001** | Modular Monolith Stack over Microservices | ACCEPTED | 2026-07-19 | Adopted single Express API container for Phase 1/2 to focus on container & deployment troubleshooting. |
| **ADR-002** | React 18 + Vite for Frontend | ACCEPTED | 2026-07-19 | Selected Vite over CRA for sub-second HMR and lightweight Docker multi-stage builds. |
| **ADR-003** | PostgreSQL 16 + Prisma ORM for Data Layer | ACCEPTED | 2026-07-19 | Chose Postgres with Prisma for type-safe schema migrations and relational transaction support. |
| **ADR-004** | Nginx as Reverse Proxy and Ingress Controller | ACCEPTED | 2026-07-19 | Selected Nginx for SSL termination, static SPA file serving, and rate limiting. |
| **ADR-005** | Docker Compose over Kubernetes for V1 | ACCEPTED | 2026-07-19 | Prioritized Docker Compose to keep resource footprint under 2GB RAM for local student labs. |
| **ADR-006** | In-Memory Access Tokens + HttpOnly Cookies | ACCEPTED | 2026-08-01 | Mitigated XSS risks by storing JWT access tokens in React state and refresh tokens in HttpOnly cookies. |
| **ADR-007** | Supabase PostgreSQL as Managed Cloud Database | ACCEPTED | 2026-08-09 | Selected Supabase PostgreSQL for managed cloud environments while preserving Dockerized PostgreSQL for local development labs. |

---

# Detailed Decisions

## ADR-005: Docker Compose over Kubernetes for V1
* **Status:** ACCEPTED
* **Context:** DeployFix Lab must run locally on developer laptops with constrained RAM (4GB–8GB total system RAM).
* **Decision:** Utilize Docker Compose v2 for service orchestration instead of K8s / Minikube.
* **Consequences:** Eliminates K8s control plane memory overhead (~1.5GB RAM saved), allowing the entire stack to run under 500MB RAM.

## ADR-007: Supabase PostgreSQL as Managed Cloud Database
* **Status:** ACCEPTED
* **Context:** DeployFix Lab requires a reliable, managed PostgreSQL database for cloud/staging/production deployments while keeping local development in Docker containers for container troubleshooting practice.
* **Decision:** Adopt **Supabase PostgreSQL** as the official cloud database provider. The application connects strictly via Prisma Client over standard `DATABASE_URL`. Developers use Prisma Studio (`npx prisma studio`) for local inspection and Supabase Dashboard / Studio for cloud administration.
* **Consequences:** Provides 100% PostgreSQL compatibility, seamless Prisma ORM integration, zero application rewrites, and maintains local Docker failure troubleshooting capabilities.
