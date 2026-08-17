# 03 — API Response Envelope Specification

---

## Document Metadata

| Field               | Value                                                             |
|---------------------|-------------------------------------------------------------------|
| **Document Name**   | API Response Envelope Specification                               |
| **Document ID**     | DFIX-API-003                                                      |
| **Version**         | 1.0.0                                                             |
| **Status**          | Approved                                                          |
| **Owner**           | Backend Engineering Lead                                          |
| **Reviewer**        | Full Engineering Team                                             |
| **Classification**  | Internal — Confidential                                           |
| **Created Date**    | 2026-08-02                                                        |
| **Last Updated**    | 2026-08-07                                                        |
| **Project**         | DeployFix Lab                                                     |
| **Project Code**    | DFIX                                                              |

---

# 1. Success Response Envelope Schema

All successful API responses MUST return the following JSON structure:

```json
{
  "success": true,
  "statusCode": 200,
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 20,
    "totalCount": 150
  },
  "timestamp": "2026-08-07T08:07:46.000Z"
}
```

---

# 2. Error Response Envelope Schema

All error API responses MUST return the following JSON structure:

```json
{
  "success": false,
  "statusCode": 400,
  "error": {
    "code": "INVALID_INPUT_VALIDATION",
    "message": "Validation failed for request payload",
    "details": [
      {
        "field": "email",
        "message": "Invalid email address format"
      }
    ]
  },
  "timestamp": "2026-08-07T08:07:46.000Z",
  "correlationId": "req-88392-b4"
}
```
