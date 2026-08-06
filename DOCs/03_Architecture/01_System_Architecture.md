# 01 — System Architecture Specification

---

## Document Metadata

| Field               | Value                                                             |
|---------------------|-------------------------------------------------------------------|
| **Document Name**   | System Architecture Specification                                 |
| **Document ID**     | DFIX-ARCH-001                                                     |
| **Version**         | 1.0.0                                                             |
| **Status**          | Approved                                                          |
| **Owner**           | Principal Systems Architect                                       |
| **Reviewer**        | Technical Lead, DevOps Lead                                       |
| **Classification**  | Internal — Confidential                                           |
| **Created Date**    | 2026-08-02                                                        |
| **Last Updated**    | 2026-08-06                                                        |
| **Project**         | DeployFix Lab                                                     |
| **Project Code**    | DFIX                                                              |

---

# 1. Executive Architecture Summary

**DeployFix Lab** is designed as a production-grade, multi-tier containerized platform purpose-built for full-stack software development, cloud deployment, telemetry monitoring, controlled chaos engineering, and recovery practice.

The system leverages a modular, decoupled tier structure:
* **Client / Presentation Layer:** Single Page Application (SPA) built with React 18, TypeScript, and Vite.
* **Ingress / Reverse Proxy Layer:** Nginx Web Server serving static frontend assets, managing SSL termination, rate limiting, and routing API traffic.
* **Application / Business Logic Layer:** RESTful Micro-service API built with Node.js, Express.js, and TypeScript.
* **Data Storage Layer:** PostgreSQL Relational Database with Prisma ORM.
* **Chaos Engineering & Failure Injection Engine:** Dedicated sub-system for injecting controlled environment breakages (DNS failures, connection timeouts, schema mismatches, OOM conditions).
* **Observability Suite:** Structured JSON logger (Winston), health probes (`/health/liveness`, `/health/readiness`), and WebSocket log streaming.

---

# 2. High-Level System Context (C4 Level 1 Diagram)

```mermaid
C4Context
    title System Context Diagram for DeployFix Lab

    Person(user, "Learner / Developer", "Diagnoses failures, executes labs, views real-time telemetry")
    Person(admin, "Instructor / Admin", "Triggers chaos scenarios, manages lab catalog, views analytics")

    System(deployfix, "DeployFix Lab Platform", "Containerized Full-Stack Troubleshooting & Recovery Lab Environment")

    System_Ext(github, "GitHub Actions", "CI/CD pipeline for automated testing and container deployment")
    System_Ext(docker, "Docker Host", "Runtime container host managing Nginx, App, DB, and Chaos Engine")

    Rel(user, deployfix, "Accesses dashboard, runs labs, views logs", "HTTPS / WSS")
    Rel(admin, deployfix, "Injects failures, manages users", "HTTPS")
    Rel(github, deployfix, "Deploys container builds", "SSH / Docker API")
    Rel(deployfix, docker, "Runs containerized services", "Docker Socket / IPC")
```

---

# 3. System Container Architecture (C4 Level 2 Diagram)

```mermaid
C4Container
    title Container Diagram for DeployFix Lab

    Person(client, "Web Browser", "Renders React SPA dashboard")

    Container_Boundary(docker_env, "Docker Compose Network (dfix-net)") {
        Container(nginx, "Nginx Ingress Proxy", "Nginx 1.25", "Handles SSL, serves static frontend assets, proxies /api requests")
        Container(frontend, "React SPA", "React 18 + Vite", "Provides UI for authentication, lab control, and log viewing")
        Container(backend, "Express API Server", "Node.js + Express", "Handles business logic, auth, lab state machine, and API endpoints")
        Container(chaos, "Chaos Engine", "Node.js Process", "Injects controlled system failures into containers")
        ContainerDb(database, "PostgreSQL DB", "Postgres 16", "Stores users, lab states, logs, and failure scenario metadata")
    }

    Rel(client, nginx, "Sends HTTP/HTTPS Requests", "Port 80/443")
    Rel(nginx, frontend, "Serves Static UI Assets", "Internal Port 80")
    Rel(nginx, backend, "Proxies REST / WSS Requests", "Internal Port 5000")
    Rel(backend, database, "Executes SQL Queries (Prisma)", "Internal Port 5432")
    Rel(backend, chaos, "Triggers Scenario Injections", "IPC / HTTP")
```

---

# 4. Architectural Principles

1. **Strict Separation of Concerns:** Frontend UI, Backend API, Proxy Ingress, and Database operate in isolated, zero-dependency containers.
2. **Configuration via Environment Variables:** All runtime configurations follow 12-Factor App methodology (`.env` injected into Docker containers).
3. **Stateless Backend Processing:** Access state is maintained via JWT tokens, allowing backend containers to scale or restart seamlessly.
4. **Idempotent Failure Injection:** Chaos injections modify runtime state in isolated container layers without permanently corrupting base image files or host storage.
5. **Observability First:** Every system transaction emits structured logs with correlation IDs for end-to-end request tracing.

---

# 5. Core Operational Modes

| Mode | Target User | State | Description |
|---|---|---|---|
| **Normal Operation** | Learner / User | `OPERATIONAL` | All services operating normally; standard CRUD functionality available. |
| **Chaos Injection** | Instructor / Admin | `FAILED_INJECTED` | Failure vector active (e.g., DB connection string altered, Nginx port changed). |
| **Troubleshooting** | Learner | `DIAGNOSING` | User inspects logs, container health, network connectivity to isolate root cause. |
| **Verification** | Automated System | `VERIFYING` | Automated probe executes diagnostic tests to validate recovery. |
