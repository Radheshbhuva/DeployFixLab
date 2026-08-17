# 04 — Authentication & Identity API Specification

---

## Document Metadata

| Field               | Value                                                             |
|---------------------|-------------------------------------------------------------------|
| **Document Name**   | Authentication & Identity API Specification                       |
| **Document ID**     | DFIX-API-004                                                      |
| **Version**         | 1.0.0                                                             |
| **Status**          | Approved                                                          |
| **Owner**           | Lead Security & Backend Engineer                                  |
| **Reviewer**        | Technical Lead                                                    |
| **Classification**  | Internal — Confidential                                           |
| **Created Date**    | 2026-08-02                                                        |
| **Last Updated**    | 2026-08-07                                                        |
| **Project**         | DeployFix Lab                                                     |
| **Project Code**    | DFIX                                                              |

---

# 1. Overview & Token Model

Authentication in **DeployFix Lab** uses dual-token JWT access and refresh mechanisms:
* **Access Token:** Short-lived JWT (15 minutes) passed in the `Authorization: Bearer <token>` HTTP header.
* **Refresh Token:** Long-lived token (7 days) stored in an `HttpOnly`, `SameSite=Strict`, `Secure` cookie.

---

# 2. Endpoint Detailed Specs

## 2.1 User Registration (`POST /api/v1/auth/register`)
* **Request:**
  ```json
  {
    "name": "Jane Student",
    "email": "jane@example.com",
    "password": "P@ssword123!"
  }
  ```
* **Response (201 Created):**
  ```json
  {
    "success": true,
    "statusCode": 201,
    "data": {
      "user": {
        "id": "c39a21b4-e4a8-48b2-9211-19d28e75f10a",
        "name": "Jane Student",
        "email": "jane@example.com",
        "role": "STUDENT"
      }
    }
  }
  ```

## 2.2 User Login (`POST /api/v1/auth/login`)
* **Request:**
  ```json
  {
    "email": "jane@example.com",
    "password": "P@ssword123!"
  }
  ```
* **Response (200 OK):**
  ```json
  {
    "success": true,
    "statusCode": 200,
    "data": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "expiresIn": 900
    }
  }
  ```
* **Set-Cookie:** `refreshToken=xyz...; Path=/api/v1/auth/refresh; HttpOnly; SameSite=Strict; Secure`
