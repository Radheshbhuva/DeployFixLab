# Coding Standards

**Document ID:** ENG-STD-005

## Purpose

Define coding conventions for DeployFix Lab.

## General Principles

-   Write readable, maintainable code.
-   Follow SOLID principles.
-   Prefer composition over inheritance.
-   Keep functions small and focused.

## TypeScript

-   Enable strict mode.
-   Avoid `any`.
-   Use interfaces/types consistently.

## React

-   Functional components only.
-   One component per file.
-   Custom hooks for reusable logic.
-   Keep UI and business logic separated.

## Express

-   Layered architecture: Routes → Controllers → Services →
    Repositories.
-   Centralized error handling.
-   Validate all inputs.

## Database

-   Prisma ORM.
-   Descriptive schema names.
-   No raw SQL unless justified.

## Logging

-   Structured logging with Winston.
-   No sensitive information in logs.

## Security

-   JWT authentication.
-   bcrypt password hashing.
-   Validate all external input.

## Code Review Checklist

-   Readability
-   Tests
-   Error handling
-   Security
-   Documentation
