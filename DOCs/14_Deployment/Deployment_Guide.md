# 01 — Master Production Deployment Guide

---

## Document Metadata

| Field               | Value                                                             |
|---------------------|-------------------------------------------------------------------|
| **Document Name**   | Master Production Deployment Guide                                |
| **Document ID**     | DFIX-DEP-001                                                      |
| **Version**         | 1.0.0                                                             |
| **Status**          | Approved                                                          |
| **Owner**           | DevOps Lead                                                       |
| **Reviewer**        | Technical Lead, Principal Architect                               |
| **Classification**  | Internal — Confidential                                           |
| **Created Date**    | 2026-08-02                                                        |
| **Last Updated**    | 2026-08-07                                                        |
| **Project**         | DeployFix Lab                                                     |
| **Project Code**    | DFIX                                                              |

---

# 1. Master Production Deployment Procedure

Deploying **DeployFix Lab** to an Ubuntu 22.04 LTS cloud host instance:

1. **Clone Repository:**
   ```bash
   git clone https://github.com/Radheshbhuva/DeployFixLab.git /opt/deployfixlab
   cd /opt/deployfixlab
   ```
2. **Configure Environment Variables:**
   ```bash
   cp .env.example .env
   nano .env
   ```
3. **Launch Containerized Stack:**
   ```bash
   docker-compose -f docker-compose.yml up -d --build
   ```
4. **Verify Health Probes:**
   ```bash
   curl -f http://localhost/health/liveness
   ```
