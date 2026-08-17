# 05 — Volume & Storage Management Guide

---

## Document Metadata

| Field               | Value                                                             |
|---------------------|-------------------------------------------------------------------|
| **Document Name**   | Volume & Storage Management Guide                                 |
| **Document ID**     | DFIX-DOC-005                                                      |
| **Version**         | 1.0.0                                                             |
| **Status**          | Approved                                                          |
| **Owner**           | DevOps Engineer                                                   |
| **Reviewer**        | Full Engineering Team                                             |
| **Classification**  | Internal — Confidential                                           |
| **Created Date**    | 2026-08-02                                                        |
| **Last Updated**    | 2026-08-07                                                        |
| **Project**         | DeployFix Lab                                                     |
| **Project Code**    | DFIX                                                              |

---

# 1. Persistent Storage Strategy

To guarantee zero data loss when containers restart or rebuild:

1. **PostgreSQL Volume (`dfix_pg_data`):** Named Docker volume backing `/var/lib/postgresql/data`.
2. **Ephemeral RAM Disk (`tmpfs`):** Containers use `tmpfs` mounts for `/tmp` logging to prevent filesystem bloat on host OS.
3. **Host Bind Mounts:** Used ONLY during local development (`frontend/src` and `backend/src` mounts for live HMR).
