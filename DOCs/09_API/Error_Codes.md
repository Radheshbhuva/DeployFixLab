# 05 — Master API Error Codes Register

---

## Document Metadata

| Field               | Value                                                             |
|---------------------|-------------------------------------------------------------------|
| **Document Name**   | Master API Error Codes Register                                   |
| **Document ID**     | DFIX-API-005                                                      |
| **Version**         | 1.0.0                                                             |
| **Status**          | Approved                                                          |
| **Owner**           | Lead API Architect                                                |
| **Reviewer**        | Full Development Team                                             |
| **Classification**  | Internal — Confidential                                           |
| **Created Date**    | 2026-08-02                                                        |
| **Last Updated**    | 2026-08-07                                                        |
| **Project**         | DeployFix Lab                                                     |
| **Project Code**    | DFIX                                                              |

---

# 1. Error Response Architecture

Every API error emitted by **DeployFix Lab** returns a standardized machine-readable error string code, HTTP status code, human-readable error description, and optional sub-field validation details.

---

# 2. Master Error Code Registry

| HTTP Status | Error Code String | Description / Cause | Action / Remediation |
|---|---|---|---|
| **400** | `INVALID_INPUT_VALIDATION` | Zod body/query/param validation failed. | Fix request body fields according to schema. |
| **401** | `UNAUTHORIZED_NO_TOKEN` | `Authorization` header or Bearer token missing. | Supply valid Bearer access token. |
| **401** | `TOKEN_EXPIRED` | JWT access token expired. | Call `/api/v1/auth/refresh` to obtain new token. |
| **401** | `INVALID_CREDENTIALS` | Incorrect email or password on login. | Re-enter valid login credentials. |
| **403** | `FORBIDDEN_INSUFFICIENT_ROLE` | User role lacks permission for endpoint. | Requires `ADMIN` or `INSTRUCTOR` role. |
| **404** | `RESOURCE_NOT_FOUND` | Requested task, user, or lab ID does not exist. | Verify resource UUID parameter. |
| **409** | `USER_ALREADY_EXISTS` | Email address already registered. | Use a different email or log in. |
| **429** | `RATE_LIMIT_EXCEEDED` | Too many requests in time window. | Throttle client requests & respect `Retry-After`. |
| **500** | `INTERNAL_SERVER_ERROR` | Unexpected application exception. | Check backend Winston container logs. |
| **502** | `BAD_GATEWAY_UPSTREAM` | Nginx failed to reach backend API. | Verify backend container status & port bindings. |
| **503** | `DATABASE_UNAVAILABLE` | PostgreSQL connection pool timeout. | Verify database container health and credentials. |
