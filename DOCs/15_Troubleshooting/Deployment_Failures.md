# 01 — Deployment Failures & Recovery Playbook

---

## Document Metadata

| Field               | Value                                                             |
|---------------------|-------------------------------------------------------------------|
| **Document Name**   | Deployment Failures & Recovery Playbook                           |
| **Document ID**     | DFIX-TB-001                                                       |
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

# 1. Failure Catalog: Cloud Deployment Errors

| Issue Code | Symptom / Error Message | Root Cause | Remediation Step |
|---|---|---|---|
| `FAIL-DEP-01` | SSH Permission Denied (`Publickey`) | SSH public key missing in `~/.ssh/authorized_keys`. | Add public key to cloud instance `authorized_keys`. |
| `FAIL-DEP-02` | Port 80 Already in Use | Host system running standalone Nginx or Apache. | Stop host Nginx (`sudo systemctl stop nginx`) or rebind. |
| `FAIL-DEP-03` | Disk Space Exhaustion (`No space left on device`) | Accumulation of dangling Docker images. | Execute `docker system prune -a --volumes`. |
