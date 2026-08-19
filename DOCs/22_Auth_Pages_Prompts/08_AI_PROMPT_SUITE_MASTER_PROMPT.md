# DeployFix Lab — AI Master Prompt Suite: Sign In & Sign Up Implementation

> **Document ID:** `DFIX-AUTH-PROMPTS-008`  
> **Status:** Production-Ready Master Prompts  
> **Usage:** Copy-paste each prompt sequentially into an AI coding assistant (Google Antigravity, Claude Code, Cursor, Copilot Workspace) to generate the complete authentication subsystem.

---

## 🤖 Prompt 1: Types & Form Models

```markdown
You are an expert TypeScript & React engineer. Implement the authentication form types and demo accounts dataset for DeployFix Lab.

1. Create `frontend/src/features/auth/types/authForm.types.ts`:
   - Export `LoginFormData` with `email`, `password`, `rememberMe?: boolean`.
   - Export `RegisterFormData` with `fullName`, `email`, `role: 'STUDENT' | 'SRE' | 'INSTRUCTOR'`, `password`, `confirmPassword`, `termsAccepted: boolean`.
   - Export `PasswordCriterion` interface with `id`, `label`, `regex: RegExp`, `met: boolean`.
   - Export `DemoAccountPreset` with `role: string`, `email: string`, `password: string`, `badge: string`.

2. Create `frontend/src/features/auth/data/demoAccounts.ts`:
   - Export `DEMO_ACCOUNTS: DemoAccountPreset[]` with presets:
     - `Lead SRE / DevOps`: `engineer@deployfix.lab` / `Password123!` (Badge: DEFAULT)
     - `DevOps Student`: `student@deployfix.lab` / `Password123!` (Badge: STUDENT)
     - `Lab Instructor`: `instructor@deployfix.lab` / `Password123!` (Badge: INSTRUCTOR)

Enforce strict TypeScript without any 'any' types.
```

---

## 🤖 Prompt 2: Modular Auth Sub-Components

```markdown
You are an expert Tailwind CSS and React component engineer. Create the modular authentication sub-components for DeployFix Lab.

1. Create `frontend/src/features/auth/components/AuthSidebarShowcase.tsx`:
   - Split-screen left panel displaying:
     - Brand logo with cyan gradient badge (`DeployFix Lab v2.0`).
     - Live operational status dot (`All Systems Operational 99.98%`).
     - Real-time diagnostic terminal snippet demonstrating zero-secret client-side regex redaction.
     - Quote card from Principal SRE: *"DeployFix Lab cut our junior onboarding time in half. Realistic sandboxes eliminate alert fatigue."*
     - Security compliance badges: `TLS 1.3 Encryption`, `In-Memory JWT Storage`, `Docker Bridge Isolation`.

2. Create `frontend/src/features/auth/components/PasswordStrengthMeter.tsx`:
   - Accepts `password: string`.
   - Evaluates 4 criteria: length >= 8, at least 1 uppercase letter, at least 1 number, at least 1 special character.
   - Renders a 4-segment animated progress bar with colors (Red -> Amber -> Blue -> Emerald) and label (Weak, Fair, Good, Strong).
   - Renders interactive checklist items with green checkmarks when satisfied.

3. Create `frontend/src/features/auth/components/DemoCredentialsBanner.tsx`:
   - Accepts `onSelectPreset: (account: DemoAccountPreset) => void`.
   - Renders quick-fill pill buttons for the demo accounts from `demoAccounts.ts`.

4. Create `frontend/src/features/auth/components/RoleSelectorPills.tsx`:
   - Accepts `selectedRole: string`, `onSelectRole: (role: string) => void`.
   - Renders 3 selectable role pill cards (`STUDENT`, `SRE`, `INSTRUCTOR`) with custom icons and highlight borders.
```

---

## 🤖 Prompt 3: Split-Screen `AuthLayout.tsx`

```markdown
You are an expert frontend UI designer. Update `frontend/src/layouts/AuthLayout.tsx` to provide a stunning split-screen experience:

1. Responsive Layout:
   - On Desktop (>= 1024px): 12-column split-screen layout.
     - Left Column (5 cols): Renders `<AuthSidebarShowcase />`.
     - Right Column (7 cols): Renders `{children}` inside a glassmorphic card container (`max-w-md`).
   - On Mobile/Tablet (< 1024px): Hides left sidebar and renders a centered glassmorphic card.
2. Background:
   - Deep slate `#070A11` background.
   - Subtle mesh grid pattern (`radial-gradient(circle at 1px 1px, #1e293b 1px, transparent 0)`).
   - Cyan and violet radial blur spotlight glows (`bg-cyan-500/10`, `bg-blue-600/10 blur-3xl`).
```

---

## 🤖 Prompt 4: Upgraded `LoginPage.tsx`

```markdown
You are an expert React form engineer. Update `frontend/src/features/auth/LoginPage.tsx` with enterprise-grade UX:

1. Form Setup:
   - Use `react-hook-form` and `@hookform/resolvers/zod`.
   - Zod schema for `email` (valid email) and `password` (min 8 chars).
   - Integrate `<DemoCredentialsBanner />` allowing 1-click credential pre-filling into the form using `setValue`.
2. UI Elements:
   - Header with terminal icon and "Sign in to your engineering workspace".
   - High-contrast email and password inputs with `<Eye>` / `<EyeOff>` visibility toggle.
   - "Remember Me" checkbox and "Forgot Password?" helper link.
   - Primary submit button with gradient styling and loading state spinner.
   - Inline API error alert banner with `<AlertTriangle />`.
   - Link to `/register`.
3. Navigation:
   - On successful login, update `useAuthStore.setUser(res.user, res.accessToken)` and navigate to deep-link `from` or `/dashboard`.
```

---

## 🤖 Prompt 5: Upgraded `RegisterPage.tsx`

```markdown
You are an expert React form engineer. Update `frontend/src/features/auth/RegisterPage.tsx`:

1. Form Setup:
   - Use `react-hook-form` with Zod validation.
   - Fields: `fullName`, `email`, `role`, `password`, `confirmPassword`, `termsAccepted`.
   - Password confirmation equality validation.
2. UI Elements:
   - Header with "Create Your Engineering Account".
   - `<RoleSelectorPills />` for role selection (`STUDENT`, `SRE`, `INSTRUCTOR`).
   - Full Name and Email inputs with instant error validation.
   - Password input with `<PasswordStrengthMeter />` displayed below.
   - Confirm password input.
   - Security policy agreement checkbox.
   - Primary submit button with loading state.
   - Link to `/login`.
3. Auto-Login Flow:
   - Calls `authService.register()`, sets user in `useAuthStore`, shows toast, and navigates to `/dashboard`.
```

---

## 🤖 Prompt 6: Verification & Quality Gates

```markdown
Run the following commands to verify that the authentication implementation is completely sound and production-ready:

1. `cd frontend && npm run type-check` (Must pass with 0 errors).
2. `cd frontend && npm run build` (Must produce a valid production bundle).
3. `cd backend && npm test` (Must pass all 13 test suites and 56 tests).
```
