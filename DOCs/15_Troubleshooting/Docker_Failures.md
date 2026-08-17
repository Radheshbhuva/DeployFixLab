# 02 — Docker Container Failures & Diagnostics

---

## Document Metadata

| Field               | Value                                                             |
|---------------------|-------------------------------------------------------------------|
| **Document Name**   | Docker Container Failures & Diagnostics                           |
| **Document ID**     | DFIX-TB-002                                                       |
| **Version**         | 1.0.0                                                             |
| **Status**          | Approved                                                          |
| **Owner**           | DevOps & Troubleshooting Lead                                     |
| **Reviewer**        | Full Engineering Team                                             |
| **Classification**  | Internal — Confidential                                           |
| **Created Date**    | 2026-08-02                                                        |
| **Last Updated**    | 2026-08-07                                                        |
| **Project**         | DeployFix Lab                                                     |
| **Project Code**    | DFIX                                                              |

---

# 1. Failure Catalog: Docker Container Crashes

| Issue Code | Symptom / Exit Code | Root Cause | Remediation Step |
|---|---|---|---|
| `FAIL-DOC-01` | Container Exited with `Code 137` | Out of Memory (OOM) Kill by Linux Kernel. | Increase container memory limit in `docker-compose.yml` (`memory: 512M`). |
| `FAIL-DOC-02` | `exec /server.js: permission denied` | Non-root user lacks execute permissions on binary. | Run `chmod +x` in Dockerfile builder stage. |
| `FAIL-DOC-03` | `docker.sock: permission denied` | Non-root user lacks Docker socket group permissions. | Add user to `docker` group (`sudo usermod -aG docker $USER`). |
