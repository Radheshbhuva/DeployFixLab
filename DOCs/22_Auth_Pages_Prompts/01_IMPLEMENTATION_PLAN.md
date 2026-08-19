# DeployFix Lab — Authentication Engineering Implementation Plan

> **Document ID:** `DFIX-AUTH-PLAN-001`  
> **Target Subsystem:** `frontend/src/features/auth/`, `frontend/src/layouts/`  
> **Status:** Approved Engineering Plan

---

## 🏗️ 1. Component Hierarchy & File Structure

```
frontend/src/
├── layouts/
│   └── AuthLayout.tsx                     # Split-screen responsive container with radial mesh glows
├── features/auth/
│   ├── LoginPage.tsx                      # Upgraded Sign In page with Demo Credentials & Zod validation
│   ├── RegisterPage.tsx                   # Upgraded Sign Up page with Password Strength Meter & Role Select
│   ├── types/
│   │   └── authForm.types.ts              # Strict TypeScript interfaces for form data and strength states
│   └── components/
│       ├── AuthSidebarShowcase.tsx        # Left-panel live diagnostic telemetry, status indicator & quote
│       ├── PasswordStrengthMeter.tsx      # Multi-bar visual meter with criteria checklist
│       ├── DemoCredentialsBanner.tsx      # 1-click engineer/admin credential pre-fill bar
│       └── RoleSelectorPills.tsx          # Role toggle (Student, SRE Engineer, Instructor)
├── store/
│   └── authStore.ts                       # Zustand state store with in-memory access token & persist
└── services/
    └── authService.ts                     # API client for login, register, refresh, me, logout
```

---

## 📋 2. Implementation Checklist & Phase Roadmap

### Phase 1: Types & Validation Contracts
- [ ] Create `frontend/src/features/auth/types/authForm.types.ts` defining:
  - `LoginFormData` & `RegisterFormData`
  - `PasswordRequirement` interface (`label`, `regex`, `met`)
  - `DemoAccountPreset` (`role`, `email`, `password`, `badge`)
- [ ] Create strict Zod validation schemas with descriptive error messages.

### Phase 2: Modular Sub-Components
- [ ] **`AuthSidebarShowcase.tsx`**:
  - Top branding header with version pill and live operational dot (`99.98%`).
  - Terminal code snippet demonstrating zero-secret client-side regex redaction.
  - Social proof quote from Principal SRE with avatar.
  - Security badges (TLS 1.3, SOC2 Type II, In-Memory Ephemeral Storage).
- [ ] **`PasswordStrengthMeter.tsx`**:
  - Calculates strength score ($0 - 100\%$) based on length, uppercase, numbers, and special characters.
  - Animated 4-segment colored bar (`Red` $\rightarrow$ `Amber` $\rightarrow$ `Emerald`).
  - Interactive checklist with checkmark/bullet toggles.
- [ ] **`DemoCredentialsBanner.tsx`**:
  - Displays quick-select buttons for *DevOps Student* (`student@deployfix.lab`) and *Lead SRE* (`sre@deployfix.lab`).
  - Pre-fills React Hook Form fields on click with a single state dispatch.
- [ ] **`RoleSelectorPills.tsx`**:
  - Custom styled radio-pill selector for `STUDENT`, `INSTRUCTOR`, and `SRE`.

### Phase 3: Page Integration & Layout Upgrade
- [ ] Update `frontend/src/layouts/AuthLayout.tsx` to support the split-screen layout on desktop while keeping a single centered card on mobile viewports.
- [ ] Update `frontend/src/features/auth/LoginPage.tsx` with high-contrast input styles, error alerts, and demo pre-fills.
- [ ] Update `frontend/src/features/auth/RegisterPage.tsx` with name, email, password strength meter, confirm password match validation, and role selection.

### Phase 4: Quality & Verification Gates
- [ ] Run `npm run type-check` (`tsc --noEmit`) to ensure 100% type soundness.
- [ ] Run `npm run build` to confirm zero bundle regressions.
- [ ] Verify test suite `npm test` passes all authentication integration tests.
