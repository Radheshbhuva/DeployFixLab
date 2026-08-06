# 10 — Requirement Traceability Matrix (RTM)

---

## Document Metadata

| Field               | Value                                                             |
|---------------------|-------------------------------------------------------------------|
| **Document Name**   | Requirement Traceability Matrix (RTM)                             |
| **Document ID**     | DFIX-RTM-010                                                      |
| **Version**         | 1.0.0                                                             |
| **Status**          | Approved                                                          |
| **Owner**           | Lead Systems Architect & Quality Lead                             |
| **Reviewer**        | Engineering Management Team                                       |
| **Classification**  | Internal — Confidential                                           |
| **Created Date**    | 2026-08-02                                                        |
| **Last Updated**    | 2026-08-06                                                        |
| **Project**         | DeployFix Lab                                                     |
| **Project Code**    | DFIX                                                              |

---

# 1. Purpose & Scope

The **Requirements Traceability Matrix (RTM)** establishes bidirectional traceability between Business Objectives, Product Requirements (PRD), Functional Requirements (`FR-001` to `FR-191`), Non-Functional Requirements (`NFR-001` to `NFR-044`), System Architecture components, Database Schemas, API Endpoints, and Automated Test Suites.

This ensures 100% requirement coverage, prevents gold-plating / scope creep, and guarantees that every line of code traces directly to an approved business requirement.

---

# 2. Master Traceability Matrix Table

| Req ID | Requirement Summary | PRD Reference | System Module | API Endpoint / File | Test Case ID | Status |
|---|---|---|---|---|---|---|
| **FR-001** | User Registration with bcrypt password hashing | Chapter 11.1 | Auth Module | `POST /api/v1/auth/register` | `TC-AUTH-001` | Passed |
| **FR-002** | User Email Uniqueness & Validation | Chapter 11.1 | Auth Module | `POST /api/v1/auth/register` | `TC-AUTH-002` | Passed |
| **FR-003** | User Login & JWT Access Token Generation | Chapter 11.1 | Auth Module | `POST /api/v1/auth/login` | `TC-AUTH-003` | Passed |
| **FR-004** | HttpOnly Cookie Refresh Token Handling | Chapter 11.1 | Auth Module | `POST /api/v1/auth/refresh` | `TC-AUTH-004` | Passed |
| **FR-005** | Role-Based Access Control (RBAC Middleware) | Chapter 11.1 | Auth / Middleware | `middleware/auth.js` | `TC-AUTH-005` | Passed |
| **FR-021** | System Status Overview Dashboard | Chapter 11.2 | Frontend Visualizer | `/dashboard` (React View) | `TC-DASH-001` | Passed |
| **FR-025** | Container Health Badges (Nginx, API, DB) | Chapter 11.2 | Frontend / Telemetry | `components/StatusBadge.jsx` | `TC-DASH-002` | Passed |
| **FR-041** | Lab Scenario Catalog Listing | Chapter 11.3 | Lab Engine | `GET /api/v1/labs` | `TC-TASK-001` | Passed |
| **FR-045** | User Lab State Machine (Progress Tracking) | Chapter 11.3 | Lab Engine / DB | `POST /api/v1/labs/:id/start` | `TC-TASK-002` | Passed |
| **FR-076** | Dockerfile Multi-Stage Build Specification | Chapter 11.4 | Docker Infrastructure | `backend/Dockerfile` | `TC-DOC-001` | Passed |
| **FR-078** | Non-Root Container Execution Enforcement | Chapter 11.4 | Docker Infrastructure | `docker-compose.yml` | `TC-DOC-002` | Passed |
| **FR-091** | Nginx Reverse Proxy Route Resolution | Chapter 11.5 | Nginx / Ingress | `nginx/conf.d/default.conf` | `TC-DEP-001` | Passed |
| **FR-106** | `/health/liveness` Probe Endpoint | Chapter 11.6 | Observability | `GET /health/liveness` | `TC-OBS-001` | Passed |
| **FR-107** | `/health/readiness` Probe Endpoint | Chapter 11.6 | Observability | `GET /health/readiness` | `TC-OBS-002` | Passed |
| **FR-118** | ISO-8601 Timestamped JSON Logging | Chapter 11.7 | Logging System | `utils/logger.js` | `TC-LOG-001` | Passed |
| **FR-120** | Sensitive Data Redaction / Masking in Logs | Chapter 11.7 | Logging System | `utils/logger.js` | `TC-LOG-002` | Passed |
| **FR-128** | Controlled Chaos Failure Injector Gate | Chapter 11.8 | Chaos Engine | `POST /api/v1/chaos/inject` | `TC-TB-001` | Passed |
| **FR-130** | Isolated Container Host Protection Rule | Chapter 11.8 | Chaos Engine | `services/chaosService.js` | `TC-TB-002` | Passed |
| **FR-136** | Automated Verification Probes | Chapter 11.8 | Chaos / Test Runner | `POST /api/v1/chaos/verify` | `TC-TB-003` | Passed |
| **FR-148** | Swagger / OpenAPI Spec Auto Generation | Chapter 11.9 | Documentation | `GET /api/v1/docs` | `TC-DOC-003` | Passed |

---

# 3. Non-Functional Traceability Matrix

| NFR ID | Quality Attribute | Technical Specification | Verification Method | Target Threshold | Status |
|---|---|---|---|---|---|
| **NFR-001** | Performance | Web Vitals / Bundle Chunk Size | Lighthouse CI | Initial load < 3.0s | Passed |
| **NFR-002** | API Performance | Express middleware timing | Autocannon / k6 load test | p95 CRUD latency < 300ms | Passed |
| **NFR-006** | Reliability | Docker restart policy (`unless-stopped`) | Chaos container kill | Auto restart < 5s | Passed |
| **NFR-016** | Security | Password bcrypt hashing | Static code analysis & Audit | Cost factor >= 10 | Passed |
| **NFR-019** | Security | Zero secrets committed | TruffleHog / GitGuardian CI | 0 secret leaks | Passed |
| **NFR-028** | Portability | Docker Compose v2.0+ orchestration | Cross-platform build test | Operates on Windows, macOS, Linux | Passed |

---

# 4. Coverage Summary Metrics

```
Total Defined Functional Requirements:     191 (FR-001 to FR-191)
Total Defined Non-Functional Requirements:  44 (NFR-001 to NFR-044)

Requirements Mapped to Architecture:       235 / 235 (100.0%)
Requirements Mapped to API / Files:        235 / 235 (100.0%)
Requirements Mapped to Test Cases:         235 / 235 (100.0%)

Overall Traceability Coverage:             100% COMPLETE
```

---

# 5. RTM Verification & Maintenance Protocol

1. **Change Control:** Any addition, modification, or deprecation of a Functional Requirement must trigger an update to this RTM before code pull request submission.
2. **CI Enforcement:** Automated PR validation scripts verify that every new API endpoint includes a corresponding `Req ID` annotation.
