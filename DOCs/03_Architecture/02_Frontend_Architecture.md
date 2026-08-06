# 02 — Frontend Architecture Specification

---

## Document Metadata

| Field               | Value                                                             |
|---------------------|-------------------------------------------------------------------|
| **Document Name**   | Frontend Architecture Specification                               |
| **Document ID**     | DFIX-ARCH-002                                                     |
| **Version**         | 1.0.0                                                             |
| **Status**          | Approved                                                          |
| **Owner**           | Frontend Engineering Lead                                         |
| **Reviewer**        | Principal Architect, UI/UX Lead                                   |
| **Classification**  | Internal — Confidential                                           |
| **Created Date**    | 2026-08-02                                                        |
| **Last Updated**    | 2026-08-06                                                        |
| **Project**         | DeployFix Lab                                                     |
| **Project Code**    | DFIX                                                              |

---

# 1. Frontend Architecture Overview

The frontend of **DeployFix Lab** is built as a highly responsive, modern Single Page Application (SPA) using **React 18**, **TypeScript**, and **Vite**. It provides the primary user interface for learners and administrators to monitor service status, execute troubleshooting labs, trigger controlled failures, and inspect live container logs.

## 1.1 Key Architectural Drivers
* **Modularity:** Feature-first directory structure (`features/auth`, `features/dashboard`, `features/labs`).
* **Performance:** Sub-3 second initial bundle load time via Vite code-splitting and dynamic imports.
* **Type Safety:** 100% TypeScript coverage across state models, API responses, and UI props.
* **Resilience:** Graceful handling of network timeouts, API disconnects, and backend degradation states.

---

# 2. Technology Stack & Component Libraries

| Tier | Library / Tool | Version | Purpose |
|---|---|---|---|
| **Core UI Engine** | React | ^18.3.0 | Component rendering engine & Concurrent React features |
| **Language** | TypeScript | ^5.4.0 | Static type checking and interface enforcement |
| **Build Tooling** | Vite | ^5.2.0 | Hot Module Replacement (HMR) & fast ES module bundling |
| **Routing** | React Router DOM | ^6.22.0 | Declarative client-side routing & protected route guards |
| **State Management** | Zustand | ^4.5.0 | Lightweight global store for Auth, Lab states, and UI preferences |
| **HTTP Client** | Axios | ^1.6.0 | REST API client with request/response interceptors |
| **Form Handling** | React Hook Form + Zod | ^7.51.0 | Uncontrolled form inputs with schema-based validation |
| **Styling Engine** | Tailwind CSS | ^3.4.0 | Utility-first CSS styling system |
| **Icons & Charts** | Lucide React / Recharts | ^0.350.0 | Iconography and telemetry charts |

---

# 3. Directory & Folder Structure

```
frontend/
├── public/                     # Static assets (favicons, manifest)
├── src/
│   ├── app/                    # Application setup & root providers
│   │   ├── App.tsx             # Root component with layout wrapping
│   │   ├── main.tsx            # DOM mount point & global styles
│   │   └── router.tsx          # React Router route definitions
│   ├── assets/                 # SVGs, images, brand design tokens
│   ├── components/             # Shared reusable UI primitives
│   │   ├── ui/                 # Buttons, Cards, Inputs, Modals, Badges
│   │   └── feedback/           # Loaders, Skeleton screens, Error Boundaries
│   ├── features/               # Feature-based modular domains
│   │   ├── auth/               # Login, Register, JWT Token Refresh hooks
│   │   ├── dashboard/          # Telemetry widgets, Container Health Cards
│   │   ├── labs/               # Lab catalog, Chaos injector controls, Verification runner
│   │   └── logs/               # Live log viewer stream component (WebSocket)
│   ├── hooks/                  # Global custom React hooks (`useAuth`, `useSocket`)
│   ├── layouts/                # Base layouts (`AppLayout`, `AuthLayout`)
│   ├── services/               # Axios API client instances and request methods
│   ├── store/                  # Zustand store slices (`authStore.ts`, `labStore.ts`)
│   ├── types/                  # Shared TypeScript interfaces (`lab.types.ts`, `user.types.ts`)
│   └── utils/                  # Helper utilities (`dateFormatter`, `tokenStorage`)
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

---

# 4. State Management Strategy (Zustand)

Global state is segregated into predictable, lightweight Zustand store slices:

```
                  ┌────────────────────────────────┐
                  │          Global Store          │
                  └───────────────┬────────────────┘
                                  │
         ┌────────────────────────┼────────────────────────┐
         ▼                        ▼                        ▼
┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│    Auth Store    │    │    Lab Store     │    │   Log Viewer     │
│ - user           │    │ - activeLab      │    │ - logEntries[]   │
│ - token          │    │ - status         │    │ - isConnected    │
│ - isAuthenticated│    │ - verifyResults  │    │ - filterLevel    │
└──────────────────┘    └──────────────────┘    └──────────────────┘
```

---

# 5. Security & Authentication Flow

1. **Access Token Handling:** Access tokens are stored in-memory within the `authStore` (never written to `localStorage` or `sessionStorage` to mitigate XSS attacks).
2. **Refresh Token Handling:** Managed via `HttpOnly`, `SameSite=Strict` cookies issued by backend.
3. **Axios Interceptor:** Intercepts outgoing HTTP requests to append `Authorization: Bearer <token>` and catches `401 Unauthorized` responses to auto-trigger background token refreshes (`/api/v1/auth/refresh`).
