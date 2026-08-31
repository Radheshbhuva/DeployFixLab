# DeployFix Lab — Application Deployment & Infrastructure Guide

This directory contains container orchestration, cloud configurations, and deployment blueprints for DeployFix Lab.

---

## 📁 Directory Architecture

```
Application/
├── backend/            # Express, TypeScript, Prisma ORM, WebSockets
├── frontend/           # Vite, React 18, TailwindCSS, Zustand
└── deployment/         # Container orchestration & cloud configs
    ├── docker-compose.yml   # Multi-service local & staging orchestration
    ├── render.yaml          # Render Cloud backend blueprint
    └── README.md            # Deployment reference guide
```

---

## 🚀 Local Multi-Container Deployment

Run the complete multi-service ecosystem (Backend, Frontend, PostgreSQL, Redis) with a single command:

```bash
# Navigate to deployment directory
cd Application/deployment

# Start all containers in background
docker compose up -d

# View running container states
docker compose ps

# Tail all logs
docker compose logs -f
```

### Services & Port Mappings

| Service | Technology | Port | Description |
|---|---|---|---|
| **Frontend** | React / Vite SPA | `5173` | SRE Interactive Studio UI |
| **Backend** | Express / Prisma | `5000` | REST API & Real-time WebSockets |
| **PostgreSQL** | Postgres 16 Alpine | `5432` | Relational storage & lab telemetry |
| **Redis** | Redis 7 Alpine | `6379` | Ephemeral caching & log buffers |

---

## ☁️ Cloud Production Deployment

### 1. Frontend → Vercel
- **Root Directory:** `Application/frontend`
- **Framework Preset:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`

### 2. Backend → Render Web Service
- **Root Directory:** `Application/backend`
- **Environment:** Node.js 20
- **Build Command:** `npm install && npx prisma generate && npm run build`
- **Start Command:** `npm run start`
- **Health Check Path:** `/health`
