# 11 — Data Flow Diagrams (DFD) Specification

---

## Document Metadata

| Field               | Value                                                             |
|---------------------|-------------------------------------------------------------------|
| **Document Name**   | Data Flow Diagrams (DFD) Specification                            |
| **Document ID**     | DFIX-ARCH-011                                                     |
| **Version**         | 1.0.0                                                             |
| **Status**          | Approved                                                          |
| **Owner**           | Lead Software Architect                                           |
| **Reviewer**        | Full Engineering Team                                             |
| **Classification**  | Internal — Confidential                                           |
| **Created Date**    | 2026-08-02                                                        |
| **Last Updated**    | 2026-08-06                                                        |
| **Project**         | DeployFix Lab                                                     |
| **Project Code**    | DFIX                                                              |

---

# 1. Level 0 System Context DFD

```mermaid
graph LR
    User([Learner / Student])
    Admin([Instructor / Admin])
    
    System((DeployFix Lab System))
    
    Logs[(Log Storage / stdout)]
    DB[(PostgreSQL DB)]
    
    User -->|Auth Credentials / Lab Commands| System
    Admin -->|Chaos Injection Triggers| System
    
    System -->|Status Badges & Live Logs| User
    System -->|Audit Trails & Progress Stats| Admin
    
    System <-->|CRUD Operations| DB
    System -->|Write Event Logs| Logs
```

---

# 2. Level 1 Data Flow Diagram (Subsystem Breakdown)

```mermaid
graph TD
    User([User])
    
    P1[1.0 Authenticate User]
    P2[2.0 Manage Labs]
    P3[3.0 Inject Chaos Failures]
    P4[4.0 Verify Recovery]
    
    D1[(D1: USERS)]
    D2[(D2: LAB_SCENARIOS)]
    D3[(D3: USER_LAB_PROGRESS)]
    D4[(D4: LOGS)]
    
    User -->|Login Data| P1
    P1 -->|JWT Token| User
    P1 <-->|Verify Credentials| D1
    
    User -->|Select Lab| P2
    P2 <-->|Read Lab Config| D2
    P2 -->|Update State| D3
    
    User -->|Trigger Scenario| P3
    P3 -->|Write Chaos State| D3
    P3 -->|Emit Chaos Event| D4
    
    User -->|Submit Recovery Fix| P4
    P4 <-->|Validate Constraints| D2
    P4 -->|Mark Verified| D3
```
