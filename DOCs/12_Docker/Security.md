# 07 — Container Security & Hardening Guide

---

## Document Metadata

| Field               | Value                                                             |
|---------------------|-------------------------------------------------------------------|
| **Document Name**   | Container Security & Hardening Guide                              |
| **Document ID**     | DFIX-DOC-007                                                      |
| **Version**         | 1.0.0                                                             |
| **Status**          | Approved                                                          |
| **Owner**           | Security & DevOps Engineer                                        |
| **Reviewer**        | Technical Lead                                                    |
| **Classification**  | Internal — Confidential                                           |
| **Created Date**    | 2026-08-02                                                        |
| **Last Updated**    | 2026-08-07                                                        |
| **Project**         | DeployFix Lab                                                     |
| **Project Code**    | DFIX                                                              |

---

# 1. Security Hardening Controls Checklist

- [x] **Non-Root Execution:** All containers run under unprivileged UID `10001` (`USER nodejs`).
- [x] **Read-Only Root Filesystem:** Root filesystems mounted read-only (`read_only: true`).
- [x] **Capability Dropping:** Unnecessary Linux kernel capabilities dropped (`cap_drop: [ALL]`).
- [x] **No Secret Storage:** Passwords and JWT secrets injected dynamically via environment variables; never baked into Docker images.
- [x] **Trivy Vulnerability Scanning:** Docker images scanned in CI pipeline (`trivy image`).
