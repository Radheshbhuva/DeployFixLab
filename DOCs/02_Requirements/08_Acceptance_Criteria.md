# 08 — Acceptance Criteria Specification

---

## Document Metadata

| Field               | Value                                                             |
|---------------------|-------------------------------------------------------------------|
| **Document Name**   | Acceptance Criteria Specification                                 |
| **Document ID**     | DFIX-ACC-008                                                      |
| **Version**         | 1.0.0                                                             |
| **Status**          | Approved                                                          |
| **Owner**           | Quality Assurance & Test Engineering Team                         |
| **Reviewer**        | Technical Lead, Principal Architect                               |
| **Classification**  | Internal — Confidential                                           |
| **Created Date**    | 2026-08-02                                                        |
| **Last Updated**    | 2026-08-06                                                        |
| **Project**         | DeployFix Lab                                                     |
| **Project Code**    | DFIX                                                              |

---

# 1. Purpose & Framework

This document defines the formal **Acceptance Criteria** for DeployFix Lab. Every functional requirement (`FR-001` through `FR-191`) and non-functional requirement (`NFR-001` through `NFR-044`) must satisfy these criteria before being marked as **Done** in accordance with the project's *Definition of Done (DoD)*.

Acceptance criteria are specified using the industry-standard **BDD (Behavior-Driven Development) Given-When-Then** format alongside testable assertion rules.

---

# 2. Category 1: Authentication & Access Control (FR-001 – FR-020)

## AC-AUTH-001: User Registration Validation
* **Target Requirement:** FR-001, FR-002
* **Scenario:** Registering a new account with valid vs invalid credentials.
  * **Given** an unauthenticated user on the registration page,
  * **When** the user submits a valid email (`user@example.com`) and strong password (`P@ssword123!`),
  * **Then** an account is created, password is stored as a bcrypt hash (cost factor >= 10), and HTTP status `201 Created` is returned.
  * **When** the user submits an existing email or password under 8 characters,
  * **Then** the API returns HTTP status `400 Bad Request` with structured error details `{"error": "INVALID_INPUT"}`.

## AC-AUTH-002: JWT Authentication & Refresh Token Handling
* **Target Requirement:** FR-003, FR-004
* **Scenario:** Authenticating and making protected API calls.
  * **Given** a registered user submitting valid credentials at `/api/v1/auth/login`,
  * **When** credentials pass verification,
  * **Then** the server responds with an Access Token in JSON payload (expiry 15 mins) and sets a `HttpOnly`, `SameSite=Strict`, `Secure` Refresh Token cookie.
  * **When** an API request is made to `/api/v1/user/profile` without `Authorization: Bearer <token>`,
  * **Then** the system returns HTTP `401 Unauthorized`.

---

# 3. Category 2: Dashboard & Telemetry Visualizer (FR-021 – FR-040)

## AC-DASH-001: System Status & Real-time Metrics Display
* **Target Requirement:** FR-021, FR-025
* **Scenario:** Viewing live container and application status on the dashboard.
  * **Given** an authenticated user accessing `/dashboard`,
  * **When** all Docker services (`nginx`, `backend`, `db`) are running healthily,
  * **Then** system status cards display green `OPERATIONAL` badges with response latency under 300 ms.
  * **When** the database service becomes unreachable or unhealthy,
  * **Then** the database status card updates to red `CRITICAL / DEGRADED` within 5 seconds without requiring full page refresh.

---

# 4. Category 3: Task & Lab Scenario Execution (FR-041 – FR-060)

## AC-TASK-001: Lab Scenario Lifecycle & Verification
* **Target Requirement:** FR-041, FR-045, FR-050
* **Scenario:** Starting a lab, experiencing failure injection, and verifying recovery.
  * **Given** a user starting Lab Scenario `LAB-003: Nginx Proxy Port Misconfiguration`,
  * **When** the user clicks "Trigger Scenario",
  * **Then** the chaos engine modifies Nginx configuration to point to port 8080 instead of 5000, causing HTTP `502 Bad Gateway`.
  * **When** the user updates the config file and clicks "Verify Fix",
  * **Then** the automated test runner executes verification HTTP probes and transitions lab status to `VERIFIED`.

---

# 5. Category 4: Docker & Container Orchestration (FR-076 – FR-090)

## AC-DOC-001: Container Lifecycle & Non-Root Execution
* **Target Requirement:** FR-076, FR-080
* **Scenario:** Spinning up container environment via Docker Compose.
  * **Given** a clean workspace environment,
  * **When** `docker-compose up -d` is executed,
  * **Then** all 3 container services (`frontend`, `backend`, `postgres`) launch within 30 seconds and pass healthchecks.
  * **When** executing `docker exec backend id -u` inside running containers,
  * **Then** non-zero UID (e.g. `10001` or `node`) is returned, verifying non-root execution.

---

# 6. Category 5: Troubleshooting & Chaos Injection (FR-128 – FR-147)

## AC-TB-001: Controlled Failure Injection Safety Gate
* **Target Requirement:** FR-128, FR-130
* **Scenario:** Injecting database connection failure.
  * **Given** an active instructor session on the Failure Injection panel,
  * **When** triggering `FAIL-DB-CONN-01`,
  * **Then** the system updates database credentials in container memory, causing backend API requests to emit `DB_CONNECTION_TIMEOUT`.
  * **And** host OS filesystem outside designated volume mounts remains completely unmodified and isolated.

---

# 7. Category 6: Observability & Logging (FR-106 – FR-127)

## AC-OBS-001: Structured JSON Logging & Masking
* **Target Requirement:** FR-118, FR-120
* **Scenario:** Logging application events and error conditions.
  * **Given** backend API receiving requests,
  * **When** an exception or normal request occurs,
  * **Then** stdout logs format events as single-line JSON with keys `timestamp`, `level`, `correlationId`, `message`, `path`.
  * **And** any payload fields matching `password`, `token`, `secret`, `creditCard` are replaced with `[REDACTED]`.

---

# 8. Category 7: Non-Functional Acceptance Criteria (NFR-001 – NFR-044)

## AC-NFR-001: Performance Thresholds
* **Target Requirement:** NFR-001, NFR-002
* **Criteria:**
  1. **Page Load:** Initial React bundle load completes in `< 3.0s` over standard 4G connections.
  2. **API Latency:** 95th percentile (p95) API response time for all standard CRUD operations is `< 300 ms`.
  3. **Build Speed:** Full Docker image build completes in `< 5 minutes` with warm cache.

## AC-NFR-002: Security Compliance
* **Target Requirement:** NFR-016 – NFR-020
* **Criteria:**
  1. No plaintext secrets, tokens, or private keys present in git commit history (validated via automated pre-commit hook scanning).
  2. All passwords hashed using bcrypt with salt rounds >= 10.
  3. CORS policy explicitly whitelist only authorized client domains.

---

# 9. Acceptance Criteria Approval & Sign-Off Matrix

| Component | Test Automation Status | QA Lead Approval | Date Approved |
|---|---|---|---|
| **Authentication Module** | Automated (Jest + Supertest) | APPROVED | 2026-08-02 |
| **Dashboard & Visualizer** | Automated (Playwright E2E) | APPROVED | 2026-08-02 |
| **Task / Lab Engine** | Automated (Integration Suite) | APPROVED | 2026-08-02 |
| **Failure Injection Engine**| Automated (Chaos Probes) | APPROVED | 2026-08-02 |
| **Docker & Nginx Stack** | Automated (Bash Smoke Tests) | APPROVED | 2026-08-02 |
