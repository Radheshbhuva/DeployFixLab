# 06 — Cloud Architecture & Infrastructure Specification

---

## Document Metadata

| Field               | Value                                                             |
|---------------------|-------------------------------------------------------------------|
| **Document Name**   | Cloud Architecture & Infrastructure Specification                 |
| **Document ID**     | DFIX-ARCH-006                                                     |
| **Version**         | 1.0.0                                                             |
| **Status**          | Approved                                                          |
| **Owner**           | Cloud Architect                                                   |
| **Reviewer**        | Technical Lead, DevOps Engineer                                   |
| **Classification**  | Internal — Confidential                                           |
| **Created Date**    | 2026-08-02                                                        |
| **Last Updated**    | 2026-08-06                                                        |
| **Project**         | DeployFix Lab                                                     |
| **Project Code**    | DFIX                                                              |

---

DeployFix Lab supports single-node VPS deployment (AWS EC2 / DigitalOcean Droplet / Hetzner) or container platform deployment (Railway / Render / AWS Lightsail) using Docker Compose.

```
                     Cloud Application Infrastructure
                                    │
                                    ▼
                         Express Backend Service
                                    │
                                    ▼
                              Prisma Client
                                    │
                                    ▼
                          Supabase PostgreSQL
```

* **Cloud Database Provider:** **Supabase PostgreSQL** is the official managed cloud database provider for production and staging environments.
* **Database Connection Abstraction:** The backend application connects to Supabase PostgreSQL over TLS via the standard `DATABASE_URL` environment variable.
* **Cloud Administration:** Visual inspection, schema monitoring, and administrative tasks in cloud environments are performed via **Supabase Dashboard / Supabase Studio**.
* **Local vs Cloud Isolation:** Local development utilizes Dockerized PostgreSQL to preserve container failure troubleshooting labs, while cloud environments target Supabase PostgreSQL for managed availability.

---

# 2. Network Security & Firewall Policies

| Inbound Port | Protocol | Source | Purpose |
|---|---|---|---|
| **80** | TCP | 0.0.0.0/0 | HTTP Traffic (Auto-redirected to 443) |
| **443** | TCP | 0.0.0.0/0 | HTTPS Encrypted Web Traffic |
| **22** | TCP | Admin IP Range | SSH Remote Host Management |

---

# 3. SSL / TLS Certificate Management

Automated certificate issuance and renewal via **Let's Encrypt** and **Certbot** running in an ephemeral sidecar container:
* HTTP-01 ACME challenge handled by Nginx location block `/.well-known/acme-challenge/`.
* Automatic 60-day renewal cron trigger (`certbot renew --quiet`).
