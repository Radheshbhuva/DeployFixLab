# Nginx Configuration Guide

# Purpose

Configure Nginx as the entry point for DeployFix Lab to serve the
frontend and reverse proxy API requests to the backend.

## Responsibilities

-   Serve React static files
-   Reverse proxy API traffic
-   Centralize incoming requests
-   Improve security
-   Prepare for HTTPS

## Request Flow

``` text
Browser
   │
   ▼
Nginx
├── /        → Frontend
└── /api/*   → Backend
```

## Core Configuration

-   Listen on port 80
-   Serve built frontend assets
-   Proxy `/api` requests
-   Forward client headers
-   Enable compression
-   Custom error pages

## Reverse Proxy Rules

Frontend: - `/`

Backend: - `/api`

Health: - `/health`

## Security Recommendations

-   Hide server tokens
-   Security headers
-   Request size limits
-   Rate limiting (future)
-   HTTPS ready

## Logging

-   Access log
-   Error log

## Performance

-   Gzip compression
-   Browser caching
-   Keep-alive connections

## Validation Checklist

-   Frontend loads through Nginx
-   API requests reach backend
-   Static assets resolve
-   No 502/504 errors
-   Health endpoint responds

## Common Problems

-   Wrong upstream hostname
-   Incorrect proxy path
-   Missing frontend build
-   Port mismatch
-   Docker network misconfiguration
-   Cache issues

## Deliverables

-   nginx.conf
-   Dockerfile
-   Reverse proxy documentation
-   Testing checklist
