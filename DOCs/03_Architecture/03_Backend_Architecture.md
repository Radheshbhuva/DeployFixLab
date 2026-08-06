# 03 — Backend Architecture Specification

---

## Document Metadata

| Field               | Value                                                             |
|---------------------|-------------------------------------------------------------------|
| **Document Name**   | Backend Architecture Specification                                |
| **Document ID**     | DFIX-ARCH-003                                                     |
| **Version**         | 1.0.0                                                             |
| **Status**          | Approved                                                          |
| **Owner**           | Backend Engineering Lead                                          |
| **Reviewer**        | Principal Architect, Security Lead                                |
| **Classification**  | Internal — Confidential                                           |
| **Created Date**    | 2026-08-02                                                        |
| **Last Updated**    | 2026-08-06                                                        |
| **Project**         | DeployFix Lab                                                     |
| **Project Code**    | DFIX                                                              |

---

# 1. Backend Architecture Overview

The backend of **DeployFix Lab** is built as a production-grade, layered RESTful API service using **Node.js**, **Express.js**, and **TypeScript**. It manages authentication, lab workflows, database transactions via Prisma ORM, health monitoring, and chaos injection commands.

## 1.1 Architectural Pattern: Layered (N-Tier) Architecture
The backend strictly adheres to a 4-tier separation pattern:

```
[ Request Ingress ]
        │
        ▼
[ Route Handler / Middleware ]   --> Validation (Zod), Authentication (JWT), Rate Limiting
        │
        ▼
[ Controller Layer ]             --> Maps HTTP Requests to DTOs and handles response status
        │
        ▼
[ Service Layer ]                --> Encapsulates core business logic, chaos triggers & state machines
        │
        ▼
[ Repository / Data Layer ]     --> Prisma ORM executing parameterized SQL against PostgreSQL
```

---

# 2. Technology Stack

| Layer | Component | Version | Description |
|---|---|---|---|
| **Runtime Engine** | Node.js | v20.x LTS | Server-side JavaScript runtime engine |
| **Framework** | Express.js | ^4.19.0 | Fast, unopinionated web framework |
| **Language** | TypeScript | ^5.4.0 | Strongly typed application code |
| **ORM / Data Access** | Prisma | ^5.12.0 | Type-safe SQL query builder and schema migration tool |
| **Authentication** | JSONWebToken & bcrypt | ^9.0.0 | JWT generation and bcrypt password hashing (cost factor 10) |
| **Validation** | Zod | ^3.22.0 | Schema validation for HTTP bodies, headers, and params |
| **Logging** | Winston & Morgan | ^3.12.0 | Structured JSON logging with stream redirection |
| **Security** | Helmet & CORS | ^7.1.0 | HTTP header hardening and origin protection |

---

# 3. Directory & Folder Structure

```
backend/
├── src/
│   ├── config/                 # Environment variables & DB connection pool setup
│   ├── controllers/            # Request handlers (`authController.ts`, `labController.ts`)
│   ├── errors/                 # Custom AppError subclasses (`BadRequestError`, `UnauthorizedError`)
│   ├── middleware/             # Express middlewares (`authGuard`, `errorHandler`, `rateLimiter`)
│   ├── modules/                # Feature-based domain logic
│   │   ├── auth/               # Auth routes, services, DTOs
│   │   ├── labs/               # Lab scenario execution engine
│   │   ├── chaos/              # Failure injection handlers
│   │   └── health/             # Health probes (`/liveness`, `/readiness`)
│   ├── repositories/           # Database access layer using Prisma Client
│   ├── routes/                 # Express Router bindings (`v1/index.ts`)
│   ├── services/               # Core business services (`labService.ts`, `chaosService.ts`)
│   ├── utils/                  # Helper utilities (`logger.ts`, `jwtHelper.ts`)
│   ├── validations/            # Zod validation schemas
│   └── server.ts               # HTTP Server bootstrap & graceful shutdown hooks
├── prisma/
│   ├── schema.prisma           # Prisma data models
│   └── migrations/             # SQL migration files
├── package.json
└── tsconfig.json
```

---

# 4. Global Middleware Pipeline

Every HTTP request traverses the Express middleware pipeline in sequential order:

```
Request ──► [Morgan Logger] ──► [Helmet Security Headers] ──► [CORS Guard]
                                                                  │
Response ◄── [Error Handler] ◄── [Controller] ◄── [Zod Validator] ◄─┤ (Check Auth)
                                                                  ▼
                                                          [JWT Auth Guard]
```

---

# 5. Error Handling & Exception Standards

All unhandled exceptions are caught by global error middleware (`errorHandler.ts`) and transformed into standard JSON error objects:

```json
{
  "status": "error",
  "statusCode": 400,
  "errorCode": "INVALID_INPUT_VALIDATION",
  "message": "Invalid password requirements",
  "timestamp": "2026-08-06T10:57:04.000Z",
  "correlationId": "req-99482-a1"
}
```
