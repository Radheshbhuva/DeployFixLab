# 02 — API & Integration Testing Specification

---

## Document Metadata

| Field               | Value                                                             |
|---------------------|-------------------------------------------------------------------|
| **Document Name**   | API & Integration Testing Specification                           |
| **Document ID**     | DFIX-TEST-002                                                     |
| **Version**         | 1.0.0                                                             |
| **Status**          | Approved                                                          |
| **Owner**           | QA Lead & Backend Lead                                            |
| **Reviewer**        | Full Engineering Team                                             |
| **Classification**  | Internal — Confidential                                           |
| **Created Date**    | 2026-08-02                                                        |
| **Last Updated**    | 2026-08-07                                                        |
| **Project**         | DeployFix Lab                                                     |
| **Project Code**    | DFIX                                                              |

---

# 1. API Integration Test Architecture

API integration tests run against a live PostgreSQL test container using **Supertest** and **Jest**.

```typescript
import request from 'supertest';
import app from '../src/app';

describe('POST /api/v1/auth/login', () => {
  it('should return 200 OK and JWT access token for valid credentials', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'student@deployfix.lab', password: 'P@ssword123!' });

    expect(res.statusCode).toEqual(200);
    expect(res.body.data).toHaveProperty('accessToken');
  });
});
```
