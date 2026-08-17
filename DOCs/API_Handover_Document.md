# DeployFix Lab — API Handover Document

This document serves as the comprehensive API specification and developer handover reference for the DeployFix Lab backend API services.

---

## 🔐 Authentication Scheme

* **Mechanism**: Bearer JWT (Access Token) + HTTP-only Cookie Rotation (Refresh Token).
* **Token Lifetime**: Access Token is valid for 15 minutes (`900s`). Refresh Token cookie is valid for 7 days.
* **Headers**: `Authorization: Bearer <JWT_ACCESS_TOKEN>` on all protected endpoints.
* **Cookie**: `refreshToken` (HttpOnly, Secure in production, SameSite: Strict) set under path `/api/v1/auth/refresh`.

---

## 🌐 Full Route Registry

### 1. System Health & Probes
| Method | Path | Auth Level | Description |
|--------|------|------------|-------------|
| **GET** | `/health/liveness` | Public | Base container liveness check |
| **GET** | `/health/readiness` | Public | Database connection sanity check |

### 2. Authentication Module
| Method | Path | Auth Level | Description |
|--------|------|------------|-------------|
| **POST** | `/api/v1/auth/register` | Public | Register student profile |
| **POST** | `/api/v1/auth/login` | Public | Authenticates credentials |
| **POST** | `/api/v1/auth/refresh` | Public (Cookie) | Rotates refresh token |
| **POST** | `/api/v1/auth/logout` | Authenticated | Revoke refresh token & wipe cookies |
| **GET** | `/api/v1/auth/me` | Authenticated | Return active user details |

### 3. Business Tasks CRUD & Dashboard
| Method | Path | Auth Level | Description |
|--------|------|------------|-------------|
| **GET** | `/api/v1/tasks` | Authenticated | Search, paginate, and filter tasks |
| **POST** | `/api/v1/tasks` | Authenticated | Create a new task |
| **GET** | `/api/v1/tasks/:id` | Authenticated | Fetch specific task |
| **PUT** | `/api/v1/tasks/:id` | Authenticated | Update task attributes |
| **DELETE** | `/api/v1/tasks/:id` | Authenticated | Delete task from DB |
| **GET** | `/api/v1/dashboard` | Authenticated | Fetch stats summary & probe db |

### 4. Labs Scenarios Catalog
| Method | Path | Auth Level | Description |
|--------|------|------------|-------------|
| **GET** | `/api/v1/labs` | Authenticated | Retrieve lab catalog + user progress |
| **POST** | `/api/v1/labs/:id/start` | Authenticated | Start a lab progress session |

### 5. Chaos Simulation Engine
| Method | Path | Auth Level | Description |
|--------|------|------------|-------------|
| **POST** | `/api/v1/chaos/inject` | Admin/Instructor | Set student progress to `FAILED_INJECTED` |
| **POST** | `/api/v1/chaos/verify` | Authenticated | Run resolution diagnostic check |

### 6. Diagnostic Evidence Gatherer
| Method | Path | Auth Level | Description |
|--------|------|------------|-------------|
| **GET** | `/api/v1/evidence/nginx-logs` | Authenticated | Get Nginx access & failure log stream |
| **GET** | `/api/v1/evidence/docker-containers` | Authenticated | Get container health status arrays |
| **GET** | `/api/v1/evidence/configs` | Authenticated | Get simulated config files (.env, conf) |

### 7. AI Diagnosis Engine
| Method | Path | Auth Level | Description |
|--------|------|------------|-------------|
| **POST** | `/api/v1/diagnosis/run` | Authenticated | Constructs prompts and runs reasoning |

### 8. Recovery Guides & Step Execution
| Method | Path | Auth Level | Description |
|--------|------|------------|-------------|
| **GET** | `/api/v1/recovery/guide` | Authenticated | Retrieve step resolution instructions |
| **POST** | `/api/v1/recovery/execute` | Authenticated | Stateful step execution tracking |

### 9. Activity Monitoring & Audit Trails
| Method | Path | Auth Level | Description |
|--------|------|------------|-------------|
| **GET** | `/api/v1/audit` | Admin/Instructor | Retrieve database action logging lists |

---

## 📦 Request / Response Schema Mappings

### AI Diagnosis Output (`POST /api/v1/diagnosis/run`)
```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "prompt": "...[REDACTED] compiled system prompt + raw telemetry...",
    "diagnosis": {
      "problem": "PostgreSQL Database Connection Authentication Failure",
      "rootCause": "The DATABASE_URL password parameter in the .env configuration file is set to 'wrong_password_db'.",
      "confidence": 0.95,
      "severity": "critical",
      "evidence": [
        "Nginx logs display backend-api connection error: FATAL: password authentication failed for user 'postgres'",
        "Configuration file .env contains mismatching database credentials password"
      ],
      "recommendedActions": [
        "Edit the environment file .env and replace wrong_password_db with postgres_secure_pass",
        "Restart the backend service container to reload the environment variables"
      ],
      "requiresUserAction": true,
      "autoRemediationAllowed": false
    }
  },
  "timestamp": "2026-08-18T02:00:00.000Z"
}
```

### Recovery Guide Plan (`GET /api/v1/recovery/guide`)
```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "guide": {
      "diagnosisId": "lab-scenario-uuid",
      "steps": [
        {
          "order": 1,
          "action": "Update DATABASE_URL password in the environment file to postgres_secure_pass",
          "command": "nano .env",
          "targetFile": ".env"
        },
        {
          "order": 2,
          "action": "Restart the backend application server container",
          "command": "docker restart backend-api"
        }
      ],
      "requiresUserAction": true,
      "autoRemediationAllowed": false
    }
  },
  "timestamp": "2026-08-18T02:00:00.000Z"
}
```

---

## 🗄️ Database Schema Updates Reference

### 1. `UserLabProgress` Model
Maps student progression against chaos labs.
* **Compound Key Constraint**: `userId_labId` (userId + labId) forces single progress record per student-lab mapping.
* **LabStatus State Machine**:
  `NOT_STARTED` ➡️ `IN_PROGRESS` ➡️ `FAILED_INJECTED` ➡️ `VERIFIED`.

### 2. `AuditLog` Model
Used for security trails and instructor activity monitoring.
* **Columns**:
  * `id`: UUID (Primary Key)
  * `userId`: UUID (Nullable) -> linked to User who performed actions (null on public action).
  * `action`: VarChar(100) -> E.g. `LOGIN`, `START_LAB`, `INJECT_CHAOS`, `EXECUTE_RECOVERY_STEP`.
  * `resource`: VarChar(100) -> E.g. `USER`, `LAB_SCENARIO`, `CHAOS_FAILURE`.
  * `details`: JSON payload.
  * `createdAt`: Timestamp.
