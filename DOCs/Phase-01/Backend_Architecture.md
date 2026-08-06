# Backend Architecture

# Phase 1 -- DevOps Task Manager

## Purpose

Design a modular Express backend that exposes secure REST APIs,
integrates with PostgreSQL, and serves as the deployment target for
later DevOps phases.

## Technology Stack

-   Node.js
-   Express
-   TypeScript
-   PostgreSQL
-   Prisma ORM
-   JWT
-   bcrypt
-   Zod
-   Winston
-   Morgan

## Architectural Style

Layered Architecture

``` text
Routes
  │
Controllers
  │
Services
  │
Repositories
  │
Prisma ORM
  │
PostgreSQL
```

## Folder Structure

``` text
backend/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── modules/
│   │   ├── auth/
│   │   ├── users/
│   │   ├── tasks/
│   │   └── dashboard/
│   ├── repositories/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── validations/
│   └── server.ts
```

## Core Modules

-   Authentication
-   Users
-   Tasks
-   Dashboard
-   Health

## API Endpoints

### Auth

-   POST /api/auth/register
-   POST /api/auth/login
-   GET /api/auth/me

### Tasks

-   GET /api/tasks
-   POST /api/tasks
-   PUT /api/tasks/:id
-   DELETE /api/tasks/:id

### Health

-   GET /health
-   GET /ready
-   GET /live

## Database

Tables: - users - tasks

Relationship: - One user has many tasks.

## Middleware

-   Authentication
-   Authorization
-   Validation
-   Error handler
-   Logger
-   Rate limiter
-   CORS
-   Helmet

## Logging

-   Request logs
-   Error logs
-   Startup logs

## Security

-   JWT authentication
-   Password hashing
-   Input validation
-   Secure headers

## Deliverables

-   Modular Express API
-   PostgreSQL integration
-   REST endpoints
-   Production-ready backend
-   Ready for Dockerization and deployment
