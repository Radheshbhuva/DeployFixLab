# Deployment Implementation Plan — Step-by-Step Execution Guide

**Document Name:** Deployment Implementation Plan  
**Document ID:** DEP-PROMPT-001  
**Version:** 1.0.0  
**Category:** Implementation Roadmap  
**Status:** Approved  

---

## 1. Phased Deployment Milestones

```
Phase 1: Environment & Secrets Matrix Setup
    │
    ▼
Phase 2: Database Schema & Migration on Supabase
    │
    ▼
Phase 3: Express Backend Gateway Deployment on Render
    │
    ▼
Phase 4: Vite React SPA Deployment on Vercel
    │
    ▼
Phase 5: GitHub Actions CI/CD Pipeline Automation
    │
    ▼
Phase 6: Production Smoke Testing & Health Monitoring
```

---

## 2. Milestone Details & Action Items

### Phase 1: Environment & Secrets Matrix Setup
- Create standardized `.env.example` files for both frontend and backend.
- Define required production environment variables:
  - Frontend: `VITE_API_URL`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_WS_URL`.
  - Backend: `PORT`, `DATABASE_URL`, `DIRECT_URL`, `JWT_SECRET`, `JWT_REFRESH_SECRET`, `CORS_ORIGIN`, `NODE_ENV`.
- Configure repository secrets in GitHub for CI/CD runners.

### Phase 2: Database Schema & Migrations on Supabase
- Verify Supabase project credentials and connection pooling endpoints.
- Execute `npx prisma migrate deploy` to create all PostgreSQL tables (`User`, `Lab`, `LabSession`, `Incident`, `ActivityLog`).
- Run seed script (`npx prisma db seed` or SQL script) to populate initial demo accounts and chaos scenarios.

### Phase 3: Express Backend Gateway Deployment (Render / Railway)
- Create `backend/render.yaml` infrastructure-as-code blueprint.
- Configure healthcheck endpoint at `GET /health` responding with 200 OK and latency metrics.
- Set build command: `npm install && npm run build && npx prisma generate`.
- Set start command: `npm run start` (`node dist/server.js`).
- Verify CORS allowed origins include Vercel production domain.

### Phase 4: Vite React SPA Deployment (Vercel)
- Create `frontend/vercel.json` with SPA routing rewrites:
  ```json
  {
    "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
  }
  ```
- Configure build command: `npm run build` and output directory: `dist`.
- Injected production environment variables into Vercel Project Settings.
- Verify that client-side page refreshes on deep routes (`/labs/lab-01`, `/dashboard`) do not yield 404 errors.

### Phase 5: CI/CD Pipeline Automation
- Create `.github/workflows/ci.yml` to run automated type checking (`tsc --noEmit`), linting, and unit tests on PRs to `main` / `master-trial.Radhesh`.
- Create `.github/workflows/deploy.yml` to trigger automatic preview and production deployments.

### Phase 6: Production Smoke Testing & Verification
- Perform end-to-end user verification:
  1. Visit Landing page (`/`) $\rightarrow$ Click Sign In.
  2. Log in with demo credentials $\rightarrow$ Redirect to `/dashboard`.
  3. Launch Chaos Lab $\rightarrow$ Run terminal commands $\rightarrow$ Verify solution.
  4. Test AI Diagnosis Studio $\rightarrow$ Ingest context $\rightarrow$ Generate unified diff patch.
  5. Check Live Log Streamer $\rightarrow$ Verify real-time WebSocket connection.
