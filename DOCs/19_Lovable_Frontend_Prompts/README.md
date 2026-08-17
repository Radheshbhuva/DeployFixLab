# 19 — Lovable Frontend Prompts

---

## Document Metadata

| Field               | Value                                                             |
|---------------------|-------------------------------------------------------------------|
| **Document Name**   | Lovable Frontend Master Prompt Collection                         |
| **Document ID**     | DFIX-LVB-019                                                      |
| **Version**         | 1.0.0                                                             |
| **Status**          | Active                                                            |
| **Owner**           | Radhesh (Product Lead)                                            |
| **Classification**  | Internal — Working Document                                       |
| **Created Date**    | 2026-08-13                                                        |
| **Project**         | DeployFix Lab                                                     |
| **Project Code**    | DFIX                                                              |

---

## Purpose

This folder contains the **master prompt files** for building the **DeployFix Lab frontend** using [Lovable](https://lovable.dev). Since our frontend team member is temporarily unavailable, this collection gives Lovable everything it needs to design, develop, and deliver the complete frontend UI/UX.

---

## How to Use These Files

1. **Start with `00_MASTER_BRIEF.md`** — paste the full contents into a new Lovable project to establish the product context and constraints.
2. **Proceed file by file** — each numbered file covers one domain. Paste them into Lovable in order or reference them per feature sprint.
3. **Do NOT skip files** — later files reference design decisions made in earlier files.

---

## File Index

| File | What It Covers |
|------|---------------|
| `00_MASTER_BRIEF.md` | Full product overview, tech stack, tone, and design philosophy |
| `01_DESIGN_SYSTEM.md` | Colors, typography, spacing, components, dark-mode tokens |
| `02_AUTH_PAGES.md` | Login, Register, Forgot Password, JWT flow |
| `03_DASHBOARD_PAGE.md` | Main dashboard: service health cards, telemetry, system status |
| `04_LABS_PAGES.md` | Lab catalog, lab execution view, chaos injector panel |
| `05_LOG_VIEWER.md` | Live log stream viewer (WebSocket), filtering, export |
| `06_DIAGNOSIS_FLOW.md` | AI Diagnosis wizard: input form → evidence → output card |
| `07_ADMIN_CHAOS.md` | Admin/Instructor chaos injection control panel |
| `08_NAVIGATION_LAYOUT.md` | Sidebar nav, app shell, header, breadcrumbs, responsive |
| `09_UI_COMPONENTS.md` | Reusable atoms: Button, Badge, Card, Modal, Loader, Input |
| `10_PAGES_ROUTING.md` | Route table, protected routes, redirect rules, 404 page |

---

## Ground Rules for Lovable

> Always paste these rules at the top of every new Lovable session:

```
GROUND RULES — DO NOT DEVIATE:
1. Tech Stack: React 18, TypeScript (strict), Vite, Tailwind CSS v3, React Router DOM v6, Zustand, Axios.
2. Design: Dark-mode first. Primary palette: Slate-900 background, Blue-500 primary, Green-500 success, Red-500 danger, Amber-500 warning.
3. No placeholder content — every UI element must match the DeployFix Lab product spec.
4. All components must be TypeScript with proper interfaces.
5. File structure: feature-first under src/features/<domain>/.
6. No inline styles — only Tailwind utility classes.
7. Accessibility: all interactive elements must have aria labels.
```
