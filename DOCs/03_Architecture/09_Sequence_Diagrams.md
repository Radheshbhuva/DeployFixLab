# 09 — Sequence Diagrams Specification

---

## Document Metadata

| Field               | Value                                                             |
|---------------------|-------------------------------------------------------------------|
| **Document Name**   | Sequence Diagrams Specification                                   |
| **Document ID**     | DFIX-ARCH-009                                                     |
| **Version**         | 1.0.0                                                             |
| **Status**          | Approved                                                          |
| **Owner**           | Lead Software Architect                                           |
| **Reviewer**        | Full Engineering Team                                             |
| **Classification**  | Internal — Confidential                                           |
| **Created Date**    | 2026-08-02                                                        |
| **Last Updated**    | 2026-08-06                                                        |
| **Project**         | DeployFix Lab                                                     |
| **Project Code**    | DFIX                                                              |

---

# 1. User Authentication & Token Refresh Sequence

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant React as React SPA (Frontend)
    participant Nginx as Nginx Ingress
    participant API as Express API Server
    participant DB as PostgreSQL DB

    User->>React: Enters email & password
    React->>Nginx: POST /api/v1/auth/login
    Nginx->>API: Proxy POST /api/v1/auth/login
    API->>DB: SELECT * FROM users WHERE email = $1
    DB-->>API: User Record (bcrypt hash)
    API->>API: Validate password (bcrypt.compare)
    API->>API: Generate Access Token (JWT 15m) & Refresh Token
    API-->>Nginx: 200 OK + JSON(access_token) + Set-Cookie(refreshToken)
    Nginx-->>React: 200 OK Response
    React->>React: Store access_token in Zustand Auth Store
```

---

# 2. Controlled Chaos Injection & Verification Sequence

```mermaid
sequenceDiagram
    autonumber
    actor Admin as Instructor / Admin
    actor Student as Learner / Student
    participant API as Express API Server
    participant Chaos as Chaos Engine
    participant DB as PostgreSQL DB

    Admin->>API: POST /api/v1/chaos/inject {labCode: "LAB-003"}
    API->>Chaos: Trigger scenario (e.g. Alter DB Port config)
    Chaos->>DB: UPDATE user_lab_progress SET status = 'FAILED_INJECTED'
    Chaos-->>API: Injection Confirmed
    API-->>Admin: 200 OK Chaos Active

    Note over Student, DB: Student diagnoses failure via terminal/logs...

    Student->>API: POST /api/v1/chaos/verify {labCode: "LAB-003"}
    API->>API: Execute automated verification probes
    alt Probes Pass
        API->>DB: UPDATE user_lab_progress SET status = 'VERIFIED'
        API-->>Student: 200 OK {verified: true}
    else Probes Fail
        API-->>Student: 400 Bad Request {verified: false, errors: [...]}
    end
```
