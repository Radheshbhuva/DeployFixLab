# Environment Variables & Secrets Specification

**Document Name:** Environment & Secrets Specification  
**Document ID:** DEP-PROMPT-002  
**Version:** 1.0.0  
**Category:** Security & Configuration  
**Status:** Approved  

---

## 1. Frontend Environment Variables (`frontend/.env.production`)

All frontend variables must begin with the `VITE_` prefix to be exposed to the client bundle by Vite.

| Variable Name | Required | Default / Example Value | Description |
|---|---|---|---|
| `VITE_API_URL` | Yes | `https://deployfix-api.onrender.com/api` | Base URL for Express backend REST API endpoints |
| `VITE_WS_URL` | Yes | `wss://deployfix-api.onrender.com` | Base URL for WebSocket live log and terminal streams |
| `VITE_SUPABASE_URL` | Yes | `https://qedrwezcgjdxfyqqeyfm.supabase.co` | Supabase Cloud API Gateway endpoint |
| `VITE_SUPABASE_ANON_KEY` | Yes | `sb_publishable_q9dtY-BGtHHKE8qAgAM2mg_k54MTMcB` | Public client publishable API key |
| `VITE_ENV` | Optional | `production` | Environment name badge |

---

## 2. Backend Environment Variables (`backend/.env.production`)

Backend variables contain private secrets and must NEVER be exposed to the frontend or committed to git.

| Variable Name | Required | Example / Format | Purpose |
|---|---|---|---|
| `PORT` | Yes | `5000` | Port on which Express HTTP server listens |
| `NODE_ENV` | Yes | `production` | Enables production optimizations and secure cookie flags |
| `DATABASE_URL` | Yes | `postgresql://postgres.[REF]:[PASS]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true` | Supabase Transaction Pooler connection string for Prisma ORM |
| `DIRECT_URL` | Yes | `postgresql://postgres.[REF]:[PASS]@aws-0-[REGION].pooler.supabase.com:5432/postgres` | Direct PostgreSQL connection string for Prisma schema migrations |
| `JWT_SECRET` | Yes | `crypto.randomBytes(64).toString('hex')` | Symmetric secret key for signing short-lived access JWT tokens |
| `JWT_REFRESH_SECRET` | Yes | `crypto.randomBytes(64).toString('hex')` | Symmetric secret key for signing long-lived refresh tokens |
| `JWT_EXPIRES_IN` | Optional | `15m` | Access token lifespan |
| `JWT_REFRESH_EXPIRES_IN` | Optional | `7d` | Refresh token lifespan |
| `CORS_ORIGIN` | Yes | `https://deployfixlab.vercel.app` | Whitelist for Cross-Origin Resource Sharing |
| `GEMINI_API_KEY` | Optional | `AIzaSy...` | API key for Google Gemini AI diagnosis reasoning |

---

## 3. GitHub Secrets for CI/CD Deployment (`Settings > Secrets and variables > Actions`)

| Secret Name | Platform | Description |
|---|---|---|
| `VERCEL_TOKEN` | Vercel | Personal Access Token for Vercel CLI deployments |
| `VERCEL_ORG_ID` | Vercel | Vercel organization ID |
| `VERCEL_PROJECT_ID` | Vercel | Vercel project ID |
| `RENDER_API_KEY` | Render | API key for triggering Render backend deploys via webhook or CLI |
| `RENDER_SERVICE_ID` | Render | Unique service identifier for backend web service |
| `SUPABASE_ACCESS_TOKEN` | Supabase | Supabase management API token for running CI migrations |
| `SUPABASE_DB_PASSWORD` | Supabase | Database password for direct migration runner |
