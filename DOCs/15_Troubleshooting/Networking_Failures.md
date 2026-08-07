# 04 — Container & DNS Networking Failures

---

## Document Metadata

| Field               | Value                                                             |
|---------------------|-------------------------------------------------------------------|
| **Document Name**   | Container & DNS Networking Failures                               |
| **Document ID**     | DFIX-TB-004                                                       |
| **Version**         | 1.0.0                                                             |
| **Status**          | Approved                                                          |
| **Owner**           | DevOps & Network Lead                                             |
| **Reviewer**        | Full Engineering Team                                             |
| **Classification**  | Internal — Confidential                                           |
| **Created Date**    | 2026-08-02                                                        |
| **Last Updated**    | 2026-08-07                                                        |
| **Project**         | DeployFix Lab                                                     |
| **Project Code**    | DFIX                                                              |

---

# 1. Failure Catalog: Docker Network Errors

| Issue Code | Symptom / Error Message | Root Cause | Remediation Step |
|---|---|---|---|
| `FAIL-NET-01` | `getaddrinfo ENOTFOUND backend` | Container attached to wrong network or backend service down. | Verify both containers belong to `dfix-net` bridge network. |
| `FAIL-NET-02` | `No route to host` | Subnet collision between Docker daemon and host network. | Update `bip` or `default-address-pools` in `/etc/docker/daemon.json`. |
