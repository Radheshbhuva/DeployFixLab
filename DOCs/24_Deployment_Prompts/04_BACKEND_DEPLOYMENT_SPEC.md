# Backend Deployment Specification — Render / Railway / Docker

**Document Name:** Backend Deployment Specification  
**Document ID:** DEP-PROMPT-004  
**Version:** 1.0.0  
**Category:** Backend Cloud Hosting  
**Status:** Approved  

---

## 1. Render Infrastructure-as-Code (`backend/render.yaml`)

DeployFix Lab Express backend can be automatically deployed to Render using a declarative Blueprint specification:

```yaml
services:
  - type: web
    name: deployfix-backend-api
    runtime: node
    plan: starter
    region: oregon
    rootDir: backend
    buildCommand: npm install && npx prisma generate && npm run build
    startCommand: npm run start
    healthCheckPath: /health
    autoDeploy: true
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 5000
      - key: DATABASE_URL
        sync: false
      - key: DIRECT_URL
        sync: false
      - key: JWT_SECRET
        generateValue: true
      - key: JWT_REFRESH_SECRET
        generateValue: true
      - key: CORS_ORIGIN
        value: https://deployfixlab.vercel.app
```

---

## 2. Multi-Stage Production Dockerfile (`backend/Dockerfile`)

For containerized cloud platforms (Render, Railway, Fly.io, or AWS ECS), use a lightweight multi-stage Docker build:

```dockerfile
# Stage 1: Build & TypeScript Compilation
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci

COPY . .

RUN npx prisma generate
RUN npm run build

# Stage 2: Production Runtime
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

# Security: Run as non-root user
USER node

COPY --chown=node:node package*.json ./
COPY --chown=node:node prisma ./prisma/

RUN npm ci --only=production && npm cache clean --force

COPY --chown=node:node --from=builder /app/dist ./dist
COPY --chown=node:node --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --chown=node:node --from=builder /app/node_modules/@prisma ./node_modules/@prisma

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/health || exit 1

CMD ["node", "dist/server.js"]
```

---

## 3. Graceful Shutdown & Process Signal Handling

In production environments, containers receive `SIGTERM` when scaling down or deploying updates. The backend must close active connections gracefully:

```typescript
// backend/src/server.ts
const server = app.listen(PORT, () => {
  console.log(`DeployFix Backend listening on port ${PORT}`);
});

const gracefulShutdown = (signal: string) => {
  console.log(`Received ${signal}. Shutting down gracefully...`);
  server.close(async () => {
    console.log('HTTP server closed.');
    await prisma.$disconnect();
    console.log('Database connections closed. Exiting process.');
    process.exit(0);
  });

  // Force shutdown after 10s if connections remain open
  setTimeout(() => {
    console.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
```
