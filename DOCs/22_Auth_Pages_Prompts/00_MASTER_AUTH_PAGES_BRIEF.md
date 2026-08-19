# DeployFix Lab — Master Authentication Pages Brief

> **Document ID:** `DFIX-AUTH-BRIEF-001`  
> **Status:** Production Specification  
> **Target Subsystems:** `frontend/src/features/auth/`, `frontend/src/layouts/AuthLayout.tsx`

---

## 🎯 1. Mission & Product Philosophy

The authentication experience in **DeployFix Lab** is not just a standard login gate—it is the direct gateway to an advanced containerized troubleshooting environment. As a platform built for Site Reliability Engineers, DevOps professionals, and backend developers, the authentication interface must project **technical excellence, rock-solid security posture, and zero friction**.

### Core Tenets:
1. **Developer-First Ergonomics**: Instant feedback, keyboard navigation support (Enter to submit, Tab between fields), password visibility toggles, and instant demo credential pre-filling for test evaluation.
2. **High-Density Cyberpunk/Slate Aesthetic**: Split-screen glassmorphic design on desktop showcasing real-time simulated telemetry, log streams, and zero-secret security assurances on the left, with ultra-clean, accessible forms on the right.
3. **Enterprise Security Transparency**: Clear indicators of client-side secret protection, TLS 1.3 encryption, and compliance badges directly adjacent to credential inputs.
4. **Resilient Dual-Auth Bridge**: Native Express REST API authentication (`/api/v1/auth/*`) with JWT memory storage and HttpOnly refresh cookies, architected with direct hook points for the client-side Supabase authentication layer.

---

## 👥 2. Target Personas & Conversion Scenarios

| Persona | Primary Goal | Auth Needs & Pain Points |
|---|---|---|
| **Junior SRE / Student** | Practice incident recovery labs without risking production systems. | Needs fast, friction-free registration with email/password and immediate redirection into their selected scenario (`/labs/:id`). |
| **Senior DevOps Engineer** | Evaluate the 4-source AI correlation engine against actual deployment outages. | Appreciates the "Demo Credentials" 1-click login button to rapidly test the diagnosis studio without entering throwaway credentials. |
| **Platform Lead / Instructor** | Manage chaos experiments and cohort telemetry across engineering teams. | Needs clear role selection (`Student` vs `Instructor` vs `SRE`) and team invitation parameter persistence. |

---

## 📐 3. Split-Screen Layout Architecture (Desktop $\ge$ 1024px)

```
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                                DeployFix Lab Auth Shell                                     │
├───────────────────────────────────────────────┬─────────────────────────────────────────────┤
│            LEFT COLUMN (55% Width)            │           RIGHT COLUMN (45% Width)          │
│          Incident Telemetry & Trust           │           Authentication Form Card          │
├───────────────────────────────────────────────┼─────────────────────────────────────────────┤
│  ⚡ DeployFix Lab Brand & Live Status (99.98%) │  🏷️ Form Mode Header: Sign In / Create Acc  │
│                                               │                                             │
│  🖥️ Simulated Live Diagnostic Terminal:        │  📧 Input: Email Address (Auto-validated)   │
│     - Ingested Evidence Summary               │  🔑 Input: Password (with Show/Hide Toggle) │
│     - Capped Confidence Gauge (94% High)      │  📊 (Signup only) Password Strength Meter   │
│     - Root Cause & Remediation Diff           │  🛡️ (Signup only) Role Selection Tabs       │
│                                               │                                             │
│  🛡️ Zero-Secret Security Callout:              │  ⚡ Primary Action: "Sign In" / "Create"   │
│     - Client-side regex password protection   │  🚀 Demo Credentials 1-Click Quickfill      │
│     - Transient in-memory token lifecycle     │                                             │
│                                               │  🔗 Switcher Link: Sign In ↔ Register      │
│  ⭐ Verified SRE Testimonial Quote Badge      │  🔒 Legal & Zero-Retention Privacy Note     │
└───────────────────────────────────────────────┴─────────────────────────────────────────────┘
```

---

## 🔐 4. Authentication Flow & State Lifecycle

1. **Sign In (`/login`)**:
   - User inputs email and password or clicks **"Pre-fill Demo Credentials"**.
   - Client validates fields via Zod schema (`email`, `min 8 chars`).
   - Dispatches `POST /api/v1/auth/login`.
   - On `200 OK`: Server returns `{ user, accessToken, expiresIn: 900 }` and sets an `HttpOnly`, `SameSite=Lax` refresh cookie (`/api/v1/auth/refresh`).
   - Zustand `authStore.setUser(user, accessToken)` updates globally.
   - User is redirected to `from` state (e.g. `/labs/lab-01` or `/dashboard`).

2. **Sign Up (`/register`)**:
   - User provides `fullName`, `email`, `password`, `confirmPassword`, and optional role selection.
   - Real-time password strength meter validates:
     - Minimum 8 characters (+20%)
     - At least one uppercase letter (+25%)
     - At least one number (+25%)
     - At least one special character (+30%)
   - Dispatches `POST /api/v1/auth/register`.
   - Automatically signs in the user upon successful registration and redirects to `/dashboard`.

3. **Error Handling & Resilience**:
   - `401 Unauthorized` $\rightarrow$ Displays inline error banner: *"Invalid email or password. Please check your credentials."*
   - `409 Conflict` $\rightarrow$ *"An account with this email address already exists. Sign in instead."*
   - `429 Too Many Requests` $\rightarrow$ *"Rate limit exceeded. Please wait 60 seconds before trying again."*
