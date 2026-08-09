# 01 — DeployFix Lab Portfolio Showcase

---

## Document Metadata

| Field               | Value                                                             |
|---------------------|-------------------------------------------------------------------|
| **Document Name**   | DeployFix Lab Portfolio Showcase                                  |
| **Document ID**     | DFIX-PORT-001                                                     |
| **Version**         | 1.0.0                                                             |
| **Status**          | Approved                                                          |
| **Owner**           | Lead Developer / Portfolio Author                                 |
| **Reviewer**        | Technical Reviewer                                                |
| **Classification**  | Public / Portfolio                                                |
| **Created Date**    | 2026-08-02                                                        |
| **Last Updated**    | 2026-08-09                                                        |
| **Project**         | DeployFix Lab                                                     |
| **Project Code**    | DFIX                                                              |

---

# DeployFix Lab — Hands-On DevOps & Container Chaos Laboratory

[![React](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Vite-61DAFB?logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20v20%20%2B%20Express-339933?logo=node.js)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL%2016-4169E1?logo=postgresql)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Containers-Docker%20Compose-2496ED?logo=docker)](https://www.docker.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## 📌 Project Overview

**DeployFix Lab** is an interactive, full-stack web application and DevOps chaos engineering platform designed to train developers, SREs, and DevOps engineers in real-world container failure diagnosis, log analysis, and system recovery.

The application intentionally injects infrastructure anomalies—such as database connection pool starvation, proxy routing mismatches, memory leaks, and broken environment variables—into an isolated multi-container stack. Users diagnose these failures through interactive dashboards, inspect real-time container logs, and submit code or configuration fixes to earn verification badges.

---

## ✨ Key Features

- 🛠️ **Real-World Chaos Engine:** Injects realistic infrastructure failures into isolated container environments.
- 📊 **Real-Time Telemetry & Log Viewer:** Live stdout/stderr log streaming via WebSockets and structured JSON parsing.
- 🔐 **Secure Role-Based Access Control (RBAC):** JWT access tokens paired with HttpOnly refresh cookies.
- 🎓 **Interactive Lab Catalog:** Guided troubleshooting scenarios ranging from basic misconfigurations to complex networking dropouts.
- 🏆 **Automated Verification Probes:** Automated health probes test user fixes and issue instant verification badges upon resolution.

---

## 🏗️ Technical Architecture Overview

```
[ Nginx Reverse Proxy (Ports 80/443) ]
                 │
                 ├──► [ React 18 + Vite SPA (Client Frontend) ]
                 │
                 └──► [ Express API + TypeScript (Backend Server) ]
                                 │
                                 ├──► [ PostgreSQL 16 DB (Prisma ORM) ]
                                 │
                                 └──► [ Chaos Failure Engine Driver ]
```

---

## ⚡ Quickstart Guide

### Prerequisites
- Docker Engine 24.0+ & Docker Compose v2+
- Node.js v20+ (for local CLI development)

### Running Locally with Docker Compose

```bash
# 1. Clone the repository
git clone https://github.com/Radheshbhuva/DeployFixLab.git
cd DeployFixLab

# 2. Start the containerized stack
docker-compose up -d --build

# 3. Access the application
# Frontend Dashboard: http://localhost
# Backend Health Check: http://localhost/api/v1/health/liveness
```

---

## 🤝 Contact & Author

- **Author:** Radhesh Bhuva
- **GitHub:** [https://github.com/Radheshbhuva](https://github.com/Radheshbhuva)
- **Repository:** [https://github.com/Radheshbhuva/DeployFixLab](https://github.com/Radheshbhuva/DeployFixLab)
