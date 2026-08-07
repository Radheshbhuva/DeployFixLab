# 03 — Docker Compose Orchestration Guide

---

## Document Metadata

| Field               | Value                                                             |
|---------------------|-------------------------------------------------------------------|
| **Document Name**   | Docker Compose Orchestration Guide                                |
| **Document ID**     | DFIX-DOC-003                                                      |
| **Version**         | 1.0.0                                                             |
| **Status**          | Approved                                                          |
| **Owner**           | DevOps Lead                                                       |
| **Reviewer**        | Full Engineering Team                                             |
| **Classification**  | Internal — Confidential                                           |
| **Created Date**    | 2026-08-02                                                        |
| **Last Updated**    | 2026-08-07                                                        |
| **Project**         | DeployFix Lab                                                     |
| **Project Code**    | DFIX                                                              |

---

# 1. Master Docker Compose Specification (`docker-compose.yml`)

Docker Compose orchestrates the 4 container services (`nginx`, `backend`, `postgres`, `chaos`):

```yaml
version: '3.8'

networks:
  dfix-net:
    driver: bridge

volumes:
  dfix_pg_data:
    driver: local

services:
  nginx:
    build: ./nginx
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
    build: ./backend
    environment:
      NODE_ENV: production
      DATABASE_URL: postgresql://dfix:secret@postgres:5432/deployfix_db
    depends_on:
      postgres:
        condition: service_healthy
    networks:
      - dfix-net
    restart: unless-stopped

  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: dfix
      POSTGRES_PASSWORD: secret
      POSTGRES_DB: deployfix_db
    volumes:
      - dfix_pg_data:/var/lib/postgresql/data
    networks:
      - dfix-net
    restart: unless-stopped
```
