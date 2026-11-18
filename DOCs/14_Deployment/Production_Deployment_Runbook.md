# DeployFix Lab — Production Deployment Runbook & Checklist

**Document ID:** DFIX-DEP-003  
**Status:** Ready for Production  
**Last Updated:** November 2026  

---

## 🚀 1. Deployment Architecture Summary

DeployFix Lab supports two production-ready deployment targets:

| Component | Target A: Cloud Serverless / Managed PaaS | Target B: Self-Hosted / Cloud VM (Docker Compose) |
|---|---|---|
| **Frontend SPA** | **Vercel** (`https://deployfixlab.vercel.app`) | NGINX Alpine Container (`:80` / `:5173`) |
| **Backend REST & WS** | **Render Web Service** (`https://deployfix-api.onrender.com`) | Node.js 20 Alpine Container (`:5000`) |
| **Database** | **Supabase Managed PostgreSQL** (AWS Pooler `:6543`) | PostgreSQL 16 Alpine Container (`:5432`) |
| **Cache & Realtime** | In-Memory / Supabase Realtime | Redis 7 Alpine Container (`:6379`) |

---

## ☁️ 2. Cloud Deployment (Vercel + Render + Supabase)

### Step 1: Database Setup (Supabase)
1. In your Supabase Project (`Settings -> Database`), retrieve:
   - **Transaction Pooler URL** (Port `6543`, `pgbouncer=true`): Set as `DATABASE_URL`
   - **Direct Connection URL** (Port `5432`): Set as `DIRECT_URL`
2. Run database migrations from local terminal:
   ```bash
   cd Application/backend
   DATABASE_URL="<YOUR_POOLER_URL>" DIRECT_URL="<YOUR_DIRECT_URL>" npx prisma migrate deploy
   ```
3. (Optional) Seed initial RBAC roles and default test accounts:
   ```bash
   DATABASE_URL="<YOUR_POOLER_URL>" DIRECT_URL="<YOUR_DIRECT_URL>" npx prisma db seed
   ```

### Step 2: Backend Deployment (Render)
DeployFix Lab includes root and backend `render.yaml` Blueprints:
1. Go to [Render Dashboard](https://dashboard.render.com/) -> **New** -> **Blueprint**.
2. Select repository `Radheshbhuva/DeployFixLab`.
3. Render automatically picks up `render.yaml` from root:
   - **Service Name:** `deployfix-api`
   - **Root Directory:** `Application/backend`
   - **Runtime:** `Node`
   - **Build Command:** `npm install && npx prisma generate && npm run build`
   - **Start Command:** `npx prisma migrate deploy && npm run start`
   - **Health Check Path:** `/health`
4. Set the following environment variables in Render Dashboard:
   - `DATABASE_URL`: Your Supabase pooler connection string
   - `DIRECT_URL`: Your Supabase direct connection string
   - `JWT_SECRET`: Random 64-character secret
   - `JWT_REFRESH_SECRET`: Random 64-character secret
   - `CORS_ORIGIN`: `https://deployfixlab.vercel.app` (or your custom frontend domain)

### Step 3: Frontend Deployment (Vercel)
1. Go to [Vercel Dashboard](https://vercel.com/) -> **Add New** -> **Project**.
2. Import repository `Radheshbhuva/DeployFixLab`.
3. Configure Project Settings:
   - **Root Directory:** `Application/frontend`
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Configure Environment Variables in Vercel:
   - `VITE_API_URL`: `https://deployfix-api.onrender.com/api`
   - `VITE_WS_URL`: `wss://deployfix-api.onrender.com`
   - `VITE_ENVIRONMENT`: `production`
   - `VITE_ENABLE_AI_DIAGNOSIS`: `true`
   - `VITE_ENABLE_CHAOS_PANEL`: `true`
   - `VITE_SUPABASE_URL`: Your Supabase URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase Anon Key
5. Click **Deploy**.

---

## 🐳 3. Local & Self-Hosted Deployment (Docker Compose)

Deploy the entire isolated multi-service stack with a single command from the project root:

```bash
# 1. Copy environment template
cp .env.example .env

# 2. Build and launch all 4 containers in background
docker compose up -d --build

# 3. Verify running services
docker compose ps

# 4. View live logs
docker compose logs -f
```

### Port Mappings
- **Frontend SPA:** `http://localhost:5173` or `http://localhost:80`
- **Backend API & WebSockets:** `http://localhost:5000`
- **PostgreSQL Database:** `localhost:5432`
- **Redis Cache:** `localhost:6379`

---

## 🔐 4. GitHub Actions CI/CD Secrets Setup

To enable automated production deployments on push to `main`, set the following repository secrets in GitHub (`Settings -> Secrets and variables -> Actions`):

| Secret Name | Description | Source |
|---|---|---|
| `VERCEL_TOKEN` | Vercel Personal Access Token | Vercel Account Settings -> Tokens |
| `VERCEL_ORG_ID` | Vercel Team / Account ID | `.vercel/project.json` or Project Settings |
| `VERCEL_PROJECT_ID` | Vercel Project ID | Project Settings -> General |
| `RENDER_SERVICE_ID` | Render Backend Service ID | Render Service URL (`srv-xxxx`) |
| `RENDER_DEPLOY_HOOK_URL` | Render Deploy Hook URL | Render Service Settings -> Deploy Hook |

---

## 🩺 5. Post-Deployment Verification Probes

Once deployed, verify operational readiness using the health probes:

```bash
# 1. Backend Liveness Probe
curl -f https://deployfix-api.onrender.com/live
# Expected: {"status":"ok"}

# 2. Backend Health & Database Probe
curl -f https://deployfix-api.onrender.com/health
# Expected: {"status":"ok", "database":{"connected":true}, ...}

# 3. Frontend Bundle Probe
curl -I https://deployfixlab.vercel.app
# Expected: HTTP/2 200
```

---

## 👥 6. Seeded Demo Accounts (for verification)

| Role | Email | Password |
|---|---|---|
| **Admin / Commander** | `admin@deployfix.lab` | `Password123!` |
| **Instructor SRE** | `instructor@deployfix.lab` | `Password123!` |
| **Student Engineer** | `student@deployfix.lab` | `Password123!` |

