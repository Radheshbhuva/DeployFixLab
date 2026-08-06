# 04 — Database Architecture Specification

---

## Document Metadata

| Field               | Value                                                             |
|---------------------|-------------------------------------------------------------------|
| **Document Name**   | Database Architecture Specification                               |
| **Document ID**     | DFIX-ARCH-004                                                     |
| **Version**         | 1.0.0                                                             |
| **Status**          | Approved                                                          |
| **Owner**           | Database Architect                                                |
| **Reviewer**        | Technical Lead, Backend Lead                                      |
| **Classification**  | Internal — Confidential                                           |
| **Created Date**    | 2026-08-02                                                        |
| **Last Updated**    | 2026-08-06                                                        |
| **Project**         | DeployFix Lab                                                     |
| **Project Code**    | DFIX                                                              |

---

# 1. Database Architecture Overview

The persistence tier of **DeployFix Lab** utilizes **PostgreSQL 16**, managed through **Prisma ORM**. The schema is normalized (3NF), indexed for high-concurrency read operations, and configured with foreign key constraints to enforce relational integrity across users, labs, chaos injection scenarios, audit logs, and telemetry data.

---

# 2. Entity Relationship Diagram (ERD)

```mermaid
erDiagram
    USERS ||--o{ USER_LAB_PROGRESS : attempts
    USERS ||--o{ AUDIT_LOGS : triggers
    LAB_SCENARIOS ||--o{ USER_LAB_PROGRESS : tracks
    LAB_SCENARIOS ||--o{ CHAOS_FAILURES : includes
    USER_LAB_PROGRESS ||--o{ VERIFICATION_LOGS : records

    USERS {
        uuid id PK
        string email UK
        string password_hash
        string role
        timestamp created_at
        timestamp updated_at
    }

    LAB_SCENARIOS {
        uuid id PK
        string code UK
        string title
        string difficulty
        string category
        text description
        json initial_config
        timestamp created_at
    }

    CHAOS_FAILURES {
        uuid id PK
        uuid lab_id FK
        string vector_type
        string target_container
        json fail_params
        json recovery_params
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
        json test_output
        timestamp executed_at
    }

    AUDIT_LOGS {
        uuid id PK
        uuid user_id FK
        string action
        string resource
        timestamp created_at
    }
```

---

# 3. Table Specifications & Constraints

## 3.1 `USERS` Table
Stores user accounts, credentials, and access roles (`STUDENT`, `INSTRUCTOR`, `ADMIN`).
* Primary Key: `id` (UUIDv4)
* Unique Index: `email` (B-tree)
* Hashing Constraint: Passwords must store 60-character bcrypt strings.

## 3.2 `LAB_SCENARIOS` Table
Defines available lab exercises, metadata, and difficulty levels (`BEGINNER`, `INTERMEDIATE`, `ADVANCED`).
* Primary Key: `id` (UUIDv4)
* Unique Index: `code` (e.g. `LAB-001`)

## 3.3 `USER_LAB_PROGRESS` Table
Tracks user lab executions and state transitions (`NOT_STARTED` -> `IN_PROGRESS` -> `FAILED_INJECTED` -> `RECOVERED` -> `VERIFIED`).
* Foreign Keys: `user_id` -> `USERS(id)`, `lab_id` -> `LAB_SCENARIOS(id)`
* Composite Index: `(user_id, lab_id)`

---

# 4. Database Optimization & Indexing Strategy

To guarantee sub-10ms query execution times under load:
1. **Primary Keys:** Clustered UUIDv4 indices.
2. **Foreign Keys:** B-tree indices created on all foreign key references (`user_id`, `lab_id`).
3. **Filtering Indices:** Partial B-tree indices on `USER_LAB_PROGRESS(status)` for rapid lookup of active labs.
