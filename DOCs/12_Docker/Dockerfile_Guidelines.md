# 02 — Dockerfile Authoring & Multi-Stage Standard

---

## Document Metadata

| Field               | Value                                                             |
|---------------------|-------------------------------------------------------------------|
| **Document Name**   | Dockerfile Authoring & Multi-Stage Standard                       |
| **Document ID**     | DFIX-DOC-002                                                      |
| **Version**         | 1.0.0                                                             |
| **Status**          | Approved                                                          |
| **Owner**           | DevOps Lead                                                       |
| **Reviewer**        | Full Development Team                                             |
| **Classification**  | Internal — Confidential                                           |
| **Created Date**    | 2026-08-02                                                        |
| **Last Updated**    | 2026-08-07                                                        |
| **Project**         | DeployFix Lab                                                     |
| **Project Code**    | DFIX                                                              |

---

# 1. Multi-Stage Dockerfile Pattern

All Dockerfiles MUST use 3-stage multi-stage builds (`Deps` -> `Builder` -> `Runner`) using official Alpine Linux base images (`node:20-alpine`) to keep image sizes minimal (<120MB) and secure.

```dockerfile
# Stage 1: Dependencies
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Stage 2: Builder
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Stage 3: Runner
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup -g 10001 -S nodejs && adduser -S nodejs -u 10001
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
USER nodejs
EXPOSE 5000
CMD ["node", "dist/server.js"]
```
