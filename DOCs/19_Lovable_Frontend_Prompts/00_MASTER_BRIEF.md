# 00 — DeployFix Lab: Master Brief for Lovable

> **PASTE THIS ENTIRE FILE INTO YOUR LOVABLE PROJECT FIRST.**
> This establishes the product context. Every subsequent prompt will build on top of this.

---

## PRODUCT IDENTITY

**Product Name:** DeployFix Lab
**Product Code:** DFIX
**Product Type:** Full-stack Production Deployment Troubleshooting & Recovery Platform
**Version:** V1 MVP

---

## WHAT IS DEPLOYFIX LAB?

DeployFix Lab is a developer tool that acts as an **AI-powered deployment diagnosis engine**. When developers face broken deployments, failing containers, misconfigured Docker setups, or production incidents, DeployFix Lab:

1. **Collects Evidence** — reads GitHub repos, deployment logs, Dockerfiles, environment configs, health check responses, and production URLs
2. **Analyzes Root Causes** — correlates multi-source evidence into a structured diagnosis
3. **Explains the Problem** — produces clear, evidence-backed explanations with confidence scores
4. **Guides Recovery** — provides step-by-step recovery instructions
5. **Verifies Success** — confirms the deployment is healthy post-recovery

### The Core Product Philosophy
> DeployFix Lab never guesses. It diagnoses.
> Every conclusion is backed by observable evidence. Every recovery step is verifiable.

---

## USER ROLES

| Role | Who They Are | What They Do |
|------|-------------|--------------|
| **Student / Learner** | Junior/mid developers learning production ops | Run labs, diagnose injected failures, execute recovery |
| **Instructor / Author** | Senior devs, educators | Create lab scenarios, monitor student progress, inject custom failures |
| **DevOps Admin** | System administrator | Manage infrastructure, global user accounts, advanced telemetry |

---

## KEY FEATURES (V1 MVP)

1. **Authentication System** — JWT-based login, registration, token refresh, role-based access
2. **Dashboard** — Real-time service health cards, container status, system telemetry overview
3. **Lab System** — Browse a lab catalog → execute a lab → get a containerized failure scenario
4. **Chaos Injection Engine** — Controlled failure injection (DNS failures, DB connection errors, memory leaks, container crashes, schema drift, network dropouts)
5. **Log Viewer** — Live WebSocket log streaming with filtering, color-coded levels (INFO/WARN/ERROR)
6. **AI Diagnosis Flow** — Users upload/link evidence sources → system analyzes → structured diagnosis output with root cause + confidence %
7. **Recovery Guide** — Step-by-step recovery playbooks generated per diagnosis
8. **Admin Panel** — Chaos control panel for instructors and admins

---

## DESIGN PHILOSOPHY

### Visual Language
- **Dark-mode first** — engineering dashboards should feel like professional terminals, not consumer apps
- **Precision over decoration** — every UI element must communicate information clearly
- **Status-driven color** — color always maps to system state (green = operational, red = failed, amber = degraded, blue = interactive)
- **High information density** — this is a developer tool, not a landing page. Developers expect data-rich interfaces.

### Brand Aesthetic
- **Feels like:** Linear meets Vercel meets a professional monitoring dashboard
- **Tone:** Serious, precise, professional — but modern and clean
- **Not like:** Playful, cartoon-like, consumer SaaS, marketing landing pages

### Inspiration References
- Vercel Dashboard (clean deployment status UI)
- Linear (dark, high-density, precision-first)
- Datadog / Grafana (terminal-adjacent telemetry cards)
- GitHub dark mode (familiar to the target user)

---

## TECHNOLOGY STACK

| Tier | Technology | Version |
|------|-----------|---------|
| Core Framework | React | 18.3.x |
| Language | TypeScript | 5.4.x (strict mode) |
| Build Tool | Vite | 5.2.x |
| Routing | React Router DOM | 6.22.x |
| State Management | Zustand | 4.5.x |
| HTTP Client | Axios | 1.6.x |
| Styling | Tailwind CSS | 3.4.x |
| Form Handling | React Hook Form + Zod | 7.51.x |
| Icons | Lucide React | latest |
| Charts/Telemetry | Recharts | latest |
| Real-time | WebSocket (native browser API) | — |

---

## DESIGN TOKEN SYSTEM

### Color Palette

```
Background Primary:  #0F172A  (Slate-900)   — page backgrounds
Background Surface:  #1E293B  (Slate-800)   — cards, panels, modals
Background Raised:   #334155  (Slate-700)   — hover states, active elements
Border:              #475569  (Slate-600)   — dividers, card borders

Primary Blue:        #3B82F6  (Blue-500)    — buttons, links, active nav
Primary Hover:       #2563EB  (Blue-600)    — button hover states

Success Green:       #22C55E  (Green-500)   — operational, verified, 200 OK
Success Dim:         #166534  (Green-900)   — success badge backgrounds

Danger Red:          #EF4444  (Red-500)     — failed, critical, errors
Danger Dim:          #7F1D1D  (Red-900)     — error badge backgrounds

Warning Amber:       #F59E0B  (Amber-500)   — degraded, in-progress warnings
Warning Dim:         #78350F  (Amber-900)   — warning badge backgrounds

Text Primary:        #F1F5F9  (Slate-100)   — headings, primary text
Text Secondary:      #94A3B8  (Slate-400)   — labels, metadata, subtitles
Text Muted:          #64748B  (Slate-500)   — placeholders, disabled text

Terminal Green:      #4ADE80  (Green-400)   — live log stream text
Terminal Red:        #F87171  (Red-400)     — error log text
Terminal Amber:      #FCD34D  (Amber-300)   — warning log text
Terminal Cyan:       #67E8F9  (Cyan-300)    — timestamps, labels in logs
```

### Typography

```
Font Family:         'Inter' (Google Fonts) — all body text
Code/Terminal Font:  'JetBrains Mono' or 'Fira Code' — log viewer, code blocks
Heading Scale:       text-4xl / text-3xl / text-2xl / text-xl / text-lg
Body:                text-sm (14px) — dense dashboard layout standard
Caption/Meta:        text-xs (12px) — timestamps, labels
```

### Spacing & Sizing

```
Base unit:     4px (Tailwind default)
Card padding:  p-6 (24px)
Page padding:  px-8 py-6
Sidebar width: 240px (w-60)
Header height: 56px (h-14)
Border radius: rounded-lg (8px) for cards, rounded-md (6px) for inputs, rounded-full for badges
```

---

## PAGE MAP (ROUTE TABLE)

| Route | Page Name | Auth | Role |
|-------|-----------|------|------|
| `/login` | Login Page | Public | All |
| `/register` | Registration Page | Public | All |
| `/dashboard` | Main Dashboard | Protected | All |
| `/labs` | Lab Catalog | Protected | All |
| `/labs/:id` | Lab Execution | Protected | All |
| `/logs` | Log Viewer | Protected | All |
| `/diagnosis` | AI Diagnosis | Protected | All |
| `/admin/chaos` | Chaos Control | Protected | ADMIN, INSTRUCTOR |
| `*` | 404 Not Found | Public | All |

---

## DIRECTORY STRUCTURE (for Lovable to follow)

```
frontend/
├── public/
├── src/
│   ├── app/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── router.tsx
│   ├── assets/
│   ├── components/
│   │   ├── ui/                  # Atoms: Button, Card, Badge, Input, Modal
│   │   └── feedback/            # Skeleton, ErrorBoundary, LoadingSpinner
│   ├── features/
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── labs/
│   │   ├── logs/
│   │   ├── diagnosis/
│   │   └── admin/
│   ├── hooks/
│   ├── layouts/                 # AppLayout, AuthLayout
│   ├── services/                # Axios instances, API methods
│   ├── store/                   # Zustand slices
│   ├── types/                   # TypeScript interfaces
│   └── utils/
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

---

## COMPONENT ARCHITECTURE RULES

1. **UI Primitives** (`src/components/ui/`) — generic, un-opinionated atoms. No business logic.
2. **Feature Modules** (`src/features/<domain>/`) — domain-aware, connected to Zustand stores.
3. **Layouts** (`src/layouts/`) — page shell wrappers only. No feature logic inside layouts.
4. **All components** must export a named TypeScript interface for props.
5. **No magic strings** — all status values, roles, and config keys must be typed enums or const maps.

---

## SECURITY REQUIREMENTS (Frontend)

1. JWT access tokens stored **in-memory only** (never localStorage)
2. Refresh tokens managed via **HttpOnly cookies** (backend-controlled)
3. All routes under `/dashboard`, `/labs`, `/logs`, `/diagnosis`, `/admin` must be wrapped in `<ProtectedRoute>`
4. Admin-only routes must check role from Zustand `authStore` and redirect unauthorized users to `/dashboard`
5. All form inputs must use Zod schema validation before submission

---

## GROUND RULES — ALWAYS FOLLOW THESE

```
1. Tech Stack: React 18, TypeScript strict, Vite, Tailwind CSS v3, React Router DOM v6, Zustand, Axios.
2. Dark-mode first — Slate-900 background, always.
3. No placeholder lorem ipsum content — use realistic DeployFix Lab data.
4. All components typed with TypeScript interfaces.
5. Feature-first folder structure under src/features/<domain>/.
6. No inline styles — Tailwind utility classes only.
7. Accessibility: aria-label on all interactive elements, semantic HTML.
8. No CSS modules, no styled-components, no emotion — Tailwind only.
9. No default exports on components — always named exports.
10. All API calls go through src/services/ — never raw fetch() in components.
```

---

*This brief is the foundation. All subsequent prompts in files 01–10 build the actual pages and components on top of this.*
