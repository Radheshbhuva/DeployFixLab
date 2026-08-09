# 02 — Project Context Architecture Specification

---

## Document Metadata

| Field               | Value                                                             |
|---------------------|-------------------------------------------------------------------|
| **Document Name**   | Project Context Architecture Specification                        |
| **Document ID**     | DFIX-AI-002                                                       |
| **Version**         | 1.0.0                                                             |
| **Status**          | Approved                                                          |
| **Owner**           | Technical Lead & System Architect                                 |
| **Reviewer**        | Backend Lead                                                      |
| **Classification**  | Internal — Confidential                                           |
| **Created Date**    | 2026-08-09                                                        |
| **Last Updated**    | 2026-08-09                                                        |
| **Project**         | DeployFix Lab                                                     |
| **Project Code**    | DFIX                                                              |

---

# 1. Overview & Context Data Model

The **Project Context Engine** (`ai/context/`) builds a unified representation of the target deployment.

```typescript
export interface ProjectContext {
  id: string;
  name: string;
  source: {
    githubUrl?: string;
    websiteUrl?: string;
    deploymentFiles?: string[];
  };
  topology: {
    frontend?: { framework: string; buildTool: string; port: number };
    backend?: { runtime: string; framework: string; port: number };
    database?: { engine: string; provider: string; port: number };
    proxy?: { type: string; ssl: boolean };
    containers: boolean;
    cicd: boolean;
  };
  environmentVars: Record<string, string>;
  createdAt: string;
}
```

---

# 2. Context Builder Pipeline

```
Raw Sources (GitHub, Web URL, Config Files)
                   │
                   ▼
       `context-builder.ts`
                   │
                   ▼
      `context-normalizer.ts`
                   │
                   ▼
       `context-validator.ts`
                   │
                   ▼
      Normalized ProjectContext Object
```

* **`context-builder.ts`**: Extracts raw files, repository AST, package manifests (`package.json`), Docker Compose configs (`docker-compose.yml`), and environment files (`.env`).
* **`context-normalizer.ts`**: Standardizes component metadata across different deployment types.
* **`context-validator.ts`**: Ensures zero missing critical fields before context is passed to the diagnosis pipeline.
