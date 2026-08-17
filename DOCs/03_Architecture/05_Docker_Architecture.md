# 05 — Docker Architecture Specification

---

## Document Metadata

| Field               | Value                                                             |
|---------------------|-------------------------------------------------------------------|
| **Document Name**   | Docker Architecture Specification                                 |
| **Document ID**     | DFIX-ARCH-005                                                     |
| **Version**         | 1.0.0                                                             |
| **Status**          | Approved                                                          |
| **Owner**           | DevOps & Infrastructure Lead                                      |
| **Reviewer**        | Technical Lead, Principal Architect                               |
| **Classification**  | Internal — Confidential                                           |
| **Created Date**    | 2026-08-02                                                        |
| **Last Updated**    | 2026-08-06                                                        |
| **Project**         | DeployFix Lab                                                     |
| **Project Code**    | DFIX                                                              |

---

# 1. Containerization & Orchestration Strategy

**DeployFix Lab** utilizes **Docker** and **Docker Compose (v2)** to instantiate a containerized multi-container deployment environment. Every micro-service (`frontend`, `backend`, `postgres`, `nginx`) runs within isolated container instances attached to an internal bridge network (`dfix-net`).

## 1.1 Multi-Stage Dockerfile Architecture
Both Frontend and Backend leverage multi-stage builds to minimize image sizes, strip build-time toolchains, and enhance security posture:

```
[ Stage 1: Dependencies (npm ci) ]
               │
               ▼
[ Stage 2: Builder (tsc / vite build) ]
               │
               ▼
[ Stage 3: Runner (Alpine / Non-root User) ]  <-- Final Image (<120MB)
```

---

# 2. Docker Compose Infrastructure Specification (`docker-compose.yml`)

```yaml
version: '3.8'

networks:
  dfix-net:
    driver: bridge

volumes:
  pg_data:
    driver: local

services:
  nginx:
    build:
      context: ./nginx
      dockerfile: Dockerfile
    ports:
      - "80:80"
      - "443:443"
    depends_on:
      backend:
        condition: service_healthy
    networks:
      - dfix-net
    restart: unless-stopped

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    environment:
      NODE_ENV: production
      DATABASE_URL: postgresql://dfix_user:secret@postgres:5432/deployfix_db
    networks:
      - dfix-net
    depends_on:
      postgres:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:5000/health/liveness"]
      interval: 10s
      timeout: 5s
      retries: 3

  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: dfix_user
      POSTGRES_PASSWORD: secretpassword
      POSTGRES_DB: deployfix_db
    volumes:
      - pg_data:/var/lib/postgresql/data
    networks:
      - dfix-net
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U dfix_user -d deployfix_db"]
      interval: 5s
      timeout: 5s
      retries: 5
```

---

# 3. Security & Hardening Controls

1. **Non-Root User Execution:** Container processes execute as UID `10001` (`USER node` / `USER app`) rather than root (`UID 0`).
2. **Read-Only Root Filesystem:** Root filesystems are mounted read-only (`read_only: true`), with ephemeral writes redirected to `/tmp` RAM disks (`tmpfs`).
3. **Resource Limits:** CPU and Memory caps enforced per container (`cpus: '0.50'`, `memory: 512M`).
