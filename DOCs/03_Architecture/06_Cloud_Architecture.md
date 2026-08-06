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

# 1. Cloud Hosting Topology Overview

DeployFix Lab supports single-node VPS deployment (AWS EC2 / DigitalOcean Droplet / Hetzner) or container platform deployment (Railway / Render / AWS Lightsail) using Docker Compose.

```
[ Internet Client ]
        │ (Port 80 / 443)
        ▼
┌─────────────────────────────────────────────────────────────┐
│ Cloud Virtual Private Cloud (VPC / Security Group)         │
│                                                             │
│  [ AWS Security Group / UFW Firewall (80, 443, 22) ]        │
│                         │                                   │
│                         ▼                                   │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ Host Instance (Ubuntu 22.04 LTS LTS)                  │  │
│  │                                                       │  │
│  │  [ Docker Engine Runtime ]                            │  │
│  │                                                       │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │ Docker Compose Stack (Nginx ➔ App ➔ Postgres)   │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

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
