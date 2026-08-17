# 05 — AI Diagnosis Output Schema Specification

---

## Document Metadata

| Field               | Value                                                             |
|---------------------|-------------------------------------------------------------------|
| **Document Name**   | AI Diagnosis Output Schema Specification                          |
| **Document ID**     | DFIX-AI-005                                                       |
| **Version**         | 2.0.0                                                             |
| **Status**          | Approved — Active                                                 |
| **Owner**           | Technical Lead & Backend Lead                                     |
| **Reviewer**        | Full Engineering Team                                             |
| **Classification**  | Internal — Confidential                                           |
| **Created Date**    | 2026-08-09                                                        |
| **Last Updated**    | 2026-08-09                                                        |
| **Project**         | DeployFix Lab                                                     |
| **Project Code**    | DFIX                                                              |

---

## 1. Overview & Purpose

The `AIDiagnosisOutput` schema is the **machine-readable contract** that defines the structure of every diagnostic response produced by the DeployFix AI engine.

Every diagnosis produced by `ai/diagnosis/diagnosis-engine.ts` MUST:
1. Conform to this TypeScript interface
2. Pass Zod schema validation (`ai/diagnosis/diagnosis-schema.ts`)
3. Be stored in the database via Prisma (table: `diagnoses`)
4. Be served to the frontend via `GET /api/v1/diagnose/:id`

This schema is the single source of truth between the AI engine, the backend API, and the frontend dashboard.

---

## 2. Full TypeScript Interface

```typescript
// ai/diagnosis/diagnosis-schema.ts

export type DiagnosisSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type ConfidenceRating = 'LOW' | 'MEDIUM' | 'HIGH';
export type EvidenceType = 'LOG' | 'HEALTH_CHECK' | 'CONFIG' | 'DOCKER' | 'HTTP';
export type FailureDomain = 'INFRA' | 'NET' | 'DB' | 'CONFIG' | 'APP' | 'SEC';

export interface DiagnosisRootCause {
  component: string;          // Which system component is at fault
  domain: FailureDomain;      // Failure classification domain
  description: string;        // Human-readable root cause explanation
  affectedFile?: string;      // Relative file path if applicable (e.g. "apps/backend/.env")
  affectedLine?: number;      // Line number within affected file if known
  faultyValue?: string;       // Current incorrect value (secrets redacted)
  correctValue?: string;      // Expected correct value (if determinable)
}

export interface DiagnosisConfidence {
  score: number;              // 0 to 100 — percentage certainty
  rating: ConfidenceRating;   // LOW | MEDIUM | HIGH
  rationale: string;          // Human-readable explanation of confidence basis
  ruleContribution: number;   // How much deterministic rules contributed (0-100)
  aiContribution: number;     // How much AI reasoning contributed (0-100)
}

export interface DiagnosisEvidence {
  type: EvidenceType;
  source: string;             // e.g. "backend-container-logs", "postgres-health-probe"
  description: string;
  verified: boolean;          // Confirmed by at least two independent sources
  severity: 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';
  errorCode?: string;         // e.g. "ECONNREFUSED", "P1001", "502"
  timestamp: string;          // ISO 8601
}

export interface RecoveryStep {
  order: number;              // 1-indexed execution order
  action: string;             // Human-readable action description
  command?: string;           // Optional: safe shell command for reference
  targetFile?: string;        // Optional: file to modify
  targetKey?: string;         // Optional: specific config key to change
  expectedOutcome?: string;   // Optional: what should change after this step
  verificationCommand?: string; // Optional: command to verify step succeeded
}

export interface AIDiagnosisOutput {
  id: string;                         // UUID — unique diagnosis ID
  projectContextId: string;           // Foreign key to ProjectContext
  timestamp: string;                  // ISO 8601 — when diagnosis was generated
  severity: DiagnosisSeverity;        // Overall incident severity
  summary: string;                    // One-sentence human-readable summary
  explanation: string;                // Multi-paragraph human-readable explanation
  domain: FailureDomain;             // Primary failure domain classification
  rootCause: DiagnosisRootCause;
  confidence: DiagnosisConfidence;
  evidence: DiagnosisEvidence[];      // Must contain at least 1 item
  recovery: {
    steps: RecoveryStep[];            // Ordered remediation playbook
    estimatedResolutionTime?: string; // e.g. "5-10 minutes"
    requiresDowntime: boolean;
    requiresRestart: boolean;
  };
  metadata: {
    engineVersion: string;            // Version of diagnosis-engine.ts
    modelUsed: string | null;         // e.g. "gpt-4o" | null (if rules-only)
    ruleMatchCount: number;           // Number of rules that fired
    processingTimeMs: number;         // Total diagnosis time in milliseconds
    autoRemediationAllowed: false;    // INVARIANT: always false in V1
  };
}
```

---

## 3. Zod Schema Contract

```typescript
// ai/schemas/diagnosis.schema.ts (Zod runtime validation)

import { z } from 'zod';

export const AIDiagnosisOutputSchema = z.object({
  id: z.string().uuid(),
  projectContextId: z.string().uuid(),
  timestamp: z.string().datetime(),
  severity: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  summary: z.string().min(10).max(300),
  explanation: z.string().min(20),
  domain: z.enum(['INFRA', 'NET', 'DB', 'CONFIG', 'APP', 'SEC']),
  rootCause: z.object({
    component: z.string().min(1),
    domain: z.enum(['INFRA', 'NET', 'DB', 'CONFIG', 'APP', 'SEC']),
    description: z.string().min(10),
    affectedFile: z.string().optional(),
    affectedLine: z.number().int().positive().optional(),
    faultyValue: z.string().optional(),
    correctValue: z.string().optional(),
  }),
  confidence: z.object({
    score: z.number().min(0).max(100),
    rating: z.enum(['LOW', 'MEDIUM', 'HIGH']),
    rationale: z.string().min(10),
    ruleContribution: z.number().min(0).max(100),
    aiContribution: z.number().min(0).max(100),
  }),
  evidence: z.array(z.object({
    type: z.enum(['LOG', 'HEALTH_CHECK', 'CONFIG', 'DOCKER', 'HTTP']),
    source: z.string().min(1),
    description: z.string().min(5),
    verified: z.boolean(),
    severity: z.enum(['INFO', 'WARNING', 'ERROR', 'CRITICAL']),
    errorCode: z.string().optional(),
    timestamp: z.string().datetime(),
  })).min(1),
  recovery: z.object({
    steps: z.array(z.object({
      order: z.number().int().min(1),
      action: z.string().min(5),
      command: z.string().optional(),
      targetFile: z.string().optional(),
      targetKey: z.string().optional(),
      expectedOutcome: z.string().optional(),
      verificationCommand: z.string().optional(),
    })).min(1),
    estimatedResolutionTime: z.string().optional(),
    requiresDowntime: z.boolean(),
    requiresRestart: z.boolean(),
  }),
  metadata: z.object({
    engineVersion: z.string(),
    modelUsed: z.string().nullable(),
    ruleMatchCount: z.number().int().min(0),
    processingTimeMs: z.number().min(0),
    autoRemediationAllowed: z.literal(false),
  }),
});

export type AIDiagnosisOutput = z.infer<typeof AIDiagnosisOutputSchema>;
```

---

## 4. Complete Example Diagnostic Output

```json
{
  "id": "diag_8f9a2b1c-4e5d-6f7a-8b9c-0d1e2f3a4b5c",
  "projectContextId": "ctx_1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d",
  "timestamp": "2026-08-09T17:00:00.000Z",
  "severity": "CRITICAL",
  "summary": "Backend service cannot connect to PostgreSQL database.",
  "explanation": "The backend container is failing to establish a connection to the PostgreSQL database. Container logs show repeated ECONNREFUSED errors on 127.0.0.1:5432, indicating the application is attempting to connect to localhost rather than the PostgreSQL Docker service. The PostgreSQL container itself is healthy and accepting connections on the internal Docker network (dfix-net). The root cause is a misconfigured DATABASE_URL environment variable that references 'localhost' instead of the Docker Compose service hostname 'postgres'.",
  "domain": "DB",
  "rootCause": {
    "component": "Backend Service (.env)",
    "domain": "CONFIG",
    "description": "DATABASE_URL environment variable is set to localhost instead of the internal Docker service hostname 'postgres', causing all database connection attempts to fail.",
    "affectedFile": "apps/backend/.env",
    "affectedLine": 7,
    "faultyValue": "postgresql://dfix:[REDACTED]@localhost:5432/deployfix_db",
    "correctValue": "postgresql://dfix:[REDACTED]@postgres:5432/deployfix_db"
  },
  "confidence": {
    "score": 94,
    "rating": "HIGH",
    "rationale": "High confidence from convergence of 3 independent evidence sources: ECONNREFUSED log pattern (LOG), backend health probe returning 500 (HEALTH_CHECK), and DATABASE_URL host mismatch detected in .env config (CONFIG). PostgreSQL container is confirmed healthy via Docker inspect.",
    "ruleContribution": 70,
    "aiContribution": 24
  },
  "evidence": [
    {
      "type": "HEALTH_CHECK",
      "source": "backend-readiness-probe",
      "description": "Backend readiness health check returned HTTP 500 Internal Server Error",
      "verified": true,
      "severity": "CRITICAL",
      "errorCode": "500",
      "timestamp": "2026-08-09T16:59:55.000Z"
    },
    {
      "type": "LOG",
      "source": "backend-container-logs",
      "description": "Prisma Client error: ECONNREFUSED 127.0.0.1:5432 — database connection refused",
      "verified": true,
      "severity": "CRITICAL",
      "errorCode": "ECONNREFUSED",
      "timestamp": "2026-08-09T16:59:53.000Z"
    },
    {
      "type": "DOCKER",
      "source": "postgres-container-inspect",
      "description": "PostgreSQL container status: healthy, uptime: 15m32s, no restart events",
      "verified": true,
      "severity": "INFO",
      "errorCode": null,
      "timestamp": "2026-08-09T16:59:54.000Z"
    },
    {
      "type": "CONFIG",
      "source": "env-config-analyzer",
      "description": "DATABASE_URL in apps/backend/.env references 'localhost' instead of Docker service name 'postgres'",
      "verified": true,
      "severity": "ERROR",
      "errorCode": "DB_HOST_MISMATCH",
      "timestamp": "2026-08-09T16:59:52.000Z"
    }
  ],
  "recovery": {
    "steps": [
      {
        "order": 1,
        "action": "Update DATABASE_URL in apps/backend/.env — change the host from 'localhost' to 'postgres'",
        "targetFile": "apps/backend/.env",
        "targetKey": "DATABASE_URL",
        "faultyValue": "postgresql://dfix:[REDACTED]@localhost:5432/deployfix_db",
        "correctValue": "postgresql://dfix:[REDACTED]@postgres:5432/deployfix_db",
        "expectedOutcome": "DATABASE_URL now references the correct Docker service hostname"
      },
      {
        "order": 2,
        "action": "Restart the backend container to pick up the updated environment variable",
        "command": "docker-compose restart backend",
        "expectedOutcome": "Backend container restarts with new DATABASE_URL"
      },
      {
        "order": 3,
        "action": "Verify database connection is established by checking backend startup logs",
        "command": "docker-compose logs --tail=20 backend",
        "expectedOutcome": "No ECONNREFUSED errors; Prisma connection established log visible"
      },
      {
        "order": 4,
        "action": "Run Prisma migration to ensure schema is up to date",
        "command": "docker-compose exec backend npx prisma migrate deploy",
        "expectedOutcome": "Migrations applied successfully"
      },
      {
        "order": 5,
        "action": "Verify backend health check now returns 200 OK",
        "command": "curl -f http://localhost/api/v1/health/readiness",
        "verificationCommand": "curl -o /dev/null -s -w \"%{http_code}\" http://localhost/api/v1/health/readiness",
        "expectedOutcome": "HTTP 200 OK returned from /api/v1/health/readiness"
      }
    ],
    "estimatedResolutionTime": "3-5 minutes",
    "requiresDowntime": false,
    "requiresRestart": true
  },
  "metadata": {
    "engineVersion": "1.0.0",
    "modelUsed": "gpt-4o",
    "ruleMatchCount": 2,
    "processingTimeMs": 2847,
    "autoRemediationAllowed": false
  }
}
```

---

## 5. Severity Classification Rules

| Severity | Conditions | User Impact |
|----------|-----------|-------------|
| **CRITICAL** | Service completely unreachable OR data loss risk | Production is down or unsafe |
| **HIGH** | Core feature broken but service partially available | Significant user impact |
| **MEDIUM** | Non-critical feature degraded or warning-level issue | Limited user impact |
| **LOW** | Best practice violation or minor misconfiguration | No current user impact |

---

## 6. Schema Versioning Policy

| Change Type | Action Required |
|-------------|----------------|
| New optional field | Minor version bump; backwards compatible |
| New required field | Major version bump; database migration required |
| Field rename | Major version bump; ADR entry required |
| Type change on existing field | Major version bump; ADR entry + migration required |
| New enum value | Minor version bump |
| Enum value removal | Major version bump |

Current schema version: **2.0.0**
Schema source of truth: `ai/schemas/diagnosis.schema.ts`

---

*This document is the authoritative reference for the `AIDiagnosisOutput` contract. The TypeScript interface, Zod schema, Prisma model, and REST API response shape must all remain synchronized with this specification.*
