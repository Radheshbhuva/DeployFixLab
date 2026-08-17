# 02 — Application Screenshots & UI Gallery

---

## Document Metadata

| Field               | Value                                                             |
|---------------------|-------------------------------------------------------------------|
| **Document Name**   | Application Screenshots & UI Gallery                              |
| **Document ID**     | DFIX-PORT-002                                                     |
| **Version**         | 1.0.0                                                             |
| **Status**          | Approved                                                          |
| **Owner**           | Lead Developer / UI Lead                                          |
| **Reviewer**        | Technical Reviewer                                                |
| **Classification**  | Public / Portfolio                                                |
| **Created Date**    | 2026-08-02                                                        |
| **Last Updated**    | 2026-08-09                                                        |
| **Project**         | DeployFix Lab                                                     |
| **Project Code**    | DFIX                                                              |

---

# 1. Visual UI Gallery & Screen Specifications

This document outlines the visual interfaces and user experience layouts built into **DeployFix Lab**.

---

## 🖥️ Screen 1: Authentication & Identity Portal (`/login`)
- **Visual Style:** Sleek dark-mode aesthetic (Slate-900 background) featuring an engineered high-contrast form card.
- **Key Elements:** Email/password input fields with inline Zod validation warnings, "Remember Me" session toggle, and secure submit action.

---

## 🖥️ Screen 2: Student Dashboard & System Metrics (`/dashboard`)
- **Visual Style:** Multi-panel grid layout displaying real-time system state telemetry.
- **Key Elements:** Container health badges (Green: Operational, Amber: Degraded, Red: Critical Failure), active lab progress counters, and recent activity logs.

---

## 🖥️ Screen 3: Interactive Lab Catalog (`/labs`)
- **Visual Style:** Filterable card grid categorized by difficulty (Beginner, Intermediate, Advanced) and failure type (Network, Database, Proxy, Memory).
- **Key Elements:** Scenario description cards, estimated completion time, failure tags, and "Start Lab" action trigger.

---

## 🖥️ Screen 4: Real-Time Log Viewer Console (`/logs`)
- **Visual Style:** Embedded terminal emulator console with dark background, syntax-highlighted log levels (`[INFO]`, `[WARN]`, `[ERROR]`), and instant filter controls.
- **Key Elements:** Live WebSocket log stream controls (Pause, Auto-Scroll, Search by Correlation ID, Export Logs).

---

## 🖥️ Screen 5: Admin Chaos Injection Control Panel (`/admin/chaos`)
- **Visual Style:** Command-center control matrix reserved for instructors and admins.
- **Key Elements:** Scenario injection triggers, target container select dropdowns, active chaos state indicators, and manual scenario reset buttons.
