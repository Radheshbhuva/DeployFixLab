# 02 — Entity Relationship (ER) Diagram

---

## Document Metadata

| Field               | Value                                                             |
|---------------------|-------------------------------------------------------------------|
| **Document Name**   | Entity Relationship (ER) Diagram                                  |
| **Document ID**     | DFIX-DB-002                                                       |
| **Version**         | 1.0.0                                                             |
| **Status**          | Approved                                                          |
| **Owner**           | Database Architect                                                |
| **Reviewer**        | Technical Lead                                                    |
| **Classification**  | Internal — Confidential                                           |
| **Created Date**    | 2026-08-02                                                        |
| **Last Updated**    | 2026-08-07                                                        |
| **Project**         | DeployFix Lab                                                     |
| **Project Code**    | DFIX                                                              |

---

# 1. Complete System ER Diagram (Mermaid)

```mermaid
erDiagram
    USERS ||--o{ REFRESH_TOKENS : owns
    USERS ||--o{ TASKS : manages
    USERS ||--o{ USER_LAB_PROGRESS : executes
    USERS ||--o{ AUDIT_LOGS : triggers

    LAB_SCENARIOS ||--o{ CHAOS_FAILURES : defines
    LAB_SCENARIOS ||--o{ USER_LAB_PROGRESS : tracks

    USER_LAB_PROGRESS ||--o{ VERIFICATION_LOGS : generates

    USERS {
        uuid id PK
        string email UK
        string password_hash
        string name
        string role
        timestamp created_at
        timestamp updated_at
    }

    REFRESH_TOKENS {
        uuid id PK
        uuid user_id FK
        string token UK
        boolean is_revoked
        timestamp expires_at
        timestamp created_at
    }

    TASKS {
        uuid id PK
        uuid user_id FK
        string title
        text description
        string status
        string priority
        timestamp due_date
        timestamp created_at
        timestamp updated_at
    }

    LAB_SCENARIOS {
        uuid id PK
        string code UK
        string title
        string category
        string difficulty
        text description
        json initial_config
        timestamp created_at
    }

    CHAOS_FAILURES {
        uuid id PK
        uuid lab_id FK
        string vector_type
        string target_service
        json payload
        timestamp created_at
    }

    USER_LAB_PROGRESS {
        uuid id PK
        uuid user_id FK
        uuid lab_id FK
        string status
        timestamp started_at
        timestamp completed_at
    }

    VERIFICATION_LOGS {
        uuid id PK
        uuid progress_id FK
        boolean is_passed
        json output
        timestamp executed_at
    }

    AUDIT_LOGS {
        uuid id PK
        uuid user_id FK
        string action
        string resource
        json details
        timestamp created_at
    }
```
