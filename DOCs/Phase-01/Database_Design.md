# Database Design

# Phase 1 -- DevOps Task Manager

## Purpose

Design a normalized PostgreSQL database for a production-ready task
management application that supports authentication, task management,
dashboards, and future troubleshooting scenarios.

## Database Technology

-   PostgreSQL
-   Prisma ORM

## Design Principles

-   Third Normal Form (3NF)
-   UUID primary keys
-   Foreign key constraints
-   Indexed lookup columns
-   Audit timestamps

## Entity Relationship

``` text
Users (1)
   │
   │
   └──────────────< Tasks (Many)
```

## Tables

### users

  Column          Type           Constraints
  --------------- -------------- ----------------
  id              UUID           PK
  name            VARCHAR(100)   NOT NULL
  email           VARCHAR(255)   UNIQUE
  password_hash   TEXT           NOT NULL
  role            VARCHAR(20)    DEFAULT 'USER'
  created_at      TIMESTAMP      DEFAULT NOW()
  updated_at      TIMESTAMP      DEFAULT NOW()

### tasks

  Column        Type           Constraints
  ------------- -------------- ------------------
  id            UUID           PK
  title         VARCHAR(200)   NOT NULL
  description   TEXT           NULL
  status        VARCHAR(20)    DEFAULT 'TODO'
  priority      VARCHAR(20)    DEFAULT 'MEDIUM'
  due_date      TIMESTAMP      NULL
  user_id       UUID           FK -\> users.id
  created_at    TIMESTAMP      DEFAULT NOW()
  updated_at    TIMESTAMP      DEFAULT NOW()

## Relationships

-   One User → Many Tasks

## Indexes

-   users.email
-   tasks.user_id
-   tasks.status
-   tasks.priority

## Future Tables

-   refresh_tokens
-   activity_logs
-   notifications
-   audit_logs

## Deliverables

-   ER Diagram
-   PostgreSQL schema
-   Prisma schema
-   Migration scripts
-   Seed data
