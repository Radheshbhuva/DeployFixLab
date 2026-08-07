# 07 — Security Vulnerability & Audit Failures

---

## Document Metadata

| Field               | Value                                                             |
|---------------------|-------------------------------------------------------------------|
| **Document Name**   | Security Vulnerability & Audit Failures                           |
| **Document ID**     | DFIX-TB-007                                                       |
| **Version**         | 1.0.0                                                             |
| **Status**          | Approved                                                          |
| **Owner**           | Security Lead                                                     |
| **Reviewer**        | Technical Lead                                                    |
| **Classification**  | Internal — Confidential                                           |
| **Created Date**    | 2026-08-02                                                        |
| **Last Updated**    | 2026-08-07                                                        |
| **Project**         | DeployFix Lab                                                     |
| **Project Code**    | DFIX                                                              |

---

# 1. Failure Catalog: Security & Hardening Violations

| Issue Code | Symptom / Error Message | Root Cause | Remediation Step |
|---|---|---|---|
| `FAIL-SEC-01` | Secret Leak Detected in Git History | Plaintext API key committed in source file. | Revoke key immediately and clean git history via `git-filter-repo`. |
| `FAIL-SEC-02` | Non-Root User Execution Violation | Container process running as `root` (UID 0). | Set `USER nodejs` in Dockerfile. |
