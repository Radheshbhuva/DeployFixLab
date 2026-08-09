# 05 — AI Diagnosis Output Schema Specification

---

## Document Metadata

| Field               | Value                                                             |
|---------------------|-------------------------------------------------------------------|
| **Document Name**   | AI Diagnosis Output Schema Specification                          |
| **Document ID**     | DFIX-AI-005                                                       |
| **Version**         | 1.0.0                                                             |
| **Status**          | Approved                                                          |
| **Owner**           | Technical Lead & Backend Lead                                     |
| **Reviewer**        | Full Engineering Team                                             |
| **Classification**  | Internal — Confidential                                           |
| **Created Date**    | 2026-08-09                                                        |
| **Last Updated**    | 2026-08-09                                                        |
| **Project**         | DeployFix Lab                                                     |
| **Project Code**    | DFIX                                                              |

---

# 1. Overview & JSON Schema Contract

All diagnostic outputs produced by the DeployFix AI engine MUST adhere strictly to the JSON schema defined below:

```typescript
export interface AIDiagnosisOutput {
  id: string;
  timestamp: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  summary: string;
  rootCause: {
    component: string;
    description: string;
    affectedFile?: string;
    affectedLine?: number;
    faultyValue?: string;
  };
  confidence: {
    score: number; // 0 to 100
    rating: 'LOW' | 'MEDIUM' | 'HIGH';
    rationale: string;
  };
  evidence: Array<{
    type: 'LOG' | 'HEALTH_CHECK' | 'CONFIG' | 'DOCKER' | 'HTTP';
    description: string;
    verified: boolean;
  }>;
  recovery: {
    steps: Array<{
      order: number;
      action: string;
      command?: string;
      targetFile?: string;
    }>;
  };
}
```

---

# 2. Example Valid Output Payload

```json
{
  "id": "diag_8f9a2b1c",
  "timestamp": "2026-08-09T17:00:00Z",
  "severity": "HIGH",
  "summary": "Backend service cannot connect to PostgreSQL database.",
  "rootCause": {
    "component": "Backend Service (.env)",
    "description": "DATABASE_URL environment variable is set to localhost instead of internal Docker service host 'postgres'.",
    "affectedFile": "backend/.env",
    "faultyValue": "postgresql://dfix:secret@localhost:5432/deployfix_db"
  },
  "confidence": {
    "score": 94,
    "rating": "HIGH",
    "rationale": "High confidence due to verified ECONNREFUSED log evidence and matching deterministic port/host mismatch rule."
  },
  "evidence": [
    { "type": "HEALTH_CHECK", "description": "Backend readiness health check failed with HTTP 500", "verified": true },
    { "type": "LOG", "description": "Prisma Client error: ECONNREFUSED 127.0.0.1:5432", "verified": true },
    { "type": "DOCKER", "description": "PostgreSQL container is healthy on internal network dfix-net", "verified": true },
    { "type": "CONFIG", "description": "DATABASE_URL points to localhost instead of postgres container hostname", "verified": true }
  ],
  "recovery": {
    "steps": [
      { "order": 1, "action": "Update DATABASE_URL host in backend/.env from localhost to postgres", "targetFile": "backend/.env" },
      { "order": 2, "action": "Restart backend container", "command": "docker-compose restart backend" },
      { "order": 3, "action": "Run database readiness check", "command": "npx prisma db execute" },
      { "order": 4, "action": "Verify backend health probe", "command": "curl http://localhost/api/v1/health/readiness" }
    ]
  }
}
```
