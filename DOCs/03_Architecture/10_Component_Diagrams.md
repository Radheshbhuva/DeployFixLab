# 10 — Component Diagrams Specification

---

## Document Metadata

| Field               | Value                                                             |
|---------------------|-------------------------------------------------------------------|
| **Document Name**   | Component Diagrams Specification                                  |
| **Document ID**     | DFIX-ARCH-010                                                     |
| **Version**         | 1.0.0                                                             |
| **Status**          | Approved                                                          |
| **Owner**           | Principal Systems Architect                                       |
| **Reviewer**        | Development Team                                                  |
| **Classification**  | Internal — Confidential                                           |
| **Created Date**    | 2026-08-02                                                        |
| **Last Updated**    | 2026-08-06                                                        |
| **Project**         | DeployFix Lab                                                     |
| **Project Code**    | DFIX                                                              |

---

# 1. Express API Subsystem Component Breakdown

```mermaid
graph TD
    subgraph Express Backend Container
        Router[Express Router /v1]
        AuthMW[JWT Auth Middleware]
        RateMW[Rate Limiter Middleware]
        ZodMW[Zod Request Validator]
        
        AuthCtrl[Auth Controller]
        LabCtrl[Lab Controller]
        ChaosCtrl[Chaos Controller]
        
        AuthSvc[Auth Service]
        LabSvc[Lab Service]
        ChaosSvc[Chaos Injection Engine]
        
        PrismaRepo[Prisma ORM Client]
    end

    Router --> RateMW
    RateMW --> ZodMW
    ZodMW --> AuthMW
    
    AuthMW --> AuthCtrl
    AuthMW --> LabCtrl
    AuthMW --> ChaosCtrl
    
    AuthCtrl --> AuthSvc
    LabCtrl --> LabSvc
    ChaosCtrl --> ChaosSvc
    
    AuthSvc --> PrismaRepo
    LabSvc --> PrismaRepo
    ChaosSvc --> PrismaRepo
    
    PrismaRepo -->|TCP 5432| PostgreSQL[(PostgreSQL Database)]
```
