# 19 — Antigravity Frontend Specifications & Development Prompts

---

## Document Metadata

| Field               | Value                                                             |
|---------------------|-------------------------------------------------------------------|
| **Document Name**   | Antigravity Frontend Master Specification & Prompt Collection    |
| **Document ID**     | DFIX-AG-019                                                       |
| **Version**         | 2.0.0                                                             |
| **Status**          | Active                                                            |
| **Owner**           | Radhesh (Product Lead)                                            |
| **Classification**  | Internal — Working Document                                       |
| **Created Date**    | 2026-08-13                                                        |
| **Last Updated**    | 2026-08-13                                                        |
| **Project**         | DeployFix Lab                                                     |
| **Project Code**    | DFIX                                                              |

---

## Purpose

This folder contains the **master specification and prompt blueprints** for designing, scaffolding, developing, and validating the **DeployFix Lab frontend** directly within **Google Antigravity**. 

Antigravity operates as the primary AI developer agent to pair-program, build components, write TypeScript features, implement Tailwind design system tokens, handle state management, and conduct end-to-end browser runtime validation.

---

## How to Use These Files in Antigravity

1. **Start with `00_MASTER_BRIEF.md`** — Antigravity reads this file to establish product context, target stack, design philosophy, security rules, and architectural boundaries.
2. **Execute File by File** — Each numbered specification file covers one feature domain or layer. Reference them during feature sprints to guide Antigravity's direct code implementation.
3. **Strict Order Preserved** — Later specifications depend on design decisions and components created in earlier files.

---

## File Index

| File | Feature / Layer Domain |
|------|------------------------|
| `00_MASTER_BRIEF.md` | Full product overview, tech stack, tone, design philosophy & security rules |
| `01_DESIGN_SYSTEM.md` | Tailwind tokens, typography, colors, dark-mode tokens, UI component primitives |
| `02_AUTH_PAGES.md` | Login, Register, token management, route protection guards, auth store |
| `03_DASHBOARD_PAGE.md` | Main dashboard: service health cards, telemetry overview, cluster status |
| `04_LABS_PAGES.md` | Lab catalog, lab execution view, container failure scenario controls |
| `05_LOG_VIEWER.md` | Live log stream viewer (WebSocket), log level filtering, export |
| `06_DIAGNOSIS_FLOW.md` | AI Diagnosis wizard: input form → evidence → root cause diagnosis output card |
| `07_ADMIN_CHAOS.md` | Admin/Instructor chaos injection control panel & student telemetry monitor |
| `08_NAVIGATION_LAYOUT.md` | Sidebar nav, app shell, header, breadcrumbs, responsive navigation |
| `09_UI_COMPONENTS.md` | Reusable atoms: Button, Badge, Card, Modal, Loader, Input, StatusDot |
| `10_PAGES_ROUTING.md` | Route table, protected routes, role-based guards, 404 page |

---

## Ground Rules for Antigravity

> These rules apply to all frontend development tasks executed inside Antigravity:

```
GROUND RULES — DO NOT DEVIATE:
1. Tech Stack: React 18, TypeScript (strict), Vite, Tailwind CSS v3, React Router DOM v6, Zustand, Axios.
2. Design: Dark-mode first. Primary palette: Slate-900 background, Blue-500 primary, Green-500 success, Red-500 danger, Amber-500 warning.
3. No placeholder content — every UI element must match the DeployFix Lab product spec.
4. All components must be TypeScript with proper interfaces and named exports.
5. File structure: feature-first under src/features/<domain>/.
6. No inline styles — only Tailwind utility classes.
7. Accessibility: all interactive elements must have aria-labels and semantic HTML.
8. Component Reuse: check existing components before scaffolding new ones.
```
