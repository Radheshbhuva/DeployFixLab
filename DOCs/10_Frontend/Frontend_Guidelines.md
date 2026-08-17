# 01 — Frontend Engineering Guidelines

---

## Document Metadata

| Field               | Value                                                             |
|---------------------|-------------------------------------------------------------------|
| **Document Name**   | Frontend Engineering Guidelines                                   |
| **Document ID**     | DFIX-FE-001                                                       |
| **Version**         | 1.0.0                                                             |
| **Status**          | Approved                                                          |
| **Owner**           | Frontend Engineering Lead                                         |
| **Reviewer**        | Technical Lead, Principal Architect                               |
| **Classification**  | Internal — Confidential                                           |
| **Created Date**    | 2026-08-02                                                        |
| **Last Updated**    | 2026-08-07                                                        |
| **Project**         | DeployFix Lab                                                     |
| **Project Code**    | DFIX                                                              |

---

# 1. Purpose & Tech Stack

This document defines the core frontend engineering guidelines for **DeployFix Lab**. The frontend is built as a single-page application (SPA) designed for rapid interaction, real-time telemetry rendering, and container failure troubleshooting.

* **Core Framework:** React 18 (Concurrent React features, Suspense)
* **Language:** TypeScript 5.4+ (Strict Mode enabled)
* **Build System:** Vite 5.2+ (Lightning-fast HMR and ES module bundling)
* **Styling:** Tailwind CSS 3.4+ (Utility-first design tokens)
* **State Management:** Zustand 4.5+ (Unidirectional store slices)

---

# 2. Performance & Loading Targets

1. **Initial Bundle Load:** `< 3.0s` on 4G connection.
2. **First Contentful Paint (FCP):** `< 1.2s`.
3. **Route Code Splitting:** All core pages MUST be loaded asynchronously using `React.lazy()` and `Suspense`.
4. **Environment Variables:** All environment-specific variables must be prefixed with `VITE_` (e.g. `VITE_API_BASE_URL`).
