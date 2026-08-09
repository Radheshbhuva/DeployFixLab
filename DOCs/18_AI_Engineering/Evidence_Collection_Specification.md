# 03 — Evidence Collection Specification

---

## Document Metadata

| Field               | Value                                                             |
|---------------------|-------------------------------------------------------------------|
| **Document Name**   | Evidence Collection Specification                                 |
| **Document ID**     | DFIX-AI-003                                                       |
| **Version**         | 1.0.0                                                             |
| **Status**          | Approved                                                          |
| **Owner**           | Technical Lead & DevOps Lead                                      |
| **Reviewer**        | Full Engineering Team                                             |
| **Classification**  | Internal — Confidential                                           |
| **Created Date**    | 2026-08-09                                                        |
| **Last Updated**    | 2026-08-09                                                        |
| **Project**         | DeployFix Lab                                                     |
| **Project Code**    | DFIX                                                              |

---

# 1. Overview

The **Evidence Collection Engine** (`ai/evidence/`) extracts runtime telemetry, log events, container statuses, and health check signals, standardizing them into an **Evidence Payload** for deterministic rule evaluation and LLM reasoning.

---

# 2. Evidence Parsers & Analyzers

```
Raw Telemetry Inputs
  ├── Container Stdout Logs ────► log-parser.ts
  ├── HTTP /health Probes   ────► health-parser.ts
  ├── Config Files & .env   ────► config-analyzer.ts
  ├── Docker Daemon API     ────► docker-analyzer.ts
  └── Web Headers & Status  ────► deployment-analyzer.ts
                                          │
                                          ▼
                               evidence-normalizer.ts
                                          │
                                          ▼
                               Normalized Evidence Payload
```

### Core Components:
* **`log-parser.ts`**: Extracts regex patterns from stdout/stderr logs (e.g. `ECONNREFUSED`, `P1001`, `OOMKilled`).
* **`health-parser.ts`**: Evaluates HTTP status codes (2xx, 502, 503, 504) from liveness and readiness endpoints.
* **`config-analyzer.ts`**: Checks for missing required environment variables, invalid ports, and syntax errors in Nginx/Docker configs.
* **`docker-analyzer.ts`**: Queries Docker Daemon socket for container exit codes (e.g. Code 137 OOM, Code 1 general error).
* **`deployment-analyzer.ts`**: Checks HTTP header responses and SSL handshake status.
* **`evidence-normalizer.ts`**: Combines parsed signals into a validated `EvidencePayload` structure.
