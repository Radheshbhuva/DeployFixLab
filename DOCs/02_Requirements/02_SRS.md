# 02 — System & Software Requirements Specification (SRS)

---

## Document Metadata

| Field               | Value                                                             |
|---------------------|-------------------------------------------------------------------|
| **Document Name**   | System & Software Requirements Specification (SRS)                |
| **Document ID**     | DFIX-SRS-002                                                      |
| **Version**         | 1.0.0                                                             |
| **Status**          | Approved                                                          |
| **Owner**           | Lead Software & DevOps Engineer                                   |
| **Reviewer**        | Principal Architect, Technical Lead, QA Lead                      |
| **Classification**  | Internal — Confidential                                           |
| **Created Date**    | 2026-08-02                                                        |
| **Last Updated**    | 2026-08-06                                                        |
| **Project**         | DeployFix Lab                                                     |
| **Project Code**    | DFIX                                                              |

---

## Approval Table

| Role                   | Name              | Signature    | Date       | Status   |
|------------------------|-------------------|--------------|------------|----------|
| Product Manager        | Engineering Team  | APPROVED     | 2026-08-02 | Approved |
| Principal Architect    | Architecture Team | APPROVED     | 2026-08-02 | Approved |
| Technical Lead         | Lead Engineer     | APPROVED     | 2026-08-02 | Approved |
| QA Lead                | Quality Team      | APPROVED     | 2026-08-02 | Approved |

---

# 1. Introduction

## 1.1 Purpose
This System & Software Requirements Specification (SRS) defines the complete software and system behavior for **DeployFix Lab**, a production-grade full-stack troubleshooting, failure injection, and recovery training platform. It specifies external interfaces, system workflows, operational environments, subsystem boundaries, data models, state machines, and quality control constraints.

This document bridges high-level product objectives (PRD) with granular technical implementations (`DFIX-FRS-003`) and system architecture design (`03_Architecture`).

## 1.2 Document Scope
This SRS covers all containerized components of DeployFix Lab:
* **Frontend Web Application:** Single Page Application built with React.js and Vite.
* **Backend Application Service:** RESTful API server built with Node.js / Express.js.
* **Database Management System:** PostgreSQL Relational Database Engine.
* **Reverse Proxy & Ingress:** Nginx Web Server for routing, SSL termination, and rate limiting.
* **Troubleshooting & Failure Injection Engine:** Controlled chaos engineering module for simulating real-world deployment breakages (DNS failures, network dropouts, schema drift, container crashes, memory leaks).
* **Observability Suite:** Health check endpoints, structured logging mechanisms, and telemetry collection.

---

# 2. System Overview & Boundaries

## 2.1 System Context Diagram
DeployFix Lab operates as a multi-tier containerized stack orchestrated via Docker Compose:

```
[ Web Browser / User Client ]
           │
           ▼
[ Nginx Reverse Proxy (Port 80/443) ]
           │
   ┌───────┴────────────────────────┐
   ▼                                ▼
[ React Frontend ]          [ Express API Service ]
                                    │
                         ┌──────────┴──────────┐
                         ▼                     ▼
              [ PostgreSQL Database ]   [ Failure Injection Engine ]
```

## 2.2 User Classes & Roles

| Role | Access Level | Description |
|---|---|---|
| **Student / Learner** | Standard User | Interacts with labs, views telemetry, diagnoses injected failures, and executes recovery procedures. |
| **Instructor / Author** | Elevated Author | Creates custom failure scenarios, defines verification tests, and monitors student progress. |
| **DevOps Admin** | System Admin | Manages system infrastructure, global user accounts, Docker host privileges, and raw telemetry logs. |

---

# 3. System External Interfaces

## 3.1 User Interfaces (UI)
* **Authentication Portal:** Login, registration, JWT token renewal, password reset workflows.
* **Lab Catalog & Management Console:** List active, completed, and broken lab environments.
* **Interactive Troubleshooting Terminal / Logs View:** Live stream of stdout/stderr logs from backend, database, and Nginx containers.
* **Chaos / Failure Injection Control Panel:** Admin interface to trigger specific failure scenarios (e.g., set invalid DB password, drop database table, throttle CPU).
* **System Status & Telemetry Dashboard:** Real-time visual display of service latency, error rates, and container health indicators.

## 3.2 Hardware Interfaces
DeployFix Lab does not interface directly with proprietary hardware devices. It interfaces with standard host CPU, RAM, disk storage, and network interface controllers (NICs) allocated to Docker container instances.

## 3.3 Software & API Interfaces

| Service Interface | Protocol | Transport | Description |
|---|---|---|---|
| **Frontend ↔ Backend** | REST / JSON | HTTP/HTTPS | Standard CRUD API endpoints for state management and user interactions. |
| **Log Streaming** | WebSocket / SSE | WSS/HTTP | Real-time log event streaming from Docker stdout to client interface. |
| **Backend ↔ Database** | PostgreSQL Protocol | TCP/IP (Port 5432) | SQL queries executed via connection pool (e.g., `pg` driver). |
| **Reverse Proxy ↔ App** | FastCGI / HTTP | Internal Bridge | Nginx proxying requests to frontend static files and backend REST endpoints. |

---

# 4. System Subsystems & Detailed Requirements

## 4.1 Subsystem 1: Authentication & Identity Management
* **SRS-SUB-01-01:** System shall validate credentials using bcrypt password hashing (minimum work factor 10).
* **SRS-SUB-01-02:** System shall issue Signed JWT access tokens with a 15-minute expiration and HTTP-only refresh tokens.
* **SRS-SUB-01-03:** System shall enforce Role-Based Access Control (RBAC) across API routes (`/api/v1/admin/*`, `/api/v1/labs/*`).

## 4.2 Subsystem 2: Task & Lab Management Engine
* **SRS-SUB-02-01:** System shall maintain lab lifecycle states: `NOT_STARTED`, `IN_PROGRESS`, `FAILED_INJECTED`, `RECOVERED`, `VERIFIED`.
* **SRS-SUB-02-02:** System shall record user execution attempts, time to resolution (TTR), and submitted verification proofs.

## 4.3 Subsystem 3: Failure Injection & Chaos Engine
* **SRS-SUB-03-01:** System shall inject controlled environment failures into running services without corrupting host system files.
* **SRS-SUB-03-02:** Injection engine shall support 5 core failure vectors:
  1. *Database Connection Failure:* Incorrect credentials injected into environment variables.
  2. *Port Contention / Misconfiguration:* Nginx proxying to incorrect backend port.
  3. *Database Schema Drift:* Unapplied migration or missing table index.
  4. *Memory Leak Simulation:* Controlled heap consumption until container OOM (Out Of Memory) event.
  5. *Permission Lockout:* Read-only filesystem restrictions on log directories.

## 4.4 Subsystem 4: Observability & Health Engine
* **SRS-SUB-04-01:** System shall expose `/health/liveness` and `/health/readiness` endpoints on all micro-services.
* **SRS-SUB-04-02:** System shall emit structured JSON logs formatted with ISO-8601 timestamps, log levels (`INFO`, `WARN`, `ERROR`), and correlation IDs.

---

# 5. System State Machine & Behavior Specifications

```
                       ┌─────────────────────────┐
                       │       NOT_STARTED       │
                       └────────────┬────────────┘
                                    │ User Launches Lab
                                    ▼
                       ┌─────────────────────────┐
                       │       IN_PROGRESS       │
                       └────────────┬────────────┘
                                    │ System Triggers Scenario
                                    ▼
                       ┌─────────────────────────┐
                       │     FAILED_INJECTED     │
                       └────────────┬────────────┘
                                    │ User Executes Fix
                                    ▼
                       ┌─────────────────────────┐
                       │        RECOVERED        │
                       └────────────┬────────────┘
                                    │ Verification Suite Passes
                                    ▼
                       ┌─────────────────────────┐
                       │        VERIFIED         │
                       └─────────────────────────┘
```

---

# 6. Constraints & Assumptions

## 6.1 Technical Constraints
* Must run within standard Docker and Docker Compose environment on Linux, macOS, or Windows (WSL2).
* Total memory consumption for all containers combined must not exceed 2.0 GB RAM in baseline state.

## 6.2 Security Constraints
* No plaintext credentials stored in source control or committed `.env` files.
* Non-root user execution enforced inside all Docker containers (`USER node` / `USER app`).

---

# 7. Verification & Acceptance Criteria Summary
System acceptance requires successful automated test suite execution covering:
1. End-to-End user authentication and RBAC enforcement.
2. Controlled failure injection and verified recovery cycle completion.
3. Clean container lifecycle management (`docker-compose up` / `docker-compose down`).
