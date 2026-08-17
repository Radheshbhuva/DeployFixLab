# 09 — Docker Troubleshooting & Diagnostics Guide

---

## Document Metadata

| Field               | Value                                                             |
|---------------------|-------------------------------------------------------------------|
| **Document Name**   | Docker Troubleshooting & Diagnostics Guide                        |
| **Document ID**     | DFIX-DOC-009                                                      |
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

# 1. Essential Diagnostic Command Playbook

| Scenario | Diagnostic Command | Expected Resolution Output |
|---|---|---|
| **View Real-Time Logs** | `docker-compose logs -f --tail=100 backend` | Streams backend stdout/stderr exceptions. |
| **Inspect Container State** | `docker inspect dfix-backend` | Displays IP address, volume mounts, health status. |
| **Inspect Network Connectivity** | `docker network inspect dfix-net` | Lists attached container IPs and DNS aliases. |
| **Execute Shell in Container** | `docker exec -it dfix-backend sh` | Opens interactive shell inside container. |
| **Monitor Resource Usage** | `docker stats` | Live CPU, memory, network I/O stats. |
