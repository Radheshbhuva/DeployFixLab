# 06 — CI/CD Pipeline & GitHub Actions Failures

---

## Document Metadata

| Field               | Value                                                             |
|---------------------|-------------------------------------------------------------------|
| **Document Name**   | CI/CD Pipeline & GitHub Actions Failures                          |
| **Document ID**     | DFIX-TB-006                                                       |
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

# 1. Failure Catalog: GitHub Actions Pipeline Errors

| Issue Code | Symptom / Error Message | Root Cause | Remediation Step |
|---|---|---|---|
| `FAIL-CICD-01` | Secret Unset Error (`JWT_SECRET missing`) | Secret not configured in GitHub repository secrets settings. | Add `JWT_SECRET` in Repository Settings -> Secrets & Variables. |
| `FAIL-CICD-02` | Docker Push Auth Failure | Invalid GitHub Token permissions for GHCR. | Add `permissions: packages: write` to workflow job. |
