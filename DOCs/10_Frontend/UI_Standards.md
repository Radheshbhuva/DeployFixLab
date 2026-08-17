# 04 — UI/UX & Design Tokens Standard

---

## Document Metadata

| Field               | Value                                                             |
|---------------------|-------------------------------------------------------------------|
| **Document Name**   | UI/UX & Design Tokens Standard                                    |
| **Document ID**     | DFIX-FE-004                                                       |
| **Version**         | 1.0.0                                                             |
| **Status**          | Approved                                                          |
| **Owner**           | UI/UX Lead                                                        |
| **Reviewer**        | Frontend Lead                                                     |
| **Classification**  | Internal — Confidential                                           |
| **Created Date**    | 2026-08-02                                                        |
| **Last Updated**    | 2026-08-07                                                        |
| **Project**         | DeployFix Lab                                                     |
| **Project Code**    | DFIX                                                              |

---

# 1. Color Palette & Status Design Tokens

DeployFix Lab utilizes a dark-mode first, high-contrast engineering dashboard color scheme configured in `tailwind.config.js`:

| Token Name | Color Code | Purpose / Application |
|---|---|---|
| **Primary** | `#3B82F6` (Blue-500) | Buttons, active navigation tabs, interactive links |
| **Success** | `#22C55E` (Green-500) | Operational badges, verified lab state, 200 OK statuses |
| **Danger** | `#EF4444` (Red-500) | Critical failure badges, chaos active status, 500 error cards |
| **Warning** | `#F59E0B` (Amber-500) | Degraded service warnings, intermediate lab states |
| **Dark BG** | `#0F172A` (Slate-900) | Primary dashboard background color |
| **Surface BG**| `#1E293B` (Slate-800) | Card panels, terminal console viewport |
