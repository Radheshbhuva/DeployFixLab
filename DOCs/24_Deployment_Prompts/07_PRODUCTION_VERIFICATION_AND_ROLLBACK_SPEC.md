# Production Verification & Rollback Specification

**Document Name:** Production Verification & Rollback Specification  
**Document ID:** DEP-PROMPT-007  
**Version:** 1.0.0  
**Category:** SRE & Incident Response  
**Status:** Approved  

---

## 1. Post-Deployment Smoke Verification Protocol

Immediately after every production deployment, execute the following 5-point verification check:

```
[Step 1: Healthcheck Probe] ───► GET /health (HTTP 200, DB connected, <50ms latency)
             │
[Step 2: Frontend Bundle]   ───► GET / (Assets load, status dot nominal 99.98%)
             │
[Step 3: Auth Flow]         ───► POST /api/auth/login (JWT token issued, redirect to /dashboard)
             │
[Step 4: Sandbox Launch]    ───► POST /api/labs/lab-01/start (Sandbox container booted)
             │
[Step 5: WebSocket Stream]  ───► WS /ws/logs/containers (Telemetry stream connected)
```

---

## 2. Automated Rollback Triggers & Thresholds

An immediate automated rollback to the previous stable release commit is triggered if:

1. **Healthcheck Failure:** `GET /health` returns HTTP 5xx or database disconnection for $> 60$ seconds.
2. **Crash Loop:** Backend process restarts $> 3$ times within 5 minutes.
3. **5xx Error Rate Spike:** API gateway error rate exceeds $2.0\%$ over a 3-minute sliding window.
4. **Client Asset 404s:** Vercel edge reporting missing chunk assets after cache purge.

---

## 3. Emergency Rollback Procedures

### Frontend Rollback (Vercel):
```bash
# Instant rollback to previous deployment using Vercel CLI
vercel rollback [DEPLOYMENT_ID] --token=$VERCEL_TOKEN
```
*Alternatively: Go to Vercel Dashboard $\rightarrow$ Deployments $\rightarrow$ Select prior successful deployment $\rightarrow$ Click "Promote to Production".*

### Backend Rollback (Render / Git):
```bash
# Revert deployment commit on master branch
git revert HEAD -m 1
git push origin master-trial.Radhesh
```
*Alternatively: Go to Render Dashboard $\rightarrow$ Deploys $\rightarrow$ Select prior successful build $\rightarrow$ Click "Rollback".*

### Database Migration Rollback (Supabase / Prisma):
```bash
# Apply down migration script
cd backend
npx prisma migrate resolve --rolled-back [MIGRATION_NAME]
```
