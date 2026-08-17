# 03 — Functional Requirements Specification

---

## Document Metadata

| Field               | Value                                                             |
|---------------------|-------------------------------------------------------------------|
| **Document Name**   | Functional Requirements Specification                             |
| **Document ID**     | DFIX-FRS-003                                                      |
| **Version**         | 1.0.0                                                             |
| **Status**          | Approved                                                          |
| **Owner**           | Product Engineering Team                                          |
| **Reviewer**        | Principal Architect, Technical Lead, QA Lead                      |
| **Classification**  | Internal — Confidential                                           |
| **Created Date**    | 2026-08-02                                                        |
| **Last Updated**    | 2026-08-02                                                        |
| **Project**         | DeployFix Lab                                                     |
| **Project Code**    | DFIX                                                              |

---

## Approval Table

| Role                   | Name              | Signature    | Date       | Status   |
|------------------------|-------------------|--------------|------------|----------|
| Product Manager        | TBD               | __________   | 2026-08-02 | Pending  |
| Principal Architect    | TBD               | __________   | 2026-08-02 | Pending  |
| Technical Lead         | TBD               | __________   | 2026-08-02 | Pending  |
| QA Lead                | TBD               | __________   | 2026-08-02 | Pending  |
| DevOps Architect       | TBD               | __________   | 2026-08-02 | Pending  |
| Security Engineer      | TBD               | __________   | 2026-08-02 | Pending  |

---

## Version History

| Version | Date       | Author              | Summary of Changes                                         |
|---------|------------|---------------------|------------------------------------------------------------|
| 0.1.0   | 2026-08-01 | Product Team        | Initial draft — structure and Chapter 1 outline            |
| 0.5.0   | 2026-08-01 | Requirements Team   | Auth, Dashboard, Task Management requirements drafted      |
| 0.9.0   | 2026-08-02 | Engineering Team    | All chapters drafted; FR-001 through FR-191 complete       |
| 1.0.0   | 2026-08-02 | Product Engineering | Final review pass; approved for engineering execution      |

---

## Revision History

| Rev | Date       | Section Changed                    | Reason                                 |
|-----|------------|------------------------------------|----------------------------------------|
| R01 | 2026-08-02 | All                                | Initial baseline establishment         |

---

## Table of Contents

- [Chapter 1: Introduction](#chapter-1-introduction)
- [Chapter 2: Requirement Standards](#chapter-2-requirement-standards)
- [Chapter 3: Authentication Requirements — FR-001 to FR-020](#chapter-3-authentication-requirements)
- [Chapter 4: Dashboard Requirements — FR-021 to FR-040](#chapter-4-dashboard-requirements)
- [Chapter 5: Task Management Requirements — FR-041 to FR-060](#chapter-5-task-management-requirements)
- [Chapter 6: User Management Requirements — FR-061 to FR-075](#chapter-6-user-management-requirements)
- [Chapter 7: Docker Requirements — FR-076 to FR-090](#chapter-7-docker-requirements)
- [Chapter 8: Deployment Requirements — FR-091 to FR-105](#chapter-8-deployment-requirements)
- [Chapter 9: Monitoring Requirements — FR-106 to FR-117](#chapter-9-monitoring-requirements)
- [Chapter 10: Logging Requirements — FR-118 to FR-127](#chapter-10-logging-requirements)
- [Chapter 11: Troubleshooting Requirements — FR-128 to FR-147](#chapter-11-troubleshooting-requirements)
- [Chapter 12: Documentation Requirements — FR-148 to FR-157](#chapter-12-documentation-requirements)
- [Chapter 13: AI Requirements — FR-158 to FR-169](#chapter-13-ai-requirements)
- [Chapter 14: Analytics Requirements — FR-170 to FR-179](#chapter-14-analytics-requirements)
- [Chapter 15: Administrative Requirements — FR-180 to FR-191](#chapter-15-administrative-requirements)
- [Chapter 16: Traceability Matrix](#chapter-16-traceability-matrix)
- [Chapter 17: Acceptance Criteria](#chapter-17-acceptance-criteria)

---

---

# Chapter 1: Introduction

## 1.1 Purpose

This document constitutes the Functional Requirements Specification (FRS) for **DeployFix Lab**, a Production Deployment Troubleshooting and Recovery Platform. It defines the complete set of functional requirements that govern all behaviors, capabilities, workflows, and constraints of the DeployFix Lab system.

This specification is the authoritative reference for all engineering, QA, DevOps, and product management activities. All implementation work must trace directly to requirements defined in this document.

This document is intended to be read by:

- **Software Engineers** implementing features and APIs
- **QA Engineers** writing test plans and test cases
- **DevOps Engineers** designing infrastructure and CI/CD pipelines
- **Technical Leads** reviewing architecture decisions
- **Product Managers** validating scope and business alignment
- **Instructors and Educators** defining learning paths built on the platform

---

## 1.2 Scope

DeployFix Lab is a full-stack, containerized, production-grade web platform that:

1. Provides an interactive learning environment for software engineers to practice real-world deployment scenarios
2. Covers the complete software development lifecycle (SDLC) from code to production recovery
3. Simulates real production environments including Docker containers, PostgreSQL databases, Express APIs, React frontends, CI/CD pipelines, and cloud deployment targets
4. Teaches structured troubleshooting, root cause analysis, and incident recovery
5. Integrates AI-assisted engineering workflows for documentation, debugging, and prompt engineering
6. Produces professional engineering documentation artifacts at every stage

**In Scope:**
- Authentication and Authorization system
- Dashboard and analytics
- Task and project management
- Docker and Docker Compose workflows
- CI/CD pipeline design and execution
- Monitoring and alerting systems
- Structured logging infrastructure
- Troubleshooting and incident recovery workflows
- AI integration and prompt library management
- Full documentation pipeline
- Administrative controls

**Out of Scope:**
- Mobile native applications (iOS / Android)
- Third-party LMS integration (future)
- Billing and payment processing (future)
- Multi-tenant enterprise SSO (future)

---

## 1.3 Objectives

| # | Objective                                                                                  |
|---|--------------------------------------------------------------------------------------------|
| 1 | Deliver a production-grade platform engineers can use to learn real deployment workflows   |
| 2 | Simulate all failure modes commonly encountered in real production systems                 |
| 3 | Provide structured, trackable task and project management workflows                        |
| 4 | Integrate AI assistance natively into engineering documentation and debugging              |
| 5 | Generate professional engineering documentation artifacts as a first-class feature         |
| 6 | Support structured monitoring and observability for containerized services                 |
| 7 | Enable recovery workflows with root cause analysis and incident reports                    |

---

## 1.4 Definitions and Abbreviations

| Term / Abbreviation | Definition                                                                          |
|---------------------|-------------------------------------------------------------------------------------|
| FRS                 | Functional Requirements Specification                                               |
| FR                  | Functional Requirement                                                              |
| SDLC                | Software Development Lifecycle                                                      |
| JWT                 | JSON Web Token — stateless authentication token format                              |
| RCA                 | Root Cause Analysis — structured investigation of an incident's origin              |
| CI/CD               | Continuous Integration / Continuous Deployment                                      |
| ADR                 | Architecture Decision Record — documented rationale for architectural decisions     |
| SRS                 | Software Requirements Specification                                                 |
| PRD                 | Product Requirements Document                                                       |
| API                 | Application Programming Interface                                                   |
| ORM                 | Object Relational Mapper (e.g., Prisma, Drizzle)                                   |
| TLS                 | Transport Layer Security — encryption protocol for network communication            |
| RBAC                | Role-Based Access Control                                                           |
| UI                  | User Interface                                                                      |
| CORS                | Cross-Origin Resource Sharing                                                       |
| SLA                 | Service Level Agreement                                                             |
| MFA                 | Multi-Factor Authentication                                                         |
| LLM                 | Large Language Model                                                                |
| Incident            | An unplanned interruption or degradation of service in the production environment  |
| Playbook            | A structured, step-by-step remediation guide for a specific failure category        |

---

## 1.5 References

| Reference | Document / Resource                                                     |
|-----------|-------------------------------------------------------------------------|
| [REF-01]  | DFIX-PRD-001 — Product Requirements Document                            |
| [REF-02]  | DFIX-SRS-002 — Software Requirements Specification                      |
| [REF-03]  | DFIX-ARCH-001 — System Architecture Document                            |
| [REF-04]  | IEEE Std 830-1998 — Recommended Practice for Software Requirements      |
| [REF-05]  | OWASP Authentication Best Practices                                     |
| [REF-06]  | Docker Official Documentation — Dockerfile Reference                    |
| [REF-07]  | Render Platform Deployment Guide                                        |
| [REF-08]  | OpenAI API Reference                                                    |
| [REF-09]  | NIST SP 800-53 — Security Controls Catalog                             |
| [REF-10]  | DeployFix Lab Engineering Standards — DFIX-ENG-004                     |

---

## 1.6 Document Structure

This document is organized into seventeen chapters:

- **Chapters 1–2**: Introductory context, standards, and requirement governance rules
- **Chapters 3–6**: Core application requirements (Auth, Dashboard, Tasks, Users)
- **Chapters 7–8**: Infrastructure requirements (Docker, Deployment, CI/CD)
- **Chapters 9–10**: Observability requirements (Monitoring, Logging)
- **Chapter 11**: Troubleshooting and incident recovery requirements
- **Chapters 12–13**: Documentation and AI-integration requirements
- **Chapters 14–15**: Analytics and administrative requirements
- **Chapters 16–17**: Traceability matrix and acceptance criteria

---

---

# Chapter 2: Requirement Standards

## 2.1 Requirement Writing Rules

All functional requirements in this document adhere to the following rules:

1. **Uniqueness**: Every requirement has a unique ID that is never reused or restarted.
2. **Testability**: Every requirement must be verifiable through automated tests, manual testing, or direct inspection.
3. **Measurability**: Every requirement must define a quantifiable acceptance criterion where applicable.
4. **Atomicity**: Each requirement describes exactly one capability or behavior.
5. **Completeness**: Requirements include all fields defined in the requirement template.
6. **Unambiguity**: Requirements use precise, technical language. Terms like "fast," "user-friendly," and "flexible" are prohibited without measurable qualification.
7. **Traceability**: Every requirement links to a business goal, product goal, and test case ID.

---

## 2.2 Requirement Template

Every functional requirement follows this template:

```
Requirement ID     : FR-XXX
Requirement Name   : <Name>
Priority           : Must Have | Should Have | Could Have | Future
Description        : <Precise technical description>
Business Value     : <Why this matters to the business or user>
Actor              : <Who initiates or is affected by this requirement>
Preconditions      : <State of the system before this requirement executes>
Trigger            : <Event or action that activates this requirement>
Main Flow          : <Numbered steps describing the core behavior>
Postconditions     : <State of the system after successful execution>
Dependencies       : <Other FRs, APIs, or systems this depends on>
Related APIs       : <API endpoints this requirement maps to>
Related DB Tables  : <Database tables this requirement reads/writes>
Related UI         : <UI screens or components involved>
Acceptance Criteria: <Specific, measurable pass/fail conditions>
Validation Method  : <Automated Test | Manual Test | Inspection | Review>
Traceability       : <Business Goal | Product Goal | User Story | Sprint>
Status             : Defined | In Progress | Implemented | Verified
```

---

## 2.3 Requirement Lifecycle

```
Proposed → Draft → Review → Approved → In Development → Testing → Verified → Baseline
```

| Phase          | Description                                                                      |
|----------------|----------------------------------------------------------------------------------|
| Proposed       | Requirement candidate identified                                                  |
| Draft          | Initial writing in progress                                                       |
| Review         | Undergoing stakeholder and technical review                                       |
| Approved       | Signed off and baselined for implementation                                       |
| In Development | Engineering implementation is active                                              |
| Testing        | QA verification is in progress                                                    |
| Verified       | All acceptance criteria confirmed passing                                         |
| Baseline       | Locked into the release baseline — changes require formal change control          |

---

## 2.4 Requirement Priority Definitions

| Priority     | Description                                                                              |
|--------------|------------------------------------------------------------------------------------------|
| Must Have    | Non-negotiable. Product cannot ship without this requirement satisfied.                  |
| Should Have  | High value. Should be included in the first release if resources allow.                  |
| Could Have   | Desirable. Included if schedule permits without risk to core delivery.                   |
| Future       | Deferred. Planned for a future release. Not in current sprint scope.                     |

---

## 2.5 Requirement Status Definitions

| Status        | Meaning                                                        |
|---------------|----------------------------------------------------------------|
| Defined       | Requirement is written and ready for review                    |
| Approved      | Requirement is approved and ready for development              |
| In Progress   | Development is actively implementing this requirement          |
| Implemented   | Code is written; awaiting QA verification                      |
| Verified      | QA has confirmed all acceptance criteria pass                  |
| Deferred      | Requirement moved to a future sprint by formal decision        |
| Rejected      | Requirement removed after review; reason documented in change log |

---

## 2.6 Requirement Validation Methods

| Method           | Description                                                                     |
|------------------|---------------------------------------------------------------------------------|
| Automated Test   | Validated by an automated unit, integration, or E2E test in CI pipeline        |
| Manual Test      | Validated by QA engineer following a defined test script                        |
| Inspection       | Validated by code review or document review without live execution              |
| Demonstration    | Validated by live demonstration to stakeholders                                  |
| Analysis         | Validated by mathematical analysis, modeling, or review of artifacts            |

---

## 2.7 Requirement Traceability

All requirements trace bidirectionally to:

- Business goals in the PRD ([REF-01])
- Product goals in the SRS ([REF-02])
- Architecture components in [REF-03]
- Test cases in the Test Management System (TMS)
- Sprint backlog items

---

## 2.8 Requirement Dependencies

Where a functional requirement depends on another, the dependency is noted in the **Dependencies** field using the format:

```
Depends on: FR-XXX, FR-YYY
```

Where a requirement is depended upon by others:

```
Required by: FR-XXX, FR-YYY
```

---

---

# Chapter 3: Authentication Requirements

## Overview

The Authentication module governs how users register, authenticate, and are authorized within DeployFix Lab. It implements JWT-based stateless authentication with bcrypt password hashing, role-based access control, rate limiting, and input validation following OWASP security standards.

---

### FR-001

| Field               | Value                                                                                              |
|---------------------|----------------------------------------------------------------------------------------------------|
| **Requirement ID**  | FR-001                                                                                             |
| **Name**            | User Registration                                                                                  |
| **Priority**        | Must Have                                                                                          |
| **Description**     | The system shall allow any Guest to register a new account by submitting a username, email address, and password. Registration creates a user record in the database and returns a success response with the created user's non-sensitive profile data. |
| **Business Value**  | Enables new users to onboard into the platform and begin using its features                        |
| **Actor**           | Guest                                                                                              |
| **Preconditions**   | No existing account exists with the provided email or username                                     |
| **Trigger**         | Guest submits the registration form with valid credentials                                         |
| **Main Flow**       | 1. Guest navigates to `/register`. 2. Guest submits `{ username, email, password }`. 3. System validates all fields (email format, password strength, username uniqueness). 4. System hashes the password using bcrypt with salt rounds >= 12. 5. System creates a new record in the `users` table. 6. System returns HTTP 201 with `{ id, username, email, role, createdAt }`. |
| **Postconditions**  | A new user record exists in the database; password is stored as a bcrypt hash                     |
| **Dependencies**    | FR-004 (Password Hashing), FR-015 (Input Validation)                                              |
| **Related APIs**    | `POST /api/auth/register`                                                                          |
| **Related DB Tables** | `users`                                                                                          |
| **Related UI**      | `RegisterPage`, `RegisterForm`                                                                     |
| **Acceptance Criteria** | 1. Registration with valid data returns HTTP 201. 2. Duplicate email returns HTTP 409 with `{ error: "Email already in use" }`. 3. Duplicate username returns HTTP 409. 4. Missing required fields return HTTP 400. 5. Password is never returned in the response. 6. Stored password in DB is a bcrypt hash beginning with `$2b$`. |
| **Validation Method** | Automated Integration Test                                                                      |
| **Traceability**    | Business Goal: User Acquisition; Sprint: Sprint-01                                                |
| **Status**          | Approved                                                                                           |

---

### FR-002

| Field               | Value                                                                                              |
|---------------------|----------------------------------------------------------------------------------------------------|
| **Requirement ID**  | FR-002                                                                                             |
| **Name**            | User Login with JWT                                                                                |
| **Priority**        | Must Have                                                                                          |
| **Description**     | The system shall authenticate a registered user using their email/username and password, returning a signed JWT access token and a refresh token upon successful verification. |
| **Business Value**  | Provides secure, stateless authentication for all subsequent API requests                          |
| **Actor**           | Registered User, Developer, Student                                                                |
| **Preconditions**   | User account exists and is not suspended                                                           |
| **Trigger**         | User submits login form with credentials                                                           |
| **Main Flow**       | 1. User submits `{ emailOrUsername, password }` to `POST /api/auth/login`. 2. System locates the user record by email or username. 3. System compares submitted password against stored bcrypt hash. 4. On match, system generates a JWT access token (expiry: 15 minutes) signed with `JWT_SECRET`. 5. System generates a refresh token (expiry: 7 days) and stores its hash in `refresh_tokens` table. 6. System returns HTTP 200 with `{ accessToken, refreshToken, user: { id, username, email, role } }`. |
| **Postconditions**  | Client holds a valid JWT access token and refresh token                                            |
| **Dependencies**    | FR-001, FR-004, FR-014 (Rate Limiting)                                                            |
| **Related APIs**    | `POST /api/auth/login`                                                                             |
| **Related DB Tables** | `users`, `refresh_tokens`                                                                        |
| **Related UI**      | `LoginPage`, `LoginForm`                                                                           |
| **Acceptance Criteria** | 1. Valid credentials return HTTP 200 with both tokens. 2. Invalid password returns HTTP 401. 3. Non-existent user returns HTTP 401 (same error message as invalid password to prevent user enumeration). 4. JWT `exp` claim equals `iat + 900` (15 min). 5. Refresh token `exp` equals `iat + 604800` (7 days). 6. Response never includes the raw password hash. |
| **Validation Method** | Automated Integration Test                                                                      |
| **Traceability**    | Business Goal: Secure Access; Sprint: Sprint-01                                                    |
| **Status**          | Approved                                                                                           |

---

### FR-003

| Field               | Value                                                                                              |
|---------------------|----------------------------------------------------------------------------------------------------|
| **Requirement ID**  | FR-003                                                                                             |
| **Name**            | User Logout                                                                                        |
| **Priority**        | Must Have                                                                                          |
| **Description**     | The system shall invalidate the active refresh token on logout by deleting it from the `refresh_tokens` table, effectively ending the user's authenticated session. |
| **Business Value**  | Prevents unauthorized continued access after a user explicitly ends their session                  |
| **Actor**           | Authenticated User                                                                                 |
| **Preconditions**   | User is authenticated and holds a valid refresh token                                              |
| **Trigger**         | User clicks "Logout" in the UI or sends `POST /api/auth/logout`                                   |
| **Main Flow**       | 1. Client sends `POST /api/auth/logout` with the refresh token in the request body. 2. System verifies the refresh token. 3. System deletes the corresponding refresh token record from `refresh_tokens`. 4. System returns HTTP 200 `{ message: "Logged out successfully" }`. 5. Client removes stored access token and refresh token from local storage / cookie. |
| **Postconditions**  | Refresh token is deleted from DB; all subsequent requests with the old refresh token are rejected  |
| **Dependencies**    | FR-002                                                                                             |
| **Related APIs**    | `POST /api/auth/logout`                                                                            |
| **Related DB Tables** | `refresh_tokens`                                                                                 |
| **Related UI**      | `Navbar`, `UserMenu`                                                                               |
| **Acceptance Criteria** | 1. Logout returns HTTP 200. 2. Subsequent use of the invalidated refresh token returns HTTP 401. 3. Refresh token record is removed from database after logout. |
| **Validation Method** | Automated Integration Test                                                                      |
| **Traceability**    | Business Goal: Security; Sprint: Sprint-01                                                         |
| **Status**          | Approved                                                                                           |

---

### FR-004

| Field               | Value                                                                                              |
|---------------------|----------------------------------------------------------------------------------------------------|
| **Requirement ID**  | FR-004                                                                                             |
| **Name**            | Password Hashing with bcrypt                                                                       |
| **Priority**        | Must Have                                                                                          |
| **Description**     | The system shall hash all user passwords using bcrypt with a minimum cost factor (salt rounds) of 12 before storing them in the database. Plain-text passwords must never be persisted. |
| **Business Value**  | Protects user credentials from exposure in the event of a database breach                          |
| **Actor**           | System (internal)                                                                                  |
| **Preconditions**   | A registration or password reset request has been received with a plain-text password              |
| **Trigger**         | Registration or password reset triggers password hashing pipeline                                 |
| **Main Flow**       | 1. System receives plain-text password. 2. System calls `bcrypt.hash(password, 12)`. 3. System stores the resulting hash in the `users.password_hash` column. 4. Plain-text password is never written to a log, database, or response. |
| **Postconditions**  | Only the bcrypt hash is persisted; plain-text password is discarded from memory                    |
| **Dependencies**    | None                                                                                               |
| **Related APIs**    | `POST /api/auth/register`, `POST /api/auth/reset-password`                                        |
| **Related DB Tables** | `users`                                                                                          |
| **Related UI**      | None (internal)                                                                                    |
| **Acceptance Criteria** | 1. `users.password_hash` always begins with `$2b$12$`. 2. Logs never contain a plain-text password string. 3. bcrypt comparison (`bcrypt.compare`) returns `true` for correct password and `false` for incorrect. |
| **Validation Method** | Automated Unit Test + Inspection                                                                |
| **Traceability**    | Business Goal: Security; Sprint: Sprint-01                                                         |
| **Status**          | Approved                                                                                           |

---

### FR-005

| Field               | Value                                                                                              |
|---------------------|----------------------------------------------------------------------------------------------------|
| **Requirement ID**  | FR-005                                                                                             |
| **Name**            | JWT Token Verification Middleware                                                                  |
| **Priority**        | Must Have                                                                                          |
| **Description**     | The system shall include an Express middleware function that validates the JWT access token on every protected route. The middleware extracts the token from the `Authorization: Bearer <token>` header, verifies the signature and expiry, and attaches the decoded payload to `req.user`. |
| **Business Value**  | Ensures all protected resources are accessible only to properly authenticated users                |
| **Actor**           | System (internal middleware)                                                                       |
| **Preconditions**   | A request is made to a route decorated with the authentication middleware                          |
| **Trigger**         | Incoming HTTP request to any protected API route                                                   |
| **Main Flow**       | 1. Middleware extracts token from `Authorization` header. 2. If token is absent, return HTTP 401. 3. Middleware calls `jwt.verify(token, JWT_SECRET)`. 4. If token is expired, return HTTP 401 `{ error: "Token expired" }`. 5. If token is invalid, return HTTP 401 `{ error: "Invalid token" }`. 6. If token is valid, attach decoded payload to `req.user` and call `next()`. |
| **Postconditions**  | `req.user` contains `{ id, email, role }` for all authenticated downstream handlers               |
| **Dependencies**    | FR-002                                                                                             |
| **Related APIs**    | Applied globally to all `/api/*` routes except `/api/auth/*`                                      |
| **Related DB Tables** | None                                                                                             |
| **Related UI**      | None (server-side only)                                                                            |
| **Acceptance Criteria** | 1. Valid token allows request to proceed. 2. Expired token returns HTTP 401 with `"Token expired"`. 3. Tampered token returns HTTP 401 with `"Invalid token"`. 4. Missing `Authorization` header returns HTTP 401. |
| **Validation Method** | Automated Unit Test                                                                             |
| **Traceability**    | Business Goal: Security; Sprint: Sprint-01                                                         |
| **Status**          | Approved                                                                                           |

---

### FR-006

| Field               | Value                                                                                              |
|---------------------|----------------------------------------------------------------------------------------------------|
| **Requirement ID**  | FR-006                                                                                             |
| **Name**            | Access Token Refresh                                                                               |
| **Priority**        | Must Have                                                                                          |
| **Description**     | The system shall allow an authenticated user to obtain a new JWT access token by submitting a valid, unexpired refresh token. This extends the session without requiring re-login. |
| **Business Value**  | Improves user experience by enabling long-lived sessions without compromising short-lived token security |
| **Actor**           | Authenticated User                                                                                 |
| **Preconditions**   | User holds a valid, unexpired refresh token stored in the `refresh_tokens` table                  |
| **Trigger**         | Client detects that the access token has expired (HTTP 401 response) and submits a refresh request |
| **Main Flow**       | 1. Client sends `POST /api/auth/refresh` with `{ refreshToken }`. 2. System verifies the refresh token signature and expiry. 3. System checks the `refresh_tokens` table to confirm the token is not revoked. 4. System generates a new access token (15-min expiry). 5. System returns HTTP 200 with `{ accessToken }`. |
| **Postconditions**  | Client holds a new access token; refresh token remains valid until its own expiry                  |
| **Dependencies**    | FR-002, FR-005                                                                                     |
| **Related APIs**    | `POST /api/auth/refresh`                                                                           |
| **Related DB Tables** | `refresh_tokens`                                                                                 |
| **Related UI**      | `AuthService` (frontend Axios interceptor)                                                         |
| **Acceptance Criteria** | 1. Valid refresh token returns HTTP 200 with new access token. 2. Expired refresh token returns HTTP 401. 3. Revoked refresh token returns HTTP 401. 4. New access token has correct 15-min expiry. |
| **Validation Method** | Automated Integration Test                                                                      |
| **Traceability**    | Business Goal: User Experience; Sprint: Sprint-01                                                  |
| **Status**          | Approved                                                                                           |

---

### FR-007

| Field               | Value                                                                                              |
|---------------------|----------------------------------------------------------------------------------------------------|
| **Requirement ID**  | FR-007                                                                                             |
| **Name**            | Forgot Password — Email Token Generation                                                           |
| **Priority**        | Should Have                                                                                        |
| **Description**     | The system shall accept a registered email address, generate a secure time-limited password reset token, store its hash in the `password_reset_tokens` table, and send a reset link to the user's email. |
| **Business Value**  | Enables users to recover access to their accounts without administrator intervention               |
| **Actor**           | Guest, Authenticated User                                                                          |
| **Preconditions**   | An account exists with the submitted email address                                                 |
| **Trigger**         | User submits the "Forgot Password" form with a valid email address                                 |
| **Main Flow**       | 1. User submits `POST /api/auth/forgot-password` with `{ email }`. 2. System looks up the user by email. 3. System generates a cryptographically secure random token using `crypto.randomBytes(32)`. 4. System stores a hash of the token and expiry (30 minutes from now) in `password_reset_tokens`. 5. System sends an email with the reset link `{BASE_URL}/reset-password?token={rawToken}`. 6. System returns HTTP 200 with generic `{ message: "If this email is registered, a reset link has been sent" }` regardless of whether the email exists. |
| **Postconditions**  | Reset token hash is stored in DB; reset email is dispatched                                        |
| **Dependencies**    | FR-001, Email Service integration                                                                  |
| **Related APIs**    | `POST /api/auth/forgot-password`                                                                   |
| **Related DB Tables** | `users`, `password_reset_tokens`                                                                 |
| **Related UI**      | `ForgotPasswordPage`                                                                               |
| **Acceptance Criteria** | 1. HTTP 200 returned regardless of email existence (prevents enumeration). 2. Token hash stored in `password_reset_tokens` with correct expiry. 3. Email sent with correct reset URL. 4. Token expires after 30 minutes. |
| **Validation Method** | Automated Integration Test + Manual Verification                                                |
| **Traceability**    | Business Goal: User Self-Service; Sprint: Sprint-02                                                |
| **Status**          | Approved                                                                                           |

---

### FR-008

| Field               | Value                                                                                              |
|---------------------|----------------------------------------------------------------------------------------------------|
| **Requirement ID**  | FR-008                                                                                             |
| **Name**            | Reset Password                                                                                     |
| **Priority**        | Should Have                                                                                        |
| **Description**     | The system shall allow a user to set a new password by submitting a valid, unexpired password reset token and a new password. The new password is hashed and stored; the used token is deleted. |
| **Business Value**  | Completes the password recovery flow, restoring user account access                               |
| **Actor**           | Guest (following email link)                                                                       |
| **Preconditions**   | A valid, unexpired password reset token exists in `password_reset_tokens`                         |
| **Trigger**         | User submits the reset password form with token and new password                                  |
| **Main Flow**       | 1. User submits `POST /api/auth/reset-password` with `{ token, newPassword }`. 2. System hashes the received token and looks it up in `password_reset_tokens`. 3. System verifies the token is not expired. 4. System hashes the new password using bcrypt (cost factor >= 12). 5. System updates `users.password_hash`. 6. System deletes the token record from `password_reset_tokens`. 7. System returns HTTP 200 `{ message: "Password reset successful" }`. |
| **Postconditions**  | User password is updated; reset token is deleted; all active refresh tokens for this user are revoked |
| **Dependencies**    | FR-007, FR-004                                                                                     |
| **Related APIs**    | `POST /api/auth/reset-password`                                                                    |
| **Related DB Tables** | `users`, `password_reset_tokens`, `refresh_tokens`                                               |
| **Related UI**      | `ResetPasswordPage`                                                                                |
| **Acceptance Criteria** | 1. Valid token and new password returns HTTP 200. 2. Invalid/expired token returns HTTP 400. 3. New password must meet strength requirements (min 8 chars, 1 uppercase, 1 digit). 4. All existing refresh tokens for the user are deleted after reset. 5. Used reset token is deleted from DB. |
| **Validation Method** | Automated Integration Test                                                                      |
| **Traceability**    | Business Goal: Security; Sprint: Sprint-02                                                         |
| **Status**          | Approved                                                                                           |

---

### FR-009

| Field               | Value                                                                                              |
|---------------------|----------------------------------------------------------------------------------------------------|
| **Requirement ID**  | FR-009                                                                                             |
| **Name**            | Role-Based Access Control (RBAC)                                                                   |
| **Priority**        | Must Have                                                                                          |
| **Description**     | The system shall enforce role-based access control across all API endpoints. The platform defines three roles: `student`, `instructor`, and `admin`. Each API route shall be guarded by role-checking middleware that permits or denies access based on the authenticated user's role. |
| **Business Value**  | Ensures users can only access features appropriate to their platform role                          |
| **Actor**           | System (middleware), Administrator, Instructor, Student                                            |
| **Preconditions**   | User is authenticated (FR-005 middleware passes)                                                   |
| **Trigger**         | Authenticated request to any role-restricted API endpoint                                         |
| **Main Flow**       | 1. JWT middleware sets `req.user` with role. 2. Route-level middleware checks `req.user.role` against the allowed roles array. 3. If role is permitted, call `next()`. 4. If role is denied, return HTTP 403 `{ error: "Forbidden: Insufficient role" }`. |
| **Postconditions**  | Only authorized roles can access restricted endpoints                                              |
| **Dependencies**    | FR-005                                                                                             |
| **Related APIs**    | All API routes with role guards (e.g., `POST /api/admin/*` requires `admin` role)                 |
| **Related DB Tables** | `users` (role column)                                                                            |
| **Related UI**      | Route guards in React Router (`ProtectedRoute` component)                                         |
| **Acceptance Criteria** | 1. `admin` role can access all routes. 2. `instructor` role is blocked from `admin`-only routes and returns HTTP 403. 3. `student` role is blocked from `instructor` and `admin` routes. 4. Role check happens on every request — no caching of role bypass. |
| **Validation Method** | Automated Integration Test                                                                      |
| **Traceability**    | Business Goal: Security; Sprint: Sprint-01                                                         |
| **Status**          | Approved                                                                                           |

---

### FR-010

| Field               | Value                                                                                              |
|---------------------|----------------------------------------------------------------------------------------------------|
| **Requirement ID**  | FR-010                                                                                             |
| **Name**            | Email Format Validation                                                                            |
| **Priority**        | Must Have                                                                                          |
| **Description**     | The system shall validate email addresses at the API layer using RFC 5322-compliant regex or a validation library (e.g., `validator.js`). Malformed email addresses shall be rejected before any database operation is performed. |
| **Business Value**  | Prevents malformed data from entering the database and ensures email-based features function correctly |
| **Actor**           | System (server-side validation)                                                                    |
| **Preconditions**   | An API request containing an email field is received                                               |
| **Trigger**         | Any request body containing an `email` field                                                       |
| **Main Flow**       | 1. Validation middleware extracts `email` from request body. 2. Calls `validator.isEmail(email)`. 3. If invalid, returns HTTP 400 `{ field: "email", error: "Invalid email format" }`. 4. If valid, proceeds to next handler. |
| **Postconditions**  | Only RFC-valid email addresses are processed by the system                                         |
| **Dependencies**    | FR-015                                                                                             |
| **Related APIs**    | `POST /api/auth/register`, `POST /api/auth/forgot-password`                                       |
| **Related DB Tables** | `users`                                                                                          |
| **Related UI**      | `RegisterForm`, `ForgotPasswordPage`                                                               |
| **Acceptance Criteria** | 1. `"user@example.com"` passes validation. 2. `"notanemail"`, `"@no-domain"`, `"no@"` return HTTP 400. 3. Email with trailing/leading spaces is trimmed before validation. |
| **Validation Method** | Automated Unit Test                                                                             |
| **Traceability**    | Business Goal: Data Quality; Sprint: Sprint-01                                                     |
| **Status**          | Approved                                                                                           |

---

### FR-011

| Field               | Value                                                                                              |
|---------------------|----------------------------------------------------------------------------------------------------|
| **Requirement ID**  | FR-011                                                                                             |
| **Name**            | Password Strength Enforcement                                                                      |
| **Priority**        | Must Have                                                                                          |
| **Description**     | The system shall enforce password strength requirements at registration and password reset. Passwords must meet minimum complexity rules before being accepted. |
| **Business Value**  | Reduces the risk of account compromise via weak passwords                                          |
| **Actor**           | Guest, Authenticated User                                                                          |
| **Preconditions**   | A password field is submitted in a registration or reset request                                   |
| **Trigger**         | Receipt of a password value in any auth endpoint                                                   |
| **Main Flow**       | 1. Validation layer receives `password` string. 2. Checks: min length 8 chars, at least 1 uppercase letter, at least 1 digit. 3. If any rule fails, return HTTP 400 with specific rule violation: `{ field: "password", error: "Password must be at least 8 characters" }`. |
| **Postconditions**  | Only compliant passwords proceed to hashing and storage                                            |
| **Dependencies**    | FR-004                                                                                             |
| **Related APIs**    | `POST /api/auth/register`, `POST /api/auth/reset-password`                                        |
| **Related DB Tables** | `users`                                                                                          |
| **Related UI**      | `RegisterForm`, `ResetPasswordPage`, `PasswordStrengthIndicator`                                  |
| **Acceptance Criteria** | 1. `"Secure1"` passes. 2. `"short"` (under 8 chars) fails. 3. `"alllowercase1"` (no uppercase) fails. 4. `"NoDigitsHere"` (no digit) fails. 5. Error message clearly identifies the failing rule. |
| **Validation Method** | Automated Unit Test                                                                             |
| **Traceability**    | Business Goal: Security; Sprint: Sprint-01                                                         |
| **Status**          | Approved                                                                                           |

---

### FR-012

| Field               | Value                                                                                              |
|---------------------|----------------------------------------------------------------------------------------------------|
| **Requirement ID**  | FR-012                                                                                             |
| **Name**            | Protected Route Frontend Guard                                                                     |
| **Priority**        | Must Have                                                                                          |
| **Description**     | The React frontend shall implement a `ProtectedRoute` component that redirects unauthenticated users to `/login` when they attempt to access authenticated routes. The route guard reads the access token from the auth store and validates its presence. |
| **Business Value**  | Prevents unauthenticated users from accessing application screens that require a session            |
| **Actor**           | Guest, Unauthenticated User                                                                        |
| **Preconditions**   | User navigates to a route defined as protected in the router configuration                         |
| **Trigger**         | React Router renders a `ProtectedRoute` wrapper component                                         |
| **Main Flow**       | 1. `ProtectedRoute` reads `auth.accessToken` from the Zustand auth store. 2. If token is absent or expired, redirect to `/login?redirect=<current-path>`. 3. If token is present, render the requested `children` component. 4. After login, redirect back to the originally requested path. |
| **Postconditions**  | Authenticated users reach the requested route; unauthenticated users are redirected to login       |
| **Dependencies**    | FR-002, FR-006                                                                                     |
| **Related APIs**    | None (frontend only)                                                                               |
| **Related DB Tables** | None                                                                                             |
| **Related UI**      | `ProtectedRoute`, `AppRouter`, `LoginPage`                                                        |
| **Acceptance Criteria** | 1. Navigating to `/dashboard` without a token redirects to `/login`. 2. After login, user is redirected to `/dashboard`. 3. Authenticated user does not see the redirect; the original page renders. |
| **Validation Method** | Automated E2E Test (Playwright)                                                                 |
| **Traceability**    | Business Goal: Security; Sprint: Sprint-01                                                         |
| **Status**          | Approved                                                                                           |

---

### FR-013

| Field               | Value                                                                                              |
|---------------------|----------------------------------------------------------------------------------------------------|
| **Requirement ID**  | FR-013                                                                                             |
| **Name**            | Get Authenticated User Profile                                                                     |
| **Priority**        | Must Have                                                                                          |
| **Description**     | The system shall provide an endpoint that returns the current authenticated user's profile data based on their JWT token. This endpoint is used by the frontend on application load to restore session state. |
| **Business Value**  | Enables the frontend to display user-specific data and UI elements without repeated logins         |
| **Actor**           | Authenticated User                                                                                 |
| **Preconditions**   | User is authenticated with a valid JWT access token                                                |
| **Trigger**         | Frontend calls `GET /api/auth/me` on application initialization                                   |
| **Main Flow**       | 1. Authenticated request reaches `GET /api/auth/me`. 2. Middleware sets `req.user` from token. 3. System queries `users` table by `req.user.id`. 4. Returns HTTP 200 with `{ id, username, email, role, avatar, bio, createdAt }`. |
| **Postconditions**  | Frontend holds current user data in auth store                                                     |
| **Dependencies**    | FR-005                                                                                             |
| **Related APIs**    | `GET /api/auth/me`                                                                                 |
| **Related DB Tables** | `users`                                                                                          |
| **Related UI**      | `AuthStore`, `Navbar`, `UserAvatar`                                                               |
| **Acceptance Criteria** | 1. Returns HTTP 200 with non-sensitive user fields. 2. `password_hash` is never included in the response. 3. Invalid token returns HTTP 401. |
| **Validation Method** | Automated Integration Test                                                                      |
| **Traceability**    | Business Goal: User Experience; Sprint: Sprint-01                                                  |
| **Status**          | Approved                                                                                           |

---

### FR-014

| Field               | Value                                                                                              |
|---------------------|----------------------------------------------------------------------------------------------------|
| **Requirement ID**  | FR-014                                                                                             |
| **Name**            | Rate Limiting on Authentication Endpoints                                                          |
| **Priority**        | Must Have                                                                                          |
| **Description**     | The system shall apply rate limiting to all authentication endpoints to mitigate brute-force attacks. The `POST /api/auth/login` endpoint shall be limited to 10 requests per IP address per 15-minute window. |
| **Business Value**  | Protects user accounts from automated credential-stuffing and brute-force attacks                  |
| **Actor**           | System (security middleware)                                                                       |
| **Preconditions**   | Any client makes repeated requests to auth endpoints                                               |
| **Trigger**         | Client exceeds the defined request threshold within the rate limit window                          |
| **Main Flow**       | 1. `express-rate-limit` middleware is applied to `/api/auth/*` routes. 2. Middleware tracks request count per IP using in-memory store (or Redis in production). 3. If count exceeds 10 within 15 minutes, return HTTP 429 `{ error: "Too many requests. Try again in 15 minutes." }`. 4. Response includes `Retry-After` header with seconds remaining. |
| **Postconditions**  | Requests beyond the threshold are blocked until the window resets                                  |
| **Dependencies**    | None                                                                                               |
| **Related APIs**    | `POST /api/auth/login`, `POST /api/auth/register`, `POST /api/auth/forgot-password`               |
| **Related DB Tables** | None                                                                                             |
| **Related UI**      | None (server-side)                                                                                 |
| **Acceptance Criteria** | 1. 11th request within 15 minutes from the same IP returns HTTP 429. 2. Response includes `Retry-After` header. 3. After window resets, requests are accepted again. 4. Rate limit applies per IP, not per account. |
| **Validation Method** | Automated Integration Test                                                                      |
| **Traceability**    | Business Goal: Security; Sprint: Sprint-01                                                         |
| **Status**          | Approved                                                                                           |

---

### FR-015

| Field               | Value                                                                                              |
|---------------------|----------------------------------------------------------------------------------------------------|
| **Requirement ID**  | FR-015                                                                                             |
| **Name**            | Global Input Validation Middleware                                                                 |
| **Priority**        | Must Have                                                                                          |
| **Description**     | The system shall apply schema-based input validation on all incoming API request bodies using a validation library (e.g., Zod or Joi). Any request that fails validation is rejected with a structured error response before reaching business logic. |
| **Business Value**  | Prevents malformed, malicious, or unexpected data from corrupting business logic or the database   |
| **Actor**           | System (validation middleware)                                                                     |
| **Preconditions**   | An HTTP request with a body reaches the Express API                                                |
| **Trigger**         | Any POST, PUT, or PATCH request to the API                                                         |
| **Main Flow**       | 1. Validation middleware intercepts the request. 2. Validates request body against the route's defined Zod/Joi schema. 3. If valid, calls `next()`. 4. If invalid, returns HTTP 400 with `{ errors: [{ field, message }] }`. |
| **Postconditions**  | Only schema-compliant data reaches business logic handlers                                         |
| **Dependencies**    | None                                                                                               |
| **Related APIs**    | All POST, PUT, PATCH routes                                                                        |
| **Related DB Tables** | None                                                                                             |
| **Related UI**      | None (server-side)                                                                                 |
| **Acceptance Criteria** | 1. Missing required fields return HTTP 400 with specific field names. 2. Incorrect field types return HTTP 400. 3. Extraneous fields are stripped (not rejected) by default. 4. Error response format is consistent across all endpoints. |
| **Validation Method** | Automated Unit Test                                                                             |
| **Traceability**    | Business Goal: Data Integrity; Sprint: Sprint-01                                                   |
| **Status**          | Approved                                                                                           |

---

### FR-016

| Field               | Value                                                                                              |
|---------------------|----------------------------------------------------------------------------------------------------|
| **Requirement ID**  | FR-016                                                                                             |
| **Name**            | Username Uniqueness Enforcement                                                                    |
| **Priority**        | Must Have                                                                                          |
| **Description**     | The system shall enforce uniqueness of usernames at the database and application layer. Attempts to register with an already-claimed username shall return an error without creating a new user record. |
| **Business Value**  | Ensures every user has a unique identifier for profile pages, mentions, and collaboration features |
| **Actor**           | Guest                                                                                              |
| **Preconditions**   | Registration endpoint is called                                                                    |
| **Trigger**         | `POST /api/auth/register` with a `username` that already exists in the `users` table              |
| **Main Flow**       | 1. System receives registration payload. 2. System queries `users` table for `username` match (case-insensitive). 3. If match found, return HTTP 409 `{ field: "username", error: "Username is already taken" }`. 4. If no match, proceed with registration. |
| **Postconditions**  | No duplicate usernames exist in the `users` table                                                  |
| **Dependencies**    | FR-001                                                                                             |
| **Related APIs**    | `POST /api/auth/register`                                                                          |
| **Related DB Tables** | `users` (unique constraint on `username`)                                                        |
| **Related UI**      | `RegisterForm`                                                                                     |
| **Acceptance Criteria** | 1. Registering with `"john"` when `"john"` exists returns HTTP 409. 2. `"John"` and `"john"` are treated as the same username. 3. Database has a `UNIQUE` constraint on the `username` column. |
| **Validation Method** | Automated Integration Test                                                                      |
| **Traceability**    | Business Goal: Data Integrity; Sprint: Sprint-01                                                   |
| **Status**          | Approved                                                                                           |

---

### FR-017

| Field               | Value                                                                                              |
|---------------------|----------------------------------------------------------------------------------------------------|
| **Requirement ID**  | FR-017                                                                                             |
| **Name**            | Session Persistence via Refresh Token Rotation                                                     |
| **Priority**        | Should Have                                                                                        |
| **Description**     | The system shall implement refresh token rotation. Each time a new access token is issued using a refresh token, the old refresh token is revoked and a new refresh token is issued. This limits the window of opportunity for token theft. |
| **Business Value**  | Significantly reduces the risk window if a refresh token is intercepted by an attacker             |
| **Actor**           | Authenticated User                                                                                 |
| **Preconditions**   | User has a valid refresh token                                                                     |
| **Trigger**         | `POST /api/auth/refresh` is called with a valid refresh token                                     |
| **Main Flow**       | 1. System verifies the refresh token. 2. System deletes the used refresh token from `refresh_tokens`. 3. System generates a new refresh token. 4. System stores the new refresh token hash in `refresh_tokens`. 5. System returns `{ accessToken, refreshToken }` with both new tokens. |
| **Postconditions**  | Old refresh token is invalidated; new refresh token is issued                                      |
| **Dependencies**    | FR-006                                                                                             |
| **Related APIs**    | `POST /api/auth/refresh`                                                                           |
| **Related DB Tables** | `refresh_tokens`                                                                                 |
| **Related UI**      | `AuthService` (Axios interceptor)                                                                  |
| **Acceptance Criteria** | 1. After token refresh, the old refresh token is rejected with HTTP 401. 2. New refresh token is returned in the response. 3. Reuse of an already-rotated refresh token invalidates all tokens for that user (session fixation protection). |
| **Validation Method** | Automated Integration Test                                                                      |
| **Traceability**    | Business Goal: Security; Sprint: Sprint-02                                                         |
| **Status**          | Approved                                                                                           |

---

### FR-018

| Field               | Value                                                                                              |
|---------------------|----------------------------------------------------------------------------------------------------|
| **Requirement ID**  | FR-018                                                                                             |
| **Name**            | CORS Policy Enforcement                                                                            |
| **Priority**        | Must Have                                                                                          |
| **Description**     | The system shall configure CORS headers on the Express API to allow cross-origin requests only from whitelisted frontend origins. In production, only the deployed frontend URL is whitelisted. |
| **Business Value**  | Prevents unauthorized third-party websites from making authenticated requests to the API on behalf of users |
| **Actor**           | System                                                                                             |
| **Preconditions**   | Express server is running with CORS middleware configured                                          |
| **Trigger**         | Any HTTP request to the API with an `Origin` header                                               |
| **Main Flow**       | 1. CORS middleware reads `ALLOWED_ORIGINS` from environment. 2. Checks `Origin` header against whitelist. 3. If allowed, sets `Access-Control-Allow-Origin: <origin>`. 4. If not allowed, returns HTTP 403 or drops the CORS headers. |
| **Postconditions**  | Only whitelisted origins can make browser-based cross-origin requests                              |
| **Dependencies**    | None                                                                                               |
| **Related APIs**    | All routes                                                                                         |
| **Related DB Tables** | None                                                                                             |
| **Related UI**      | None                                                                                               |
| **Acceptance Criteria** | 1. Requests from `http://localhost:5173` are allowed in development. 2. Requests from the production frontend domain are allowed in production. 3. Requests from unknown origins receive no `Access-Control-Allow-Origin` header. |
| **Validation Method** | Automated Integration Test + Inspection                                                         |
| **Traceability**    | Business Goal: Security; Sprint: Sprint-01                                                         |
| **Status**          | Approved                                                                                           |

---

### FR-019

| Field               | Value                                                                                              |
|---------------------|----------------------------------------------------------------------------------------------------|
| **Requirement ID**  | FR-019                                                                                             |
| **Name**            | Auth Error Standardization                                                                         |
| **Priority**        | Must Have                                                                                          |
| **Description**     | The system shall return standardized, non-verbose error messages for all authentication failures. Error responses must not reveal whether a user account exists, what database queries were made, or any internal implementation details. |
| **Business Value**  | Prevents user enumeration attacks and information leakage via error responses                      |
| **Actor**           | System (error handler)                                                                             |
| **Preconditions**   | An authentication request fails at any stage                                                       |
| **Trigger**         | Any failed auth endpoint invocation                                                                |
| **Main Flow**       | 1. Auth handler catches an error. 2. Error handler maps the error type to a safe, generic message. 3. Response returns HTTP 401 with `{ error: "Invalid credentials" }` for login failures. 4. Internal errors return HTTP 500 with `{ error: "An internal error occurred" }` — no stack traces in production. |
| **Postconditions**  | No sensitive information is revealed in error responses                                            |
| **Dependencies**    | FR-002                                                                                             |
| **Related APIs**    | All `/api/auth/*` routes                                                                           |
| **Related DB Tables** | None                                                                                             |
| **Related UI**      | `LoginForm` (displays generic error)                                                              |
| **Acceptance Criteria** | 1. Invalid credentials return `"Invalid credentials"` — not `"User not found"` or `"Wrong password"`. 2. Stack traces never appear in production responses. 3. HTTP 500 responses use a generic message. |
| **Validation Method** | Automated Test + Inspection                                                                     |
| **Traceability**    | Business Goal: Security; Sprint: Sprint-01                                                         |
| **Status**          | Approved                                                                                           |

---

### FR-020

| Field               | Value                                                                                              |
|---------------------|----------------------------------------------------------------------------------------------------|
| **Requirement ID**  | FR-020                                                                                             |
| **Name**            | Admin Promotion of User Role                                                                       |
| **Priority**        | Should Have                                                                                        |
| **Description**     | The system shall allow an administrator to promote or demote a user's role via an API endpoint. Role changes take effect on the user's next token refresh. |
| **Business Value**  | Enables dynamic permission management without requiring database-level access                      |
| **Actor**           | Administrator                                                                                      |
| **Preconditions**   | Administrator is authenticated; target user account exists                                         |
| **Trigger**         | Admin submits `PUT /api/admin/users/:userId/role`                                                  |
| **Main Flow**       | 1. Admin sends `{ role: "instructor" }` to the endpoint. 2. RBAC middleware confirms requester has `admin` role. 3. System updates `users.role` for the target user. 4. Returns HTTP 200 `{ id, username, role }`. |
| **Postconditions**  | Target user's role is updated; role is reflected on next login or token refresh                    |
| **Dependencies**    | FR-009                                                                                             |
| **Related APIs**    | `PUT /api/admin/users/:userId/role`                                                                |
| **Related DB Tables** | `users`                                                                                          |
| **Related UI**      | `AdminUserTable`, `RoleSelectDropdown`                                                            |
| **Acceptance Criteria** | 1. Admin can change `student` to `instructor`. 2. Non-admin users receive HTTP 403. 3. Invalid role values return HTTP 400. 4. Role change is persisted in database. |
| **Validation Method** | Automated Integration Test                                                                      |
| **Traceability**    | Business Goal: Platform Administration; Sprint: Sprint-03                                          |
| **Status**          | Approved                                                                                           |

---

---

# Chapter 4: Dashboard Requirements

## Overview

The Dashboard is the primary landing surface for authenticated users. It provides an aggregated view of project health, deployment status, recent activity, task progress, monitoring metrics, and quick-action shortcuts. The dashboard is the single pane of glass for the DeployFix Lab platform.

---

### FR-021

| Field               | Value                                                                                              |
|---------------------|----------------------------------------------------------------------------------------------------|
| **Requirement ID**  | FR-021                                                                                             |
| **Name**            | Dashboard Statistics Cards                                                                         |
| **Priority**        | Must Have                                                                                          |
| **Description**     | The dashboard shall display four top-level statistics cards: Total Tasks, Open Tasks, Deployments This Week, and Active Incidents. Each card shows the current count and a percentage delta compared to the previous week. |
| **Business Value**  | Gives users an immediate high-level view of project health and workload at a glance               |
| **Actor**           | Authenticated User, Developer, Student                                                             |
| **Preconditions**   | User is authenticated and navigates to `/dashboard`                                               |
| **Trigger**         | Page load of the Dashboard route                                                                   |
| **Main Flow**       | 1. Frontend calls `GET /api/dashboard/stats`. 2. Backend aggregates counts from `tasks`, `deployments`, and `incidents` tables. 3. Backend calculates 7-day delta. 4. Returns `{ totalTasks, openTasks, deploymentsThisWeek, activeIncidents, deltas: {...} }`. 5. Frontend renders four `StatCard` components. |
| **Postconditions**  | Statistics cards display current data fetched from the database                                    |
| **Dependencies**    | FR-005                                                                                             |
| **Related APIs**    | `GET /api/dashboard/stats`                                                                         |
| **Related DB Tables** | `tasks`, `deployments`, `incidents`                                                              |
| **Related UI**      | `DashboardPage`, `StatCard`                                                                        |
| **Acceptance Criteria** | 1. All four stat cards render with non-null values. 2. Delta percentage is positive (green) if count increased. 3. Data refreshes every 60 seconds without full page reload. 4. Loading skeleton is displayed while data is fetching. |
| **Validation Method** | Automated E2E Test                                                                              |
| **Traceability**    | Business Goal: Observability; Sprint: Sprint-02                                                    |
| **Status**          | Approved                                                                                           |

---

### FR-022

| Field               | Value                                                                                              |
|---------------------|----------------------------------------------------------------------------------------------------|
| **Requirement ID**  | FR-022                                                                                             |
| **Name**            | Recent Activity Feed                                                                               |
| **Priority**        | Must Have                                                                                          |
| **Description**     | The dashboard shall display a chronological activity feed showing the 10 most recent system events, including task updates, deployments, and incident status changes, with timestamp and actor. |
| **Business Value**  | Keeps users informed of recent changes without requiring navigation to individual modules           |
| **Actor**           | Authenticated User                                                                                 |
| **Preconditions**   | Activity events exist in the `activity_log` table                                                 |
| **Trigger**         | Dashboard page load                                                                                |
| **Main Flow**       | 1. Frontend calls `GET /api/dashboard/activity`. 2. Backend queries `activity_log` ordered by `created_at DESC LIMIT 10`. 3. Each entry contains `{ event_type, description, actor_username, created_at }`. 4. Frontend renders `ActivityFeed` component. |
| **Postconditions**  | Recent 10 activity entries are displayed in the feed                                               |
| **Dependencies**    | FR-021, FR-005                                                                                     |
| **Related APIs**    | `GET /api/dashboard/activity`                                                                      |
| **Related DB Tables** | `activity_log`                                                                                   |
| **Related UI**      | `ActivityFeed`, `ActivityItem`                                                                     |
| **Acceptance Criteria** | 1. Feed shows exactly 10 most recent events. 2. Events are ordered newest-first. 3. Each event shows event type, description, actor username, and human-readable timestamp. 4. Feed refreshes every 30 seconds. |
| **Validation Method** | Automated Integration Test + E2E Test                                                           |
| **Traceability**    | Business Goal: Situational Awareness; Sprint: Sprint-02                                            |
| **Status**          | Approved                                                                                           |

---

### FR-023 — FR-040

> The following dashboard requirements follow the same template as FR-021 and FR-022. Implementation teams must apply the full FR template for each item during sprint planning.

| ID     | Name                                  | Priority     | Description Summary                                                                                    |
|--------|---------------------------------------|--------------|--------------------------------------------------------------------------------------------------------|
| FR-023 | System Health Status Panel            | Must Have    | Panel showing operational status of API Server, Database, Frontend, and Docker Containers using colored badges (Healthy / Degraded / Down) |
| FR-024 | Deployment Summary Widget             | Must Have    | Widget showing the last 5 deployments with status (success/failure/in-progress), environment, and timestamp |
| FR-025 | Task Progress Chart                   | Must Have    | Donut chart displaying task distribution by status (Todo, In Progress, In Review, Completed, Blocked) using Recharts with interactive tooltips |
| FR-026 | Notification Center                   | Should Have  | Notification bell in navbar showing unread notification count; panel lists notifications with mark-as-read and mark-all-as-read actions |
| FR-027 | Quick Actions Panel                   | Should Have  | Section with shortcut buttons: Create Task, View Deployments, Open Documentation, Create Incident Report |
| FR-028 | Deployment Success Rate Chart         | Should Have  | Bar chart showing deployment success vs failure counts per day over the past 30 days using stacked Recharts bars |
| FR-029 | Dashboard Date Range Filter           | Could Have   | Dropdown filter (Last 7 days / 30 days / 90 days / Custom) that filters all dashboard charts and stats |
| FR-030 | Responsive Dashboard Layout           | Must Have    | Four-column grid at >=1280px; two-column at 768–1279px; single-column below 768px; no horizontal scroll at 375px |
| FR-031 | Incident Summary Panel                | Must Have    | Panel showing count and severity distribution (P1/P2/P3) of active incidents with links to incident detail |
| FR-032 | Documentation Coverage Widget         | Should Have  | Percentage gauge showing features with linked documentation entries vs total features |
| FR-033 | Sprint Progress Bar                   | Should Have  | Horizontal progress bar showing current sprint task completion percentage with sprint name and end date |
| FR-034 | Container Status Grid                 | Should Have  | Visual grid showing running/stopped/unhealthy status of each Docker container service by name |
| FR-035 | Error Rate Trend Line Chart           | Could Have   | Line chart tracking application HTTP 5xx error rate per minute over the past 24 hours |
| FR-036 | Average API Response Time Widget      | Should Have  | Widget showing P95 API response time over the past hour, updated every 60 seconds, with degradation threshold indicator |
| FR-037 | User Session Count Widget             | Could Have   | Widget showing number of unique active user sessions in the past 24 hours |
| FR-038 | Database Connection Pool Status       | Should Have  | Shows current DB connection pool usage as a used/max ratio with a warning indicator at 80% capacity |
| FR-039 | Dashboard Widget Reorder              | Could Have   | Drag-and-drop interface to reorder dashboard widgets; order persisted in `user_settings` |
| FR-040 | Dashboard Data Auto-Refresh           | Must Have    | All dashboard data auto-refreshes every 60 seconds using polling; a refresh icon shows the last updated timestamp |

---

---

# Chapter 5: Task Management Requirements

## Overview

The Task Management module provides complete CRUD operations, filtering, search, priority management, assignment, deadlines, status tracking, bulk actions, and pagination for project tasks within DeployFix Lab.

---

### FR-041

| Field               | Value                                                                                              |
|---------------------|----------------------------------------------------------------------------------------------------|
| **Requirement ID**  | FR-041                                                                                             |
| **Name**            | Create Task                                                                                        |
| **Priority**        | Must Have                                                                                          |
| **Description**     | The system shall allow an authenticated user to create a new task by providing a title, description, priority, status, assigned user, and due date. |
| **Business Value**  | Core work item creation capability for project tracking                                            |
| **Actor**           | Developer, Student, Instructor                                                                     |
| **Preconditions**   | User is authenticated                                                                              |
| **Trigger**         | User submits the Create Task form or calls `POST /api/tasks`                                      |
| **Main Flow**       | 1. User fills title (required), description, priority (`low/medium/high/critical`), status (default `todo`), assignee ID, and due date. 2. System validates required fields. 3. System creates a record in `tasks` table. 4. System creates an entry in `activity_log`. 5. Returns HTTP 201 with the created task. |
| **Postconditions**  | Task record exists in DB; activity log updated; assignee notified (if specified)                  |
| **Dependencies**    | FR-005, FR-015                                                                                     |
| **Related APIs**    | `POST /api/tasks`                                                                                  |
| **Related DB Tables** | `tasks`, `activity_log`, `notifications`                                                         |
| **Related UI**      | `CreateTaskModal`, `TaskForm`                                                                      |
| **Acceptance Criteria** | 1. HTTP 201 on success with task ID. 2. Missing title returns HTTP 400. 3. Invalid priority value returns HTTP 400. 4. Due date in the past is accepted but a UI warning is shown. 5. Task appears in task list immediately. |
| **Validation Method** | Automated Integration Test                                                                      |
| **Traceability**    | Business Goal: Project Management; Sprint: Sprint-02                                               |
| **Status**          | Approved                                                                                           |

---

### FR-042

| Field               | Value                                                                                              |
|---------------------|----------------------------------------------------------------------------------------------------|
| **Requirement ID**  | FR-042                                                                                             |
| **Name**            | Read / List Tasks with Pagination                                                                  |
| **Priority**        | Must Have                                                                                          |
| **Description**     | The system shall return a paginated list of tasks. The default page size is 20. The endpoint accepts `page`, `limit`, `status`, `priority`, `assigneeId`, and `q` (search) query parameters. |
| **Business Value**  | Enables users to browse tasks efficiently without loading all records at once                      |
| **Actor**           | Authenticated User                                                                                 |
| **Preconditions**   | User is authenticated                                                                              |
| **Trigger**         | User navigates to Task List page or calls `GET /api/tasks`                                        |
| **Main Flow**       | 1. `GET /api/tasks?page=1&limit=20&status=todo&priority=high`. 2. Backend applies filters and paginates results. 3. Returns `{ tasks: [...], total, page, totalPages }`. 4. Frontend renders `TaskList` with pagination controls. |
| **Postconditions**  | Task list is rendered with pagination metadata                                                     |
| **Dependencies**    | FR-041                                                                                             |
| **Related APIs**    | `GET /api/tasks`                                                                                   |
| **Related DB Tables** | `tasks`                                                                                          |
| **Related UI**      | `TaskList`, `PaginationControls`                                                                   |
| **Acceptance Criteria** | 1. Default page size is 20. 2. `total` matches actual count of matching tasks. 3. `page` and `totalPages` are returned. 4. Empty result returns `{ tasks: [], total: 0, page: 1, totalPages: 0 }`. |
| **Validation Method** | Automated Integration Test                                                                      |
| **Traceability**    | Business Goal: Project Management; Sprint: Sprint-02                                               |
| **Status**          | Approved                                                                                           |

---

### FR-043

| Field               | Value                                                                                              |
|---------------------|----------------------------------------------------------------------------------------------------|
| **Requirement ID**  | FR-043                                                                                             |
| **Name**            | Update Task                                                                                        |
| **Priority**        | Must Have                                                                                          |
| **Description**     | The system shall allow an authenticated user to update any field of an existing task via a PATCH request. Only the task creator or an assigned user may update the task; admins may update any task. |
| **Business Value**  | Enables collaborative task management by allowing in-place updates                                |
| **Actor**           | Developer, Instructor, Administrator                                                               |
| **Preconditions**   | Task exists; user is the creator, assignee, or admin                                              |
| **Trigger**         | User edits and saves a task or calls `PATCH /api/tasks/:id`                                       |
| **Main Flow**       | 1. User submits partial update payload. 2. System checks ownership/role. 3. System applies partial update to the task record. 4. System writes an activity log entry with `before` and `after` state diff. 5. Returns HTTP 200 with the updated task. |
| **Postconditions**  | Task record is updated; change is logged                                                           |
| **Dependencies**    | FR-041, FR-009                                                                                     |
| **Related APIs**    | `PATCH /api/tasks/:id`                                                                             |
| **Related DB Tables** | `tasks`, `activity_log`                                                                          |
| **Related UI**      | `EditTaskModal`, `TaskDetailPage`                                                                  |
| **Acceptance Criteria** | 1. Returns HTTP 200 with updated task. 2. Non-owner, non-admin returns HTTP 403. 3. Non-existent task returns HTTP 404. 4. Activity log records change with before/after values. |
| **Validation Method** | Automated Integration Test                                                                      |
| **Traceability**    | Business Goal: Project Management; Sprint: Sprint-02                                               |
| **Status**          | Approved                                                                                           |

---

### FR-044

| Field               | Value                                                                                              |
|---------------------|----------------------------------------------------------------------------------------------------|
| **Requirement ID**  | FR-044                                                                                             |
| **Name**            | Delete Task (Soft Delete)                                                                          |
| **Priority**        | Must Have                                                                                          |
| **Description**     | The system shall allow a task creator or administrator to delete a task. Deleted tasks are soft-deleted (set `deleted_at` timestamp) to preserve audit history. They are excluded from all list queries. |
| **Business Value**  | Provides cleanup capability while preserving audit trail for historical analysis                   |
| **Actor**           | Developer, Administrator                                                                           |
| **Preconditions**   | Task exists; user is the creator or admin                                                         |
| **Trigger**         | User confirms deletion in the task detail view or calls `DELETE /api/tasks/:id`                   |
| **Main Flow**       | 1. User initiates delete with a confirmation dialog. 2. `DELETE /api/tasks/:id` is called. 3. System sets `tasks.deleted_at = NOW()`. 4. Task is excluded from all list queries. 5. Returns HTTP 200 `{ message: "Task deleted" }`. |
| **Postconditions**  | Task is soft-deleted; no longer visible in lists; audit log preserved                              |
| **Dependencies**    | FR-041, FR-009                                                                                     |
| **Related APIs**    | `DELETE /api/tasks/:id`                                                                            |
| **Related DB Tables** | `tasks`                                                                                          |
| **Related UI**      | `TaskDetailPage`, `ConfirmDeleteModal`                                                            |
| **Acceptance Criteria** | 1. HTTP 200 on successful delete. 2. HTTP 403 for non-owner/non-admin. 3. Deleted task no longer appears in list queries. 4. `tasks.deleted_at` is populated. 5. Confirmation dialog is shown before delete. |
| **Validation Method** | Automated Integration Test                                                                      |
| **Traceability**    | Business Goal: Data Management; Sprint: Sprint-02                                                  |
| **Status**          | Approved                                                                                           |

---

### FR-045 — FR-060

| ID     | Name                                | Priority     | Description Summary                                                                                                 |
|--------|-------------------------------------|--------------|---------------------------------------------------------------------------------------------------------------------|
| FR-045 | Task Search by Keyword              | Must Have    | Full-text search on `title` and `description` via `?q=` query param; case-insensitive; debounced 300ms in the UI   |
| FR-046 | Task Status Filtering               | Must Have    | Filter task list by one or more statuses: `todo`, `in_progress`, `in_review`, `completed`, `blocked`              |
| FR-047 | Task Priority Filtering             | Must Have    | Filter task list by priority: `low`, `medium`, `high`, `critical`; combinable with other filters                   |
| FR-048 | Task Sorting                        | Must Have    | Sort task list by `created_at`, `due_date`, `priority`, or `title` in ascending/descending order via `?sort=&order=` |
| FR-049 | Task Assignment                     | Must Have    | Assign a task to one specific user; assignee receives a notification upon assignment; assignee visible on task card |
| FR-050 | Task Due Date Management            | Must Have    | Tasks support a `due_date` field; overdue tasks (past due and not completed) are highlighted in red in the task list |
| FR-051 | Task Priority Management            | Must Have    | Priority can be set to `low`, `medium`, `high`, or `critical`; each priority level has a distinct color-coded label |
| FR-052 | Task Status Transitions             | Must Have    | Status transitions: `todo -> in_progress -> in_review -> completed`; `blocked` is an additional state reachable from any stage |
| FR-053 | Bulk Task Status Update             | Should Have  | User selects multiple tasks via checkboxes and updates their status in a single atomic action                       |
| FR-054 | Bulk Task Delete                    | Should Have  | User selects multiple tasks via checkboxes and soft-deletes them with a single confirmation action                  |
| FR-055 | Task Detail View                    | Must Have    | Clicking a task opens a detail page or slide-over panel with all task fields, activity history, and comments        |
| FR-056 | Task Comments                       | Should Have  | Users can add text comments to a task; comments are displayed chronologically with author avatar and timestamp      |
| FR-057 | Task Attachment Link                | Could Have   | Users can attach a URL (e.g., GitHub PR link) to a task; link is displayed in the task detail panel                |
| FR-058 | Task Labels / Tags                  | Could Have   | Tasks can have one or more string labels (e.g., "docker", "backend"); labels are filterable in the task list       |
| FR-059 | Task Import from CSV                | Future       | Admin can upload a CSV file to bulk-import tasks into the system                                                   |
| FR-060 | Task Export to CSV                  | Could Have   | Authenticated users can export the current filtered task list to a CSV file via `GET /api/tasks/export?format=csv` |

---

---

# Chapter 6: User Management Requirements

## Overview

User management covers profile retrieval, updates, avatar management, role administration, account security, permission controls, settings, and activity history.

---

### FR-061 — FR-075

| ID     | Name                                | Priority     | Description Summary                                                                                                                                           |
|--------|-------------------------------------|--------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------|
| FR-061 | View User Profile                   | Must Have    | Users can view their own profile via `GET /api/users/me` returning `{ id, username, email, bio, avatar, role, createdAt }`                                   |
| FR-062 | Update User Profile                 | Must Have    | Users can update `bio`, `username`, or `email` via `PUT /api/users/me`; uniqueness and format validation enforced                                             |
| FR-063 | Upload User Avatar                  | Should Have  | Users upload a profile avatar image (JPG/PNG, max 2MB) via multipart form; stored in `uploads/avatars/` and URL saved in `users.avatar_url`                  |
| FR-064 | Change Password (Authenticated)     | Must Have    | Authenticated users change their password by providing `currentPassword` and `newPassword`; current password verified before update                           |
| FR-065 | View All Users (Admin)              | Must Have    | Administrators retrieve a paginated list of all users with filtering by role and keyword search via `GET /api/admin/users`                                    |
| FR-066 | View Single User (Admin)            | Should Have  | Administrators retrieve full profile details of any user by ID via `GET /api/admin/users/:id`                                                                |
| FR-067 | Suspend User Account (Admin)        | Should Have  | Administrators can suspend a user account; suspended users receive HTTP 403 `"Account suspended"` on all authenticated requests                               |
| FR-068 | Delete User Account (Admin)         | Could Have   | Administrators can soft-delete a user account; associated data is anonymized to preserve audit integrity                                                      |
| FR-069 | User Role Assignment (Admin)        | Must Have    | Admins assign `student`, `instructor`, or `admin` role to any user via `PUT /api/admin/users/:id/role` (see FR-020)                                          |
| FR-070 | User Activity History               | Should Have  | Each user's profile shows their last 50 actions (task creates/updates, logins, deployments) from `activity_log` in reverse chronological order               |
| FR-071 | User Settings Page                  | Should Have  | A settings page allows users to manage notification preferences (email on task assignment, deployment alerts) stored in `user_settings` table                |
| FR-072 | Email Change Verification           | Could Have   | When a user changes their email, a confirmation link is sent to the new email; change does not take effect until confirmed via the link                       |
| FR-073 | Public User Profile by Username     | Could Have   | Public profile pages at `/users/:username` show bio, avatar, role badge, and recent activity (non-sensitive fields only)                                     |
| FR-074 | Account Deletion (Self-Service)     | Future       | Users can request deletion of their own account; data is anonymized and a confirmation email is sent before processing                                        |
| FR-075 | Two-Factor Authentication (2FA)     | Future       | Users can enable TOTP-based 2FA via authenticator app; enforced for `admin` role accounts on system configuration                                            |

---

---

# Chapter 7: Docker Requirements

## Overview

Docker requirements govern containerization strategy including Dockerfile authoring, Docker Compose orchestration, volume management, networking, health checks, environment variable handling, and image optimization.

---

### FR-076

| Field               | Value                                                                                              |
|---------------------|----------------------------------------------------------------------------------------------------|
| **Requirement ID**  | FR-076                                                                                             |
| **Name**            | Production-Optimized Backend Dockerfile                                                            |
| **Priority**        | Must Have                                                                                          |
| **Description**     | The backend Express application shall have a multi-stage Dockerfile. Stage 1 (`builder`) installs all dependencies and compiles TypeScript. Stage 2 (`runner`) copies only production artifacts and `node_modules` to minimize the final image size. |
| **Business Value**  | Reduces image size, improves deployment speed, and reduces the attack surface in production         |
| **Actor**           | DevOps Engineer                                                                                    |
| **Preconditions**   | Backend source code exists with a valid `package.json` and TypeScript configuration                |
| **Trigger**         | `docker build -t deployfix-api .` executed from the backend directory                            |
| **Main Flow**       | 1. Stage 1: `FROM node:20-alpine AS builder`, install deps, run `npm run build`. 2. Stage 2: `FROM node:20-alpine AS runner`, copy only `dist/` and production `node_modules`. 3. `CMD ["node", "dist/index.js"]`. |
| **Postconditions**  | Built image is less than 300MB; no devDependencies in the final image                             |
| **Dependencies**    | None                                                                                               |
| **Related APIs**    | None                                                                                               |
| **Related DB Tables** | None                                                                                             |
| **Related UI**      | None                                                                                               |
| **Acceptance Criteria** | 1. Final image size is 300MB or less. 2. `devDependencies` are not in the final image layers. 3. `docker build` completes without error. 4. Container starts and responds to `GET /api/health`. |
| **Validation Method** | Manual Test + Inspection                                                                        |
| **Traceability**    | Business Goal: Infrastructure Optimization; Sprint: Sprint-03                                      |
| **Status**          | Approved                                                                                           |

---

### FR-077 — FR-090

| ID     | Name                                      | Priority     | Description Summary                                                                                                                                    |
|--------|-------------------------------------------|--------------|--------------------------------------------------------------------------------------------------------------------------------------------------------|
| FR-077 | Frontend Dockerfile (Nginx-Served)        | Must Have    | Multi-stage Dockerfile: Stage 1 builds Vite production bundle; Stage 2 serves `dist/` via Nginx Alpine with `try_files $uri /index.html` for SPA routing |
| FR-078 | Docker Compose Service Orchestration      | Must Have    | `docker-compose.yml` defines services: `api`, `frontend`, `db` (PostgreSQL 16 Alpine), `pgadmin`; all connected via `deployfix-net` bridge network    |
| FR-079 | PostgreSQL Container Configuration        | Must Have    | Uses official `postgres:16-alpine` image with persistent volume at `/var/lib/postgresql/data`; credentials injected via environment variables           |
| FR-080 | Docker Named Volumes                      | Must Have    | Named volumes defined: `postgres_data` for DB persistence and `uploads_data` for user upload persistence; prevents data loss on container restart      |
| FR-081 | Service Dependency Order                  | Must Have    | `depends_on` with `condition: service_healthy` ensures `db` is healthy before `api` starts, preventing startup race conditions                         |
| FR-082 | Docker Health Checks                      | Must Have    | Each service defines a `HEALTHCHECK`. API: `curl -f http://localhost:3000/api/health`. DB: `pg_isready -U postgres`. Frontend: `curl -f http://localhost:80` |
| FR-083 | Container Restart Policy                  | Must Have    | All services define `restart: unless-stopped` to enable automatic recovery after unexpected container crashes                                           |
| FR-084 | Environment Variable Injection via .env   | Must Have    | Sensitive config (DB credentials, JWT_SECRET, API keys) provided via `.env` file referenced via `env_file: ./.env`; `.env` is gitignored              |
| FR-085 | Docker Network Isolation                  | Must Have    | All services run within `deployfix-net` bridge network. `frontend` is the only service exposing a public port (80); `api` and `db` are internal only   |
| FR-086 | .dockerignore Configuration               | Must Have    | Both `backend/` and `frontend/` contain `.dockerignore` files excluding `node_modules`, `.env`, `*.log`, `dist/`, and `.git`                          |
| FR-087 | Image Tagging Standard                    | Should Have  | Docker images are tagged as `<service>:<git-sha>` for traceability; CI also tags with `latest` on main branch builds                                  |
| FR-088 | Container Resource Limits                 | Could Have   | Resource limits in `docker-compose.yml`: API — `memory: 512m, cpus: 0.5`; DB — `memory: 1g, cpus: 1.0`; Frontend — `memory: 128m, cpus: 0.25`       |
| FR-089 | Docker Compose Development Override       | Should Have  | `docker-compose.override.yml` for local development: enables hot-reload bind mounts and development-specific environment variables                     |
| FR-090 | Container Log Driver Configuration        | Should Have  | All services use `json-file` log driver with `max-size: 50m` and `max-file: 5` to prevent unbounded log growth on the host filesystem                 |

---

---

# Chapter 8: Deployment Requirements

## Overview

Deployment requirements define CI/CD pipeline configuration, cloud deployment targets (Render, Vercel), Nginx configuration, environment management, rollback procedures, versioning, and post-deployment health verification.

---

### FR-091 — FR-105

| ID     | Name                                        | Priority     | Description Summary                                                                                                                                                        |
|--------|---------------------------------------------|--------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| FR-091 | CI/CD Pipeline via GitHub Actions           | Must Have    | GitHub Actions workflow runs on every push to `main` and every PR: install, lint, test, build, Docker build, and image push to registry                                   |
| FR-092 | Automated Test Gate in CI                   | Must Have    | CI pipeline includes a test step running `npm test`; pipeline fails and blocks deployment if any test fails                                                                 |
| FR-093 | Render Backend Deployment                   | Must Have    | Express API deployed to Render as a Web Service; deployment triggered automatically on new Docker image push via Render Deploy Hook                                         |
| FR-094 | Vercel Frontend Deployment                  | Must Have    | React frontend deployed to Vercel; push to `main` triggers automatic Vercel build and deployment; PRs create preview deployments                                           |
| FR-095 | Environment Variable Management             | Must Have    | All production environment variables configured in Render and Vercel environment settings — never in code or committed files                                                |
| FR-096 | Supabase PostgreSQL                         | Must Have    | Production database provisioned as Supabase PostgreSQL; connection string injected via `DATABASE_URL` environment variable                                            |
| FR-097 | Database Migration on Deployment            | Must Have    | CI/CD pipeline runs `npx prisma migrate deploy` as a deployment step before the new API version goes live                                                                  |
| FR-098 | Deployment Rollback                         | Must Have    | If new deployment fails health checks, system rolls back to previous stable deployment; manual rollback also available in Render UI                                        |
| FR-099 | Release Versioning with Git Tags            | Should Have  | Every production release is tagged in Git using semantic versioning (`v1.0.0`); version is exposed at `GET /api/health`                                                    |
| FR-100 | Post-Deployment Health Verification         | Must Have    | After every deployment, automated check calls `GET /api/health` and `GET /` (frontend); non-2xx within 60 seconds marks deployment as failed                             |
| FR-101 | Nginx Reverse Proxy Configuration           | Should Have  | In self-hosted environments, Nginx proxies `/api/*` to port 3000 and `/` to port 80; SSL termination handled at the Nginx layer                                            |
| FR-102 | SSL/TLS Certificate via Let's Encrypt       | Should Have  | Self-hosted deployments use Certbot for free Let's Encrypt SSL certificates with automatic renewal via cron job                                                             |
| FR-103 | Blue/Green Deployment Strategy              | Future       | Support for blue/green deployments where a new version is launched alongside the old version and traffic is atomically switched upon health validation                      |
| FR-104 | Deployment Audit Log                        | Should Have  | Every deployment event (start, success, failure, rollback) is recorded in the `deployments` table with timestamp, triggering user, version, and environment               |
| FR-105 | Environment Promotion Pipeline              | Could Have   | Changes promoted through `development -> staging -> production`; each environment has an isolated database and independent configuration                                   |

---

---

# Chapter 9: Monitoring Requirements

## Overview

Monitoring requirements define application and container health monitoring, metrics collection, alerting, performance monitoring, and incident detection capabilities.

---

### FR-106 — FR-117

| ID     | Name                                     | Priority     | Description Summary                                                                                                                                                      |
|--------|------------------------------------------|--------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| FR-106 | Application Health Endpoint              | Must Have    | `GET /api/health` returns `{ status, version, uptime, db: "connected" or "disconnected", timestamp }` in under 200ms; used by load balancers and monitoring systems     |
| FR-107 | Database Connectivity Monitoring         | Must Have    | Health endpoint checks PostgreSQL connection by executing `SELECT 1`; returns `{ db: "disconnected", error: "..." }` if the query fails                                 |
| FR-108 | Container Health via Docker HEALTHCHECK  | Must Have    | Each Docker container has a HEALTHCHECK directive; Docker marks container as `unhealthy` after 3 consecutive failures (see FR-082)                                      |
| FR-109 | API Response Latency Tracking            | Should Have  | Express middleware records response time per request; P95 latency aggregated and available at `GET /api/metrics/latency` with 1-minute resolution                       |
| FR-110 | Error Rate Monitoring                    | Should Have  | System tracks HTTP 4xx and 5xx response counts per minute; accessible at `GET /api/metrics/errors`; alert triggered when 5xx rate exceeds 5 per minute                 |
| FR-111 | External Uptime Monitoring               | Should Have  | Platform configured in UptimeRobot or BetterStack for HTTP checks every 60 seconds from external servers to detect outages                                              |
| FR-112 | Incident Alert Webhook                   | Should Have  | P1 or P2 incident creation triggers a webhook POST to a configured Slack channel with incident summary, severity, and link                                               |
| FR-113 | Performance Degradation Auto-Incident    | Could Have   | If P95 API response time exceeds 2000ms for more than 5 consecutive minutes, system automatically creates a P2 incident record                                           |
| FR-114 | Memory and CPU Usage Tracking            | Could Have   | Node.js process metrics (heap usage, CPU) exposed at `GET /api/metrics/process`; recorded every 5 minutes in `system_metrics` table                                    |
| FR-115 | Log-Based Error Alerting                 | Should Have  | Log entries at `error` or `fatal` level are recorded in the `monitoring_alerts` table for dashboard display                                                             |
| FR-116 | Monitoring Stack via Docker Compose      | Could Have   | Optional `docker-compose.monitoring.yml` file provides Prometheus and Grafana containers for metric visualization                                                        |
| FR-117 | Scheduled Health Report                  | Could Have   | A daily summary report of health metrics (uptime %, error count, avg response time) generated and stored in `health_reports`; accessible at `GET /api/reports/health`  |

---

---

# Chapter 10: Logging Requirements

## Overview

Logging requirements define structured log output format, log levels, request/error/security/audit log categories, correlation ID injection, log retention policy, and log storage strategy.

---

### FR-118 — FR-127

| ID     | Name                                    | Priority     | Description Summary                                                                                                                                                                        |
|--------|-----------------------------------------|--------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| FR-118 | Structured JSON Logging                 | Must Have    | All application logs emitted as structured JSON (Pino or Winston). Every entry includes: `timestamp`, `level`, `message`, `service`, `correlationId`                                      |
| FR-119 | Log Levels                              | Must Have    | System supports five levels: `debug`, `info`, `warn`, `error`, `fatal`. Active level configurable via `LOG_LEVEL` environment variable. Production default: `info`                         |
| FR-120 | Request Logging                         | Must Have    | HTTP request middleware records every request: `method`, `path`, `statusCode`, `responseTime`, `ip`, `userAgent`, `userId` (if authenticated)                                              |
| FR-121 | Error Logging with Stack Trace          | Must Have    | Unhandled errors are logged at `error` level with full stack trace, request context, and `correlationId`; stack traces are never sent in HTTP responses in production                       |
| FR-122 | Correlation ID Propagation              | Must Have    | A unique UUID v4 correlation ID is generated per request by middleware, attached to `req.correlationId`, and included in all log entries for that request                                  |
| FR-123 | Authentication Security Logs           | Must Have    | All auth events (login success/failure, token refresh, logout, password reset) are logged at `info` level with `userId`, `ip`, `event_type`, and `timestamp`                              |
| FR-124 | Audit Log for Data Mutations            | Should Have  | All create, update, and delete operations on `tasks`, `deployments`, and `users` are written to `audit_log` with `entity_type`, `entity_id`, `action`, `actor_id`, `before`, `after`, `timestamp` |
| FR-125 | Log Retention Policy                    | Should Have  | Application logs retained for 30 days; audit logs retained for 365 days; logs beyond retention period are archived or deleted automatically                                                |
| FR-126 | Centralized Log Aggregation             | Future       | In production, logs shipped to Logtail, Datadog, or AWS CloudWatch via a log agent sidecar container                                                                                       |
| FR-127 | Sensitive Data Masking in Logs          | Must Have    | Logging layer masks sensitive fields before writing: `password`, `password_hash`, `token`, `refreshToken`, `authorization` are replaced with `[REDACTED]`                                 |

---

---

# Chapter 11: Troubleshooting Requirements

## Overview

Troubleshooting requirements cover structured guidance for diagnosing and recovering from deployment failures, Docker failures, database failures, and network failures. This chapter also defines Incident Report standards, Root Cause Analysis workflows, and Recovery Playbooks.

---

### FR-128

| Field               | Value                                                                                              |
|---------------------|----------------------------------------------------------------------------------------------------|
| **Requirement ID**  | FR-128                                                                                             |
| **Name**            | Incident Record Creation                                                                           |
| **Priority**        | Must Have                                                                                          |
| **Description**     | The system shall allow authenticated users to create a formal incident record when a production issue is detected. The record captures: title, description, severity (P1/P2/P3/P4), affected services, detected-at timestamp, and reporter. |
| **Business Value**  | Creates a formal, traceable record of production issues for RCA, post-mortems, and trend analysis  |
| **Actor**           | Developer, DevOps Engineer, Technical Lead                                                         |
| **Preconditions**   | User is authenticated with at least `student` role                                                 |
| **Trigger**         | User submits Create Incident form or calls `POST /api/incidents`                                  |
| **Main Flow**       | 1. User submits `{ title, description, severity, affectedServices }`. 2. System creates `incidents` record with `status: "open"` and `detected_at: NOW()`. 3. Activity log entry created. 4. Notifications sent to admin and technical lead. 5. HTTP 201 returned with the created incident. |
| **Postconditions**  | Incident record persisted; notification sent to relevant users                                     |
| **Dependencies**    | FR-005, FR-026                                                                                     |
| **Related APIs**    | `POST /api/incidents`                                                                              |
| **Related DB Tables** | `incidents`, `notifications`, `activity_log`                                                     |
| **Related UI**      | `CreateIncidentModal`, `IncidentForm`                                                             |
| **Acceptance Criteria** | 1. HTTP 201 with incident ID. 2. Severity must be one of `P1`, `P2`, `P3`, `P4`. 3. Missing title returns HTTP 400. 4. Notification queued for admin. 5. Incident appears in dashboard panel immediately. |
| **Validation Method** | Automated Integration Test                                                                      |
| **Traceability**    | Business Goal: Incident Management; Sprint: Sprint-04                                              |
| **Status**          | Approved                                                                                           |

---

### FR-129

| Field               | Value                                                                                              |
|---------------------|----------------------------------------------------------------------------------------------------|
| **Requirement ID**  | FR-129                                                                                             |
| **Name**            | Incident Status Lifecycle Management                                                               |
| **Priority**        | Must Have                                                                                          |
| **Description**     | An incident shall progress through defined status stages: `open -> investigating -> identified -> resolving -> resolved -> post-mortem`. Status transitions are recorded with timestamp and actor in `incident_timeline`. |
| **Business Value**  | Provides structured visibility into incident resolution progress                                   |
| **Actor**           | Developer, DevOps Engineer, Technical Lead                                                         |
| **Preconditions**   | Incident exists with `open` status                                                                 |
| **Trigger**         | User updates incident status via `PATCH /api/incidents/:id/status`                                |
| **Main Flow**       | 1. User submits `{ status: "investigating", note: "..." }`. 2. System validates the status transition is a forward step. 3. System updates `incidents.status`. 4. System records the transition in `incident_timeline`. 5. HTTP 200 returned. |
| **Postconditions**  | Incident status updated; timeline entry added; relevant notifications dispatched                   |
| **Dependencies**    | FR-128                                                                                             |
| **Related APIs**    | `PATCH /api/incidents/:id/status`                                                                  |
| **Related DB Tables** | `incidents`, `incident_timeline`                                                                 |
| **Related UI**      | `IncidentDetailPage`, `StatusTransitionDropdown`                                                  |
| **Acceptance Criteria** | 1. Valid forward transitions succeed with HTTP 200. 2. Backward status transitions return HTTP 400. 3. Each transition is recorded in `incident_timeline` with timestamp and actor. |
| **Validation Method** | Automated Integration Test                                                                      |
| **Traceability**    | Business Goal: Incident Management; Sprint: Sprint-04                                              |
| **Status**          | Approved                                                                                           |

---

### FR-130 — FR-147

| ID     | Name                                            | Priority     | Description Summary                                                                                                                                                             |
|--------|-------------------------------------------------|--------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| FR-130 | Root Cause Analysis (RCA) Document              | Must Have    | Users create a structured RCA linked to a resolved incident. Required fields: incident summary, timeline of events, root cause, contributing factors, remediation, prevention steps. |
| FR-131 | RCA Template Enforcement                        | Must Have    | RCA submissions missing any required section return HTTP 400 with the specific field name that is missing                                                                        |
| FR-132 | Troubleshooting Guide Library                   | Must Have    | Pre-written troubleshooting guides for common failures: Docker startup, DB connection, API 500 errors, deployment failures; searchable by category and keyword                  |
| FR-133 | Recovery Playbook Management                    | Must Have    | CRUD for recovery playbooks. Each playbook contains: title, failure category, step-by-step recovery instructions, author, and version number                                    |
| FR-134 | Deployment Failure Auto-Logging                 | Must Have    | When a post-deployment health check fails, system automatically creates a `deployment_failure` event in `deployments` table and triggers a notification                          |
| FR-135 | Docker Container Failure Recovery Guide         | Must Have    | Built-in guide detailing recovery from Docker container crashes using `docker logs`, `docker inspect`, and `docker-compose restart` commands                                     |
| FR-136 | Database Connection Failure Recovery Playbook   | Must Have    | Recovery playbook documenting diagnosis and restoration of PostgreSQL connectivity including connection pool exhaustion, `pg_isready` checks, and credential rotation            |
| FR-137 | Network Failure Diagnosis Guide                 | Should Have  | Guide explaining Docker network failure diagnosis using `docker network ls`, `docker network inspect`, and container ping tests                                                  |
| FR-138 | Incident Resolution Time Tracking               | Should Have  | System records `resolved_at` when incident reaches `resolved` status; calculates `time_to_resolve` in minutes; metric available in analytics                                    |
| FR-139 | Post-Mortem Report Creation                     | Should Have  | After incident resolution, users write a structured post-mortem: what happened, impact, contributing factors, timeline, action items with owner and due date                    |
| FR-140 | Troubleshooting Session Logging                 | Should Have  | Users log troubleshooting sessions documenting: problem description, hypotheses tested, commands executed, findings, and resolution; sessions linked to incidents               |
| FR-141 | Incident Severity SLA Tracking                  | Could Have   | System tracks whether P1 incidents resolve within 1 hour, P2 within 4 hours, P3 within 24 hours; SLA breaches trigger admin notification                                       |
| FR-142 | Error Code Resolution Database                  | Should Have  | Searchable database of common HTTP error codes and application error messages, each linked to likely causes and step-by-step resolution guidance                                 |
| FR-143 | Docker Compose Startup Sequence Guide           | Must Have    | Documented guide explaining the startup sequence, service dependency order, and how to diagnose failures in multi-service Docker Compose environments                           |
| FR-144 | Environment Variable Misconfiguration Checker   | Could Have   | Utility script `scripts/check-env.sh` validates that all required environment variables are set before the application starts                                                   |
| FR-145 | Container Exit Code Reference                   | Should Have  | Platform documents common Docker container exit codes (0, 1, 137, 143, 255) with likely causes and remediation steps                                                           |
| FR-146 | Incident Export to PDF                          | Could Have   | Users can export a single incident record (with RCA and timeline) to a formatted PDF via `GET /api/incidents/:id/export`                                                        |
| FR-147 | Incident Search and Filtering                   | Must Have    | Incident list supports keyword search and filtering by `status`, `severity`, `affected_service`, and `created_at` date range; results are paginated                            |

---

---

# Chapter 12: Documentation Requirements

## Overview

Documentation requirements define what engineering documentation artifacts the platform produces, manages, versions, and links throughout the SDLC, including PRDs, SRS, Architecture documents, ADRs, API documentation, and work history logs.

---

### FR-148 — FR-157

| ID     | Name                                    | Priority     | Description Summary                                                                                                                                                                  |
|--------|-----------------------------------------|--------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| FR-148 | Documentation Artifact Registry         | Must Have    | Platform maintains a registry where users create, link, and track documentation entries by type (PRD/SRS/ADR/API/Playbook), version, status, and linked module                       |
| FR-149 | ADR CRUD                                | Must Have    | Users can create, view, update, and version Architecture Decision Records. Fields: title, status (proposed/accepted/deprecated/superseded), context, decision, consequences, author    |
| FR-150 | API Documentation via OpenAPI           | Should Have  | Express API exports OpenAPI 3.0 specification at `GET /api/docs` via swagger-ui-express; auto-generated from route JSDoc comments and Zod schemas                                   |
| FR-151 | Engineering Work History Journal        | Must Have    | Users create daily work log entries documenting what was built, problems encountered, and resolutions. Entries are date-stamped and keyword-searchable                                |
| FR-152 | Documentation Review Workflow           | Should Have  | Documentation entries support a review workflow: `Draft -> In Review -> Approved -> Archived`; reviewer and approval timestamp are recorded                                          |
| FR-153 | Documentation Version Control           | Must Have    | All documentation artifacts are versioned using semantic versioning (1.0.0); previous versions are stored and accessible; current version is marked as canonical                     |
| FR-154 | Documentation Coverage Metric           | Should Have  | System calculates and displays a documentation coverage score: percentage of features/endpoints with linked documentation entries; displayed on dashboard widget (FR-032)            |
| FR-155 | Engineering Standards Reference Page   | Should Have  | A platform-hosted reference page documents coding standards, Conventional Commit format, branch naming, PR template, and review process                                              |
| FR-156 | Sprint Work Summary Generator           | Could Have   | At end of each sprint, users generate a structured work summary from task completions, commits, and work log entries for that sprint period                                           |
| FR-157 | Documentation Search                    | Should Have  | Users can search across all documentation artifacts by keyword; results show document title, type, version, and a content excerpt with the keyword highlighted                       |

---

---

# Chapter 13: AI Requirements

## Overview

AI requirements define how LLM assistance is integrated into DeployFix Lab for engineering documentation, debugging assistance, prompt library management, AI workflow standardization, and governance.

---

### FR-158 — FR-169

| ID     | Name                                        | Priority     | Description Summary                                                                                                                                                                      |
|--------|---------------------------------------------|--------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| FR-158 | AI Prompt Library                           | Must Have    | Curated, categorized collection of tested prompts for engineering tasks (debugging, code review, RCA, documentation); users can browse, copy, and submit prompts                         |
| FR-159 | AI-Assisted Debugging Query                 | Should Have  | Users submit an error message and stack trace to `POST /api/ai/debug`; system forwards context to LLM (GPT-4o or Gemini) and returns a structured diagnosis response                    |
| FR-160 | AI-Assisted Documentation Generator        | Should Have  | Users request AI-generated first-draft content for documentation artifacts (PRD section, ADR, RCA) by providing subject and context; output returned as Markdown text                    |
| FR-161 | Prompt Template CRUD                        | Must Have    | Authenticated users create, view, update, and delete prompt templates. Fields: title, category, prompt_text, model, tokens_estimate, author                                              |
| FR-162 | AI Context Window Management                | Must Have    | When constructing LLM requests, system ensures total token count (system + user context + prompt) does not exceed the model context window limit; excess context is truncated with a warning |
| FR-163 | AI Response Caching                         | Could Have   | Identical AI prompts submitted within 1 hour are returned from cache stored in `ai_cache` table, reducing API costs and improving response time                                         |
| FR-164 | AI Usage Tracking                           | Should Have  | Every AI API call recorded in `ai_usage_log` with: `user_id`, `model`, `prompt_tokens`, `completion_tokens`, `total_cost_usd`, `timestamp`; accessible via `GET /api/ai/usage`          |
| FR-165 | AI Cost Governance                          | Should Have  | Admin configures monthly AI spend limits per user in `user_settings.ai_monthly_limit`; when limit is reached, AI features are disabled with a clear message                             |
| FR-166 | Prompt Engineering Standards Documentation | Must Have    | Platform includes a reference page documenting prompt engineering best practices: role injection, few-shot examples, chain of thought, output formatting instructions                    |
| FR-167 | AI Model Selection per Request              | Should Have  | Users select which LLM model to use per request from configured available models (e.g., GPT-4o, GPT-4o-mini, Gemini 1.5 Pro); selection passed in the request body                    |
| FR-168 | AI Safety Content Filter                   | Should Have  | Before forwarding user input to the LLM API, system applies a content filter to reject clearly harmful or inappropriate prompts; rejected prompts return HTTP 400 with reason           |
| FR-169 | AI Workflow Documentation                   | Must Have    | Platform documents the complete AI development workflow: how to write prompts, structure AI context, evaluate AI output quality, and incorporate AI output into engineering artifacts    |

---

---

# Chapter 14: Analytics Requirements

## Overview

Analytics requirements define how the platform measures project progress, sprint velocity, bug trends, deployment success rates, documentation coverage, and developer productivity.

---

### FR-170 — FR-179

| ID     | Name                                     | Priority     | Description Summary                                                                                                                                                          |
|--------|------------------------------------------|--------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| FR-170 | Project Progress Analytics               | Must Have    | `GET /api/analytics/project` returns task completion rate, open task count by priority, and projected completion date based on current daily task completion velocity        |
| FR-171 | Sprint Velocity Chart                    | Should Have  | Analytics module calculates completed tasks per sprint and renders a line chart showing velocity trend over the last 6 sprints                                               |
| FR-172 | Blocked Task Analytics                   | Should Have  | Report of average time-in-blocked state per task, most-frequently-blocked assignees, and common block reasons from task comments                                              |
| FR-173 | Deployment Success Rate Analytics        | Must Have    | `GET /api/analytics/deployments` returns success rate (%), average deployment duration in seconds, and failure count for a configurable date range                           |
| FR-174 | Incident MTTR Analytics                  | Should Have  | Calculates Mean Time to Resolve (MTTR) per severity level (P1/P2/P3) over a configurable period. Formula: sum(resolved_at - detected_at) / count                           |
| FR-175 | Documentation Coverage Analytics        | Should Have  | Reports percentage of API endpoints with linked API documentation and percentage of features with a linked PRD or SRS section                                                |
| FR-176 | Developer Productivity Report            | Could Have   | Aggregates tasks completed, RCA documents written, and deployments executed per user per week; exposed at `GET /api/analytics/productivity` (admin only)                    |
| FR-177 | AI Usage Analytics                       | Could Have   | Admin report on total prompts submitted, tokens consumed, estimated cost, and top users by AI consumption; available in Admin panel                                          |
| FR-178 | System Uptime Report                     | Should Have  | Monthly report of uptime percentage, longest downtime event, and P1 incident count; stored in `health_reports` and accessible at `GET /api/reports/uptime`                  |
| FR-179 | Analytics Data Export to CSV             | Could Have   | All analytics reports exportable as CSV via `?format=csv` appended to the analytics endpoint URL                                                                             |

---

---

# Chapter 15: Administrative Requirements

## Overview

Administrative requirements define system-level configuration management, feature flag control, user permissions administration, audit logging access, maintenance mode, and backup/restore procedures.

---

### FR-180 — FR-191

| ID     | Name                                         | Priority     | Description Summary                                                                                                                                                         |
|--------|----------------------------------------------|--------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| FR-180 | Admin Dashboard Panel                        | Must Have    | Dedicated Admin panel at `/admin` (role-guarded) showing user count, active incidents, deployment count, AI usage summary, and system health overview                        |
| FR-181 | Feature Flag Management                      | Should Have  | Admins toggle feature flags via `PUT /api/admin/features/:key` to enable/disable platform features (e.g., `ai_assistant`, `deployment_module`) without code deployment       |
| FR-182 | System Configuration Settings                | Must Have    | Admin settings page for configuring rate limit thresholds, log retention days, AI spend limits, and notification webhook URLs; stored in `system_settings` table             |
| FR-183 | Maintenance Mode                             | Should Have  | Admins activate maintenance mode via `POST /api/admin/maintenance`; while active, all non-admin API requests return HTTP 503 `{ error: "System is under maintenance" }`     |
| FR-184 | Database Backup Command Documentation        | Must Have    | Platform documents the backup command: `pg_dump -U $PGUSER $PGDATABASE > backup_$(date +%Y%m%d).sql`; backups stored in a dedicated backup volume                          |
| FR-185 | Database Restore Procedure Documentation     | Must Have    | Platform documents and provides a tested restore procedure: `psql -U $PGUSER $PGDATABASE < backup_file.sql`; validated in a staging environment                             |
| FR-186 | Automated Database Backup via Cron           | Should Have  | A cron job executes `pg_dump` daily at 02:00 UTC and stores the compressed backup in the `db_backups` volume or S3 bucket                                                   |
| FR-187 | Audit Log Viewer (Admin)                     | Should Have  | Admins view and search the full `audit_log` table via `GET /api/admin/audit-log` with filters for `actor_id`, `entity_type`, `action`, and date range                     |
| FR-188 | User Activity Report (Admin)                 | Could Have   | Admin generates a report of any user's platform activity over a given date range including logins, task actions, deployment triggers, and AI usage                          |
| FR-189 | Bulk User Import (Admin)                     | Future       | Admin imports a CSV of users (email, username, role) to create accounts in bulk; duplicate emails are skipped and reported in the response                                  |
| FR-190 | Platform Announcement Broadcast              | Could Have   | Admin posts a platform announcement displayed as a banner notification for all authenticated users on their next login; stored in `announcements` table                     |
| FR-191 | System Log Download (Admin)                  | Should Have  | Admins download last N lines of application logs as `.txt` file via `GET /api/admin/logs/download?lines=500`                                                               |

---

---

# Chapter 16: Traceability Matrix

## 16.1 Authentication Traceability

| FR ID  | Business Goal       | Product Goal               | User Story         | API Endpoint                    | DB Table(s)                    | Test ID     | Sprint    |
|--------|---------------------|----------------------------|--------------------|----------------------------------|---------------------------------|-------------|-----------|
| FR-001 | User Acquisition    | Onboarding                 | US-AUTH-01         | POST /api/auth/register          | users                           | TC-AUTH-001 | Sprint-01 |
| FR-002 | Secure Access       | Authentication             | US-AUTH-02         | POST /api/auth/login             | users, refresh_tokens           | TC-AUTH-002 | Sprint-01 |
| FR-003 | Security            | Session Management         | US-AUTH-03         | POST /api/auth/logout            | refresh_tokens                  | TC-AUTH-003 | Sprint-01 |
| FR-004 | Security            | Data Protection            | US-AUTH-04         | POST /api/auth/register          | users                           | TC-AUTH-004 | Sprint-01 |
| FR-005 | Security            | API Protection             | US-AUTH-05         | All protected routes             | —                               | TC-AUTH-005 | Sprint-01 |
| FR-006 | User Experience     | Session Continuity         | US-AUTH-06         | POST /api/auth/refresh           | refresh_tokens                  | TC-AUTH-006 | Sprint-01 |
| FR-007 | Self-Service        | Account Recovery           | US-AUTH-07         | POST /api/auth/forgot-password   | password_reset_tokens           | TC-AUTH-007 | Sprint-02 |
| FR-008 | Security            | Account Recovery           | US-AUTH-08         | POST /api/auth/reset-password    | users, password_reset_tokens    | TC-AUTH-008 | Sprint-02 |
| FR-009 | Security            | Access Control             | US-AUTH-09         | All role-guarded routes          | users                           | TC-AUTH-009 | Sprint-01 |
| FR-010 | Data Quality        | Input Validation           | US-AUTH-10         | POST /api/auth/register          | users                           | TC-AUTH-010 | Sprint-01 |
| FR-011 | Security            | Credential Strength        | US-AUTH-11         | POST /api/auth/register          | users                           | TC-AUTH-011 | Sprint-01 |
| FR-012 | Security            | Frontend Protection        | US-AUTH-12         | N/A (frontend)                   | —                               | TC-AUTH-012 | Sprint-01 |
| FR-013 | UX                  | Session Restoration        | US-AUTH-13         | GET /api/auth/me                 | users                           | TC-AUTH-013 | Sprint-01 |
| FR-014 | Security            | Brute Force Prevention     | US-AUTH-14         | POST /api/auth/login             | —                               | TC-AUTH-014 | Sprint-01 |
| FR-015 | Data Integrity      | Request Validation         | US-AUTH-15         | All POST/PUT/PATCH               | —                               | TC-AUTH-015 | Sprint-01 |
| FR-016 | Data Integrity      | Unique Identifiers         | US-AUTH-16         | POST /api/auth/register          | users                           | TC-AUTH-016 | Sprint-01 |
| FR-017 | Security            | Token Security             | US-AUTH-17         | POST /api/auth/refresh           | refresh_tokens                  | TC-AUTH-017 | Sprint-02 |
| FR-018 | Security            | Cross-Origin Protection    | US-AUTH-18         | All routes                       | —                               | TC-AUTH-018 | Sprint-01 |
| FR-019 | Security            | Information Non-Disclosure | US-AUTH-19         | All /api/auth/* routes           | —                               | TC-AUTH-019 | Sprint-01 |
| FR-020 | Administration      | Role Management            | US-AUTH-20         | PUT /api/admin/users/:id/role    | users                           | TC-AUTH-020 | Sprint-03 |

---

## 16.2 Full FR Summary Traceability

| Chapter | FR Range    | Feature Area          | Sprint Range  | Must Have Count | Should Have | Could Have | Future |
|---------|-------------|-----------------------|---------------|-----------------|-------------|------------|--------|
| 3       | FR-001–020  | Authentication        | Sprint-01–02  | 14              | 5           | 0          | 1      |
| 4       | FR-021–040  | Dashboard             | Sprint-02–05  | 8               | 8           | 4          | 0      |
| 5       | FR-041–060  | Task Management       | Sprint-02–03  | 8               | 5           | 4          | 1      |
| 6       | FR-061–075  | User Management       | Sprint-02–04  | 5               | 5           | 3          | 2      |
| 7       | FR-076–090  | Docker                | Sprint-03     | 9               | 3           | 2          | 0      |
| 8       | FR-091–105  | Deployment / CI-CD    | Sprint-03–05  | 7               | 4           | 2          | 1      |
| 9       | FR-106–117  | Monitoring            | Sprint-03–04  | 4               | 4           | 3          | 0      |
| 10      | FR-118–127  | Logging               | Sprint-02–04  | 6               | 2           | 0          | 1      |
| 11      | FR-128–147  | Troubleshooting       | Sprint-04–05  | 9               | 7           | 3          | 0      |
| 12      | FR-148–157  | Documentation         | Sprint-02–05  | 4               | 5           | 1          | 0      |
| 13      | FR-158–169  | AI Integration        | Sprint-04–06  | 4               | 5           | 2          | 0      |
| 14      | FR-170–179  | Analytics             | Sprint-04–05  | 2               | 4           | 3          | 0      |
| 15      | FR-180–191  | Administration        | Sprint-03–06  | 4               | 5           | 2          | 1      |
| **TOTAL** | **FR-001–191** | **All Modules**   | **Sprint-01–06** | **84**      | **62**      | **29**     | **7**  |

---

---

# Chapter 17: Acceptance Criteria

## 17.1 Definition of Done

A feature is considered **Done** when ALL of the following conditions are met:

| # | Condition                                                                                      |
|---|-----------------------------------------------------------------------------------------------|
| 1 | All acceptance criteria for the related FR(s) are verified and passing                        |
| 2 | Unit tests exist and pass (`npm test` exits with code 0)                                      |
| 3 | Integration tests cover the primary happy path and at least 2 error paths                    |
| 4 | TypeScript compilation completes without errors (`npx tsc --noEmit`)                          |
| 5 | ESLint passes with no warnings or errors (`npm run lint`)                                     |
| 6 | Feature is reviewed and approved in a GitHub Pull Request by at least one peer                |
| 7 | The feature is deployed to the staging environment and manually verified                      |
| 8 | Relevant documentation is created or updated (API docs, ADR if applicable, work log)         |
| 9 | No P1 or P2 open defects exist for this feature                                               |
| 10| The feature is merged to `main` via a PR with a Conventional Commit message                  |

---

## 17.2 Module-Level Acceptance Criteria

### Authentication Module (FR-001 to FR-020)

| Criterion ID | Criterion                                                                                 | Test Type       |
|--------------|-------------------------------------------------------------------------------------------|-----------------|
| AC-AUTH-01   | All 20 authentication FR acceptance criteria pass                                         | Automated       |
| AC-AUTH-02   | Passwords are never returned in any API response                                           | Automated       |
| AC-AUTH-03   | JWT tokens expire at the correct intervals (access: 15min, refresh: 7 days)               | Automated       |
| AC-AUTH-04   | Rate limiting blocks more than 10 login attempts per IP per 15 minutes                    | Automated       |
| AC-AUTH-05   | RBAC blocks incorrect role access on all protected routes                                  | Automated       |
| AC-AUTH-06   | bcrypt hashes stored with cost factor 12 or higher                                        | Inspection      |
| AC-AUTH-07   | CORS blocks requests from unlisted origins                                                 | Automated       |
| AC-AUTH-08   | All auth errors return generic messages (no user enumeration possible)                     | Automated       |

---

### Dashboard Module (FR-021 to FR-040)

| Criterion ID | Criterion                                                                                 | Test Type       |
|--------------|-------------------------------------------------------------------------------------------|-----------------|
| AC-DASH-01   | Dashboard renders all stat cards with accurate data from the database                    | Automated E2E   |
| AC-DASH-02   | All charts render without console errors                                                  | Manual          |
| AC-DASH-03   | Dashboard is responsive at 375px, 768px, 1280px, and 1920px viewport widths              | Manual          |
| AC-DASH-04   | Data auto-refreshes every 60 seconds without a full page reload                           | Automated E2E   |
| AC-DASH-05   | Activity feed shows the most recent 10 events in descending timestamp order               | Automated       |
| AC-DASH-06   | Health panel reflects live container status within 60 seconds of a status change          | Manual          |

---

### Task Management Module (FR-041 to FR-060)

| Criterion ID | Criterion                                                                                 | Test Type       |
|--------------|-------------------------------------------------------------------------------------------|-----------------|
| AC-TASK-01   | Create task returns HTTP 201 with all required fields                                     | Automated       |
| AC-TASK-02   | List tasks supports all defined query parameters (status, priority, sort, q, page)        | Automated       |
| AC-TASK-03   | Update task enforces ownership and admin-only access controls                             | Automated       |
| AC-TASK-04   | Soft delete preserves audit record while removing task from list queries                  | Automated       |
| AC-TASK-05   | Search is case-insensitive and debounced at 300ms in the UI                               | Automated + E2E |
| AC-TASK-06   | Pagination returns correct `total`, `page`, and `totalPages` values                      | Automated       |
| AC-TASK-07   | Overdue tasks are visually highlighted in red in the task list                            | Manual + E2E    |
| AC-TASK-08   | Bulk status update modifies all selected tasks in a single atomic database transaction    | Automated       |

---

### Docker Module (FR-076 to FR-090)

| Criterion ID | Criterion                                                                                 | Test Type       |
|--------------|-------------------------------------------------------------------------------------------|-----------------|
| AC-DOCK-01   | `docker-compose up --build` brings all services to healthy state within 120 seconds      | Manual          |
| AC-DOCK-02   | Backend Docker image size is 300MB or less                                                | Inspection      |
| AC-DOCK-03   | `devDependencies` are not present in the production image layers                          | Inspection      |
| AC-DOCK-04   | Named volumes prevent data loss across `docker-compose down` and `up` cycles              | Manual          |
| AC-DOCK-05   | Health checks mark containers as unhealthy within 30 seconds of a service failure        | Manual          |
| AC-DOCK-06   | Services automatically restart after `docker kill <container_id>`                        | Manual          |
| AC-DOCK-07   | Environment variables from `.env` are correctly injected and accessible inside containers | Manual          |

---

### Deployment Module (FR-091 to FR-105)

| Criterion ID | Criterion                                                                                 | Test Type       |
|--------------|-------------------------------------------------------------------------------------------|-----------------|
| AC-DEP-01    | GitHub Actions workflow completes without error on every push to `main`                  | Automated CI    |
| AC-DEP-02    | CI pipeline fails and blocks the merge if any test fails                                  | Automated CI    |
| AC-DEP-03    | Render deployment is triggered automatically on main branch push via Deploy Hook          | Manual          |
| AC-DEP-04    | Post-deployment health check passes within 60 seconds of deployment completion            | Automated CI    |
| AC-DEP-05    | Database migration runs automatically before the new version goes live                    | Automated CI    |
| AC-DEP-06    | Deployment record is created in `deployments` table for every deployment event           | Automated       |
| AC-DEP-07    | Rollback restores the previous stable version within 5 minutes                           | Manual          |

---

### Troubleshooting Module (FR-128 to FR-147)

| Criterion ID | Criterion                                                                                 | Test Type       |
|--------------|-------------------------------------------------------------------------------------------|-----------------|
| AC-TRBL-01   | Incident creation returns HTTP 201 with incident ID and correct severity                 | Automated       |
| AC-TRBL-02   | Status transitions follow the defined forward-only lifecycle                              | Automated       |
| AC-TRBL-03   | RCA documents missing any required field return HTTP 400 with the field name             | Automated       |
| AC-TRBL-04   | Incident timeline records every status transition with actor and timestamp                | Automated       |
| AC-TRBL-05   | MTTR is calculated correctly for resolved incidents                                       | Automated       |
| AC-TRBL-06   | Troubleshooting guides are accessible and keyword-searchable in the platform             | Manual + E2E    |
| AC-TRBL-07   | Incident search returns correct results for all supported filter combinations             | Automated       |

---

### AI Module (FR-158 to FR-169)

| Criterion ID | Criterion                                                                                 | Test Type       |
|--------------|-------------------------------------------------------------------------------------------|-----------------|
| AC-AI-01     | Prompt library displays all templates with category, model, and estimated token count    | Manual + E2E    |
| AC-AI-02     | AI debug endpoint returns a structured response within 30 seconds                        | Automated       |
| AC-AI-03     | Token count is always verified to be within the model's context window limit before sending | Automated Unit |
| AC-AI-04     | All AI API calls are recorded in `ai_usage_log` with cost data                          | Automated       |
| AC-AI-05     | Monthly spend limit enforcement disables AI access when the limit is exceeded            | Automated       |
| AC-AI-06     | Content filter rejects clearly harmful prompts with HTTP 400 and a clear reason message  | Automated       |

---

### Administrative Module (FR-180 to FR-191)

| Criterion ID | Criterion                                                                                 | Test Type       |
|--------------|-------------------------------------------------------------------------------------------|-----------------|
| AC-ADM-01    | Admin panel is inaccessible to `student` and `instructor` roles (HTTP 403)               | Automated       |
| AC-ADM-02    | Feature flag changes take effect immediately without a service restart                   | Manual          |
| AC-ADM-03    | Maintenance mode returns HTTP 503 for all non-admin API requests                         | Automated       |
| AC-ADM-04    | Database backup command produces a valid, restorable SQL dump file                       | Manual          |
| AC-ADM-05    | Audit log records all data mutation events with before/after state values                | Automated       |

---

## 17.3 Testing Expectations

### Test Coverage Targets

| Layer          | Target Coverage | Measurement Tool        |
|----------------|-----------------|-------------------------|
| Unit Tests     | 80% or above    | Jest + Istanbul         |
| Integration    | 70% or above    | Jest + Supertest        |
| E2E Tests      | All key user flows | Playwright           |
| API Contract   | All endpoints   | Supertest               |

### Test Pyramid

```
         +---------------------+
         |      E2E Tests      |   (10%) -- Critical user flows
         +---------------------+
         | Integration Tests   |   (30%) -- API endpoint behaviors
         +---------------------+
         |    Unit Tests       |   (60%) -- Business logic, utilities, validators
         +---------------------+
```

### CI Pipeline Test Gates

| Gate         | Trigger              | Failure Action                            |
|--------------|----------------------|-------------------------------------------|
| Unit Tests   | Every push / PR      | PR cannot be merged; pipeline fails       |
| Integration  | Every push / PR      | PR cannot be merged; pipeline fails       |
| E2E Tests    | Merge to main only   | Deployment is blocked; alert is sent      |
| Lint         | Every push / PR      | PR cannot be merged; pipeline fails       |
| Type Check   | Every push / PR      | PR cannot be merged; pipeline fails       |

---

---

# Appendix A: Database Table Reference

| Table Name              | Description                                                              |
|-------------------------|--------------------------------------------------------------------------|
| `users`                 | User accounts, credentials, roles                                        |
| `refresh_tokens`        | Active refresh token hashes                                              |
| `password_reset_tokens` | Time-limited password reset tokens                                       |
| `tasks`                 | Task records with priority, status, assignee, and due date              |
| `deployments`           | Deployment history with status, version, environment, and trigger       |
| `incidents`             | Production incident records with severity and lifecycle status           |
| `incident_timeline`     | Timestamped status transition log for incidents                          |
| `activity_log`          | General event log for all system state changes                           |
| `audit_log`             | Structured data mutation log with before and after values               |
| `notifications`         | User-targeted notification records                                       |
| `ai_usage_log`          | AI API call records with token usage and cost                           |
| `ai_cache`              | Cached AI responses for duplicate prompts within the cache window       |
| `system_settings`       | Admin-configurable platform settings key-value store                    |
| `user_settings`         | Per-user preference and notification settings                           |
| `monitoring_alerts`     | Error and degradation alerts from the monitoring layer                  |
| `health_reports`        | Daily and monthly system health summary reports                         |
| `announcements`         | Admin broadcast announcements for all users                             |
| `documentation_entries` | Documentation artifact registry with versioning                         |
| `prompt_templates`      | AI prompt library entries with category and model metadata              |
| `system_metrics`        | Periodic process and performance metrics (heap, CPU, response time)     |

---

# Appendix B: API Endpoint Summary

| Method | Endpoint                              | FR(s)               | Auth Required | Minimum Role |
|--------|---------------------------------------|---------------------|---------------|--------------|
| POST   | /api/auth/register                    | FR-001              | No            | Guest        |
| POST   | /api/auth/login                       | FR-002              | No            | Guest        |
| POST   | /api/auth/logout                      | FR-003              | Yes           | Any          |
| POST   | /api/auth/refresh                     | FR-006, FR-017      | No            | Guest        |
| POST   | /api/auth/forgot-password             | FR-007              | No            | Guest        |
| POST   | /api/auth/reset-password              | FR-008              | No            | Guest        |
| GET    | /api/auth/me                          | FR-013              | Yes           | Any          |
| GET    | /api/dashboard/stats                  | FR-021              | Yes           | Any          |
| GET    | /api/dashboard/activity               | FR-022              | Yes           | Any          |
| GET    | /api/health                           | FR-106              | No            | Public       |
| GET    | /api/metrics/latency                  | FR-109              | Yes           | Any          |
| GET    | /api/metrics/errors                   | FR-110              | Yes           | Any          |
| GET    | /api/metrics/process                  | FR-114              | Yes           | Admin        |
| GET    | /api/tasks                            | FR-042              | Yes           | Any          |
| POST   | /api/tasks                            | FR-041              | Yes           | Any          |
| GET    | /api/tasks/:id                        | FR-055              | Yes           | Any          |
| PATCH  | /api/tasks/:id                        | FR-043              | Yes           | Owner/Admin  |
| DELETE | /api/tasks/:id                        | FR-044              | Yes           | Owner/Admin  |
| GET    | /api/tasks/summary                    | FR-025              | Yes           | Any          |
| GET    | /api/tasks/export                     | FR-060              | Yes           | Any          |
| GET    | /api/users/me                         | FR-061              | Yes           | Any          |
| PUT    | /api/users/me                         | FR-062              | Yes           | Any          |
| POST   | /api/users/me/avatar                  | FR-063              | Yes           | Any          |
| GET    | /api/incidents                        | FR-147              | Yes           | Any          |
| POST   | /api/incidents                        | FR-128              | Yes           | Any          |
| PATCH  | /api/incidents/:id/status             | FR-129              | Yes           | Any          |
| GET    | /api/incidents/:id/export             | FR-146              | Yes           | Any          |
| GET    | /api/deployments                      | FR-024, FR-091      | Yes           | Any          |
| GET    | /api/notifications                    | FR-026              | Yes           | Any          |
| PUT    | /api/notifications/:id/read           | FR-026              | Yes           | Any          |
| PUT    | /api/notifications/read-all           | FR-026              | Yes           | Any          |
| GET    | /api/analytics/project                | FR-170              | Yes           | Any          |
| GET    | /api/analytics/deployments            | FR-173              | Yes           | Any          |
| GET    | /api/analytics/deployment-trend       | FR-028, FR-173      | Yes           | Any          |
| GET    | /api/analytics/productivity           | FR-176              | Yes           | Admin        |
| GET    | /api/ai/usage                         | FR-164              | Yes           | Any          |
| POST   | /api/ai/debug                         | FR-159              | Yes           | Any          |
| GET    | /api/docs                             | FR-150              | No            | Public       |
| GET    | /api/reports/health                   | FR-117              | Yes           | Any          |
| GET    | /api/reports/uptime                   | FR-178              | Yes           | Any          |
| GET    | /api/admin/users                      | FR-065              | Yes           | Admin        |
| GET    | /api/admin/users/:id                  | FR-066              | Yes           | Admin        |
| PUT    | /api/admin/users/:id/role             | FR-020, FR-069      | Yes           | Admin        |
| POST   | /api/admin/maintenance                | FR-183              | Yes           | Admin        |
| PUT    | /api/admin/features/:key              | FR-181              | Yes           | Admin        |
| GET    | /api/admin/audit-log                  | FR-187              | Yes           | Admin        |
| GET    | /api/admin/logs/download              | FR-191              | Yes           | Admin        |

---

---

**End of Document**

---

| Field             | Value                              |
|-------------------|------------------------------------|
| Document ID       | DFIX-FRS-003                       |
| Version           | 1.0.0                              |
| Status            | Approved                           |
| Total FRs         | FR-001 through FR-191 (191 total)  |
| Must Have FRs     | 84                                 |
| Should Have FRs   | 62                                 |
| Could Have FRs    | 29                                 |
| Future FRs        | 7 (deferred)                       |
| Last Updated      | 2026-08-02                         |
