# DeployFix Lab

# Phase 2 --- Dockerize Everything

## Phase Goal

Containerize the entire DevOps Task Manager so it runs consistently
across development and production using Docker and Docker Compose. This
phase establishes the deployment foundation for later troubleshooting,
security, monitoring, and CI/CD phases.

------------------------------------------------------------------------

# Learning Objectives

-   Understand Docker architecture
-   Build Docker images
-   Write production-ready Dockerfiles
-   Use Docker Compose
-   Manage Docker volumes
-   Configure Docker networks
-   Run a multi-container application
-   Prepare for cloud deployment

------------------------------------------------------------------------

# Expected Deliverables

-   Frontend Container (React + Vite)
-   Backend Container (Node.js + Express)
-   Database Container (PostgreSQL)
-   Nginx Reverse Proxy Container
-   Docker Compose configuration
-   Environment variable management
-   Documentation

Final startup command:

``` bash
docker compose up
```

------------------------------------------------------------------------

# Technology Stack

  Component           Technology
  ------------------- ----------------
  Container Runtime   Docker
  Orchestration       Docker Compose
  Reverse Proxy       Nginx
  Frontend            React + Vite
  Backend             Express
  Database            PostgreSQL

------------------------------------------------------------------------

# Architecture

``` text
Browser
   │
Nginx
├──────────────┐
│              │
▼              ▼
Frontend     Backend
                 │
                 ▼
            PostgreSQL
```

------------------------------------------------------------------------

# Roadmap

## Sprint 1 --- Docker Fundamentals

-   Install Docker Desktop
-   Understand Images vs Containers
-   Learn Docker CLI
-   Learn image lifecycle

Deliverables: - Docker installed - Hello World container - Basic CLI
knowledge

------------------------------------------------------------------------

## Sprint 2 --- Frontend Container

Tasks: - Create Dockerfile - Multi-stage build - Environment variables -
Production image

Validation: - Frontend accessible inside container

------------------------------------------------------------------------

## Sprint 3 --- Backend Container

Tasks: - Create Dockerfile - Install dependencies - Configure Node
environment - Expose API port

Validation: - REST API operational

------------------------------------------------------------------------

## Sprint 4 --- PostgreSQL Container

Tasks: - Persistent volume - Database initialization - Environment
variables - Connectivity testing

Validation: - Backend connects successfully

------------------------------------------------------------------------

## Sprint 5 --- Nginx Reverse Proxy

Tasks: - Reverse proxy - Static asset serving - API routing - Port
mapping

Validation: - Browser accesses application through Nginx

------------------------------------------------------------------------

## Sprint 6 --- Docker Compose

Create:

-   compose.yaml
-   Networks
-   Volumes
-   Service dependencies
-   Restart policies

Validation:

``` bash
docker compose up
docker compose down
docker compose logs
```

------------------------------------------------------------------------

# Repository Structure

``` text
docker/
├── frontend/
│   └── Dockerfile
├── backend/
│   └── Dockerfile
├── nginx/
│   ├── Dockerfile
│   └── nginx.conf
├── compose.yaml
└── .env.example
```

------------------------------------------------------------------------

# Networks

## Frontend Network

Browser → Nginx → Frontend

## Backend Network

Nginx → Backend

## Database Network

Backend → PostgreSQL

Use an isolated bridge network for internal communication.

------------------------------------------------------------------------

# Volumes

Persist:

-   PostgreSQL data
-   Nginx logs
-   Application logs (optional)

------------------------------------------------------------------------

# Environment Variables

Frontend

-   VITE_API_URL

Backend

-   PORT
-   DATABASE_URL
-   JWT_SECRET
-   LOG_LEVEL

Database

-   POSTGRES_USER
-   POSTGRES_PASSWORD
-   POSTGRES_DB

------------------------------------------------------------------------

# Validation Checklist

-   Frontend builds
-   Backend builds
-   PostgreSQL persists data
-   Nginx routes requests
-   API reachable
-   Health endpoints respond
-   Containers restart successfully

------------------------------------------------------------------------

# Common Troubleshooting Scenarios

-   Wrong Dockerfile path
-   Build failures
-   Missing environment variables
-   Port conflicts
-   Database connection failures
-   Volume permission issues
-   Network misconfiguration
-   Reverse proxy errors

These issues will intentionally become exercises in later phases.

------------------------------------------------------------------------

# Success Criteria

-   Entire stack starts with one command.
-   Services communicate through Docker network.
-   Data survives container recreation.
-   Nginx serves frontend and proxies API.
-   Ready for deployment and CI/CD.

------------------------------------------------------------------------

# Phase Outputs

-   Dockerfiles
-   Docker Compose
-   Nginx configuration
-   Volume configuration
-   Network configuration
-   Build guide
-   Troubleshooting guide
-   Updated documentation

By completing Phase 2, DeployFix Lab becomes a portable, reproducible
production environment suitable for later deployment, monitoring, load
testing, security scanning, and incident simulation.
