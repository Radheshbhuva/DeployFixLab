# DeployFix Lab

# Phase 1 --- Build a Small Full Stack App

## Phase Goal

Build a realistic production-style full stack application that will
later be intentionally broken, diagnosed, repaired, monitored, secured,
and redeployed during later phases.

------------------------------------------------------------------------

# Project Name

**DevOps Task Manager**

A production-inspired task management platform used as the deployment
target throughout DeployFix Lab.

------------------------------------------------------------------------

# Learning Objectives

-   Build a production-ready React frontend
-   Build a REST API with Express
-   Connect PostgreSQL
-   Implement authentication
-   Design modular architecture
-   Prepare for Dockerization
-   Prepare for CI/CD
-   Prepare for troubleshooting scenarios

------------------------------------------------------------------------

# Scope

## Frontend

-   React
-   TypeScript
-   Vite
-   React Router
-   Axios
-   Zustand/Context
-   Responsive UI

## Backend

-   Node.js
-   Express
-   TypeScript
-   JWT Authentication
-   Validation
-   Logging
-   REST API

## Database

-   PostgreSQL
-   Relational schema
-   Seed data
-   Migrations

------------------------------------------------------------------------

# Core Features

## Authentication

-   Register
-   Login
-   Logout
-   JWT Access Token
-   Protected Routes
-   Password Hashing
-   Role-based Authorization (Admin/User)

## Dashboard

-   User greeting
-   Task statistics
-   Recent activity
-   System status
-   Profile summary

## Task CRUD

-   Create Task
-   Read Tasks
-   Update Task
-   Delete Task
-   Search
-   Filter
-   Sort

## Profile

-   View Profile
-   Update Profile
-   Change Password

------------------------------------------------------------------------

# Suggested Tech Stack

  Layer         Technology
  ------------- ---------------------------
  Frontend      React + TypeScript + Vite
  Backend       Express + TypeScript
  Database      PostgreSQL
  ORM           Prisma
  Auth          JWT + bcrypt
  Validation    Zod
  Logging       Winston + Morgan
  API Testing   Postman

------------------------------------------------------------------------

# Repository Structure

``` text
deployfix-lab/
├── frontend/
├── backend/
├── database/
├── docs/
├── postman/
├── scripts/
└── README.md
```

------------------------------------------------------------------------

# Backend Modules

-   Authentication
-   Users
-   Tasks
-   Dashboard
-   Health
-   Configuration
-   Logging
-   Middleware

------------------------------------------------------------------------

# API Endpoints

## Authentication

-   POST /api/auth/register
-   POST /api/auth/login
-   GET /api/auth/me
-   POST /api/auth/logout

## Tasks

-   GET /api/tasks
-   GET /api/tasks/:id
-   POST /api/tasks
-   PUT /api/tasks/:id
-   DELETE /api/tasks/:id

## Dashboard

-   GET /api/dashboard

## Health

-   GET /health
-   GET /ready
-   GET /live

------------------------------------------------------------------------

# Database Tables

## users

-   id
-   name
-   email
-   password_hash
-   role
-   created_at

## tasks

-   id
-   title
-   description
-   status
-   priority
-   due_date
-   user_id
-   created_at
-   updated_at

------------------------------------------------------------------------

# Milestones

## Sprint 1

-   Repository
-   React setup
-   Express setup
-   PostgreSQL
-   Prisma

## Sprint 2

-   Authentication
-   Protected routes
-   JWT

## Sprint 3

-   CRUD
-   Dashboard
-   API integration

## Sprint 4

-   Validation
-   Logging
-   Error handling

## Sprint 5

-   Testing
-   Documentation
-   Phase review

------------------------------------------------------------------------

# Deliverables

-   React Application
-   Express REST API
-   PostgreSQL Database
-   GitHub Repository
-   API Documentation
-   ER Diagram
-   Architecture Diagram
-   Screenshots
-   Postman Collection
-   README

------------------------------------------------------------------------

# Success Criteria

-   User registration and login work.
-   Protected routes require authentication.
-   CRUD operations persist to PostgreSQL.
-   Dashboard displays live data.
-   APIs return correct status codes.
-   Code is modular and documented.
-   Application is ready for Dockerization in Phase 2.

------------------------------------------------------------------------

# Preparation for Future Phases

This application is intentionally designed to become the target system
for:

-   Docker deployment
-   Reverse proxy configuration
-   CI/CD pipelines
-   Security scanning
-   Load testing
-   Deployment troubleshooting
-   Incident response
-   Monitoring
-   Logging
-   Production debugging

By the end of Phase 1, the application should function correctly in a
local development environment and provide a stable baseline for all
subsequent engineering exercises.
