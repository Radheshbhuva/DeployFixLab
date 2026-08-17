# 05 — Nginx & Ingress Routing Failures

---

## Document Metadata

| Field               | Value                                                             |
|---------------------|-------------------------------------------------------------------|
| **Document Name**   | Nginx & Ingress Routing Failures                                  |
| **Document ID**     | DFIX-TB-005                                                       |
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

# 1. Failure Catalog: Reverse Proxy & Nginx Errors

| Issue Code | Symptom / HTTP Code | Root Cause | Remediation Step |
|---|---|---|---|
| `FAIL-NGX-01` | `502 Bad Gateway` | Upstream backend proxy target port mismatch (e.g. 8080 vs 5000). | Update `proxy_pass` directive in `nginx/conf.d/default.conf` to target port 5000. |
| `FAIL-NGX-02` | `504 Gateway Timeout` | Express API hanging or database lock preventing response. | Inspect backend Winston logs & increase proxy timeout values. |
| `FAIL-NGX-03` | `CORS Header Missing` | Nginx stripping `Access-Control-Allow-Origin` headers. | Configure CORS headers in Nginx location block. |
