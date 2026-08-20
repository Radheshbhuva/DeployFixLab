# Master Deployment Brief — DeployFix Lab Production Architecture

**Document Name:** Master Deployment Brief  
**Document ID:** DEP-PROMPT-000  
**Version:** 1.0.0  
**Category:** Deployment Architecture  
**Status:** Approved  
**Target Environment:** Staging & Production (Vercel + Render + Supabase)  

---

## 1. System Deployment Architecture Overview

DeployFix Lab is architected as a decoupled, multi-tier cloud application comprising:

```
                  ┌──────────────────────────────────────────────────┐
                  │                 Internet / Users                 │
                  └──────────────┬───────────────────┬───────────────┘
                                 │                   │
                     HTTPS (443) │                   │ HTTPS (443)
                                 ▼                   ▼
                  ┌────────────────────────┐  ┌────────────────────────┐
                  │     Frontend Tier      │  │      Backend Tier      │
                  │   Vercel Edge (SPA)    │  │ Render / Railway (Node)│
                  │ React 18 + TS + Vite   │  │ Express + TypeScript   │
                  └──────────────┬─────────┘  └──────────────┬─────────┘
                                 │                           │
                                 │ REST API & WebSocket      │
                                 │ (cors: frontend domain)   │
                                 └───────────────┬───────────┘
                                                 │
                                                 │ PostgreSQL (Pooler :6543)
                                                 ▼
                                  ┌─────────────────────────────┐
                                  │        Database Tier        │
                                  │    Supabase Managed DB      │
                                  │ PostgreSQL + Prisma ORM     │
                                  └─────────────────────────────┘
```

---

## 2. Infrastructure Platform Matrix

| Layer | Platform | Purpose | Scaling Model | Config Files |
|---|---|---|---|---|
| **Frontend** | **Vercel** | SPA static hosting, CDN caching, client-side routing rewrites | Global Edge CDN | `frontend/vercel.json`, `frontend/vite.config.ts` |
| **Backend** | **Render / Railway** | Express REST API Gateway, WebSocket telemetry stream, JWT auth | Horizontal Autoscale | `backend/render.yaml`, `backend/Dockerfile` |
| **Database** | **Supabase** | Managed PostgreSQL 16 database, connection pooling, real-time sync | Managed Cloud Cluster | `backend/prisma/schema.prisma` |
| **CI / CD** | **GitHub Actions** | Automated type checking, unit tests, Docker build, and deployment dispatch | Serverless Runners | `.github/workflows/ci.yml`, `deploy.yml` |

---

## 3. Core Deployment Objectives & Non-Negotiables

1. **Zero Secret Leakage:** No environment variables or credentials committed to git; all secrets injected via cloud dashboard or GitHub Secrets.
2. **Client-Side SPA Routing Integrity:** `vercel.json` configured with rewrite rule `/(.*) -> /index.html` so direct deep links (`/labs/lab-01`, `/dashboard`, `/login`) resolve without 404s.
3. **Database Connection Pooling:** Prisma configured with Supabase PgBouncer Transaction Pooler (`port 6543`) with `?pgbouncer=true` for serverless API requests and Direct URL (`port 5432`) for schema migrations.
4. **CORS & Cookie Security:** Express backend CORS whitelist strictly configured for the frontend production domain with `credentials: true`.
5. **Healthcheck & Telemetry:** Dedicated `/health` endpoint returning database handshake status, container uptime, and system memory metrics.
