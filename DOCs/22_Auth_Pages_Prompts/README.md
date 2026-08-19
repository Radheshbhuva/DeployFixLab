# DeployFix Lab — Sign In & Sign Up Specification & Prompt Pack

> **Module ID:** `DOCs/22_Auth_Pages_Prompts`  
> **Status:** Production Ready & Authoritative  
> **Framework:** React 18 (Vite SPA) + Tailwind CSS + Zustand + Zod + React Hook Form + Supabase Bridge

---

## 📌 Executive Overview

This directory provides the authoritative engineering specification, design system, component contracts, security guidelines, and copy-paste-ready AI master prompts for building and upgrading the **Sign In (Login)** and **Sign Up (Registration)** authentication subsystem for **DeployFix Lab**.

The authentication experience is designed as a high-density, cyberpunk/slate glassmorphic interface with a split-screen desktop layout (interactive incident telemetry preview on the left, high-security authentication forms on the right), instant Zod validation, visual password strength indicators, and seamless JWT + Supabase token synchronization.

---

## 📂 Document Index

| File | Document Title | Purpose & Focus |
|---|---|---|
| [`00_MASTER_AUTH_PAGES_BRIEF.md`](./00_MASTER_AUTH_PAGES_BRIEF.md) | **Master Auth Brief & Product Vision** | Target personas, session security model, conversion psychology, and UX requirements. |
| [`01_IMPLEMENTATION_PLAN.md`](./01_IMPLEMENTATION_PLAN.md) | **Engineering Implementation Plan** | File-by-file roadmap, component tree, form state flow, and quality verification gates. |
| [`02_DESIGN_SYSTEM_AND_LAYOUT_SPEC.md`](./02_DESIGN_SYSTEM_AND_LAYOUT_SPEC.md) | **Design System & Split Layout** | Color tokens, split-screen desktop layout, radial glows, inputs, buttons, and animations. |
| [`03_SIGNIN_PAGE_SPEC.md`](./03_SIGNIN_PAGE_SPEC.md) | **Sign In Page Specification** | Email/Password login, demo credentials quick-fill, "Remember Me", error banners, and redirects. |
| [`04_SIGNUP_PAGE_SPEC.md`](./04_SIGNUP_PAGE_SPEC.md) | **Sign Up Page Specification** | Full Name, Email, Password, real-time Strength Meter, Role selector, and onboarding triggers. |
| [`05_AUTH_STATE_AND_TOKEN_MANAGEMENT_SPEC.md`](./05_AUTH_STATE_AND_TOKEN_MANAGEMENT_SPEC.md) | **Token & State Architecture** | Zustand `authStore`, JWT memory storage, HttpOnly refresh cookie rotation, and Supabase bridge. |
| [`06_SECURITY_AND_VALIDATION_SPEC.md`](./06_SECURITY_AND_VALIDATION_SPEC.md) | **Security & Zod Validation** | Client-side input validation, rate limit UI handling, password complexity, and XSS defense. |
| [`07_ROUTING_AND_NAVIGATION_SPEC.md`](./07_ROUTING_AND_NAVIGATION_SPEC.md) | **Routing & Access Guards** | Public-only guards, post-login deep-link redirection (`?redirect=...`), and session expiry handlers. |
| [`08_AI_PROMPT_SUITE_MASTER_PROMPT.md`](./08_AI_PROMPT_SUITE_MASTER_PROMPT.md) | **Master AI Generation Prompts** | Copy-paste-ready prompts for AI coding agents to generate or refactor auth components. |

---

## ⚡ Quick Start Implementation Guide

To implement or upgrade the Auth subsystem using this prompt suite:

1. **Review Product Brief**: Read [`00_MASTER_AUTH_PAGES_BRIEF.md`](./00_MASTER_AUTH_PAGES_BRIEF.md) to understand target workflows.
2. **Review Layout & Design Tokens**: Inspect [`02_DESIGN_SYSTEM_AND_LAYOUT_SPEC.md`](./02_DESIGN_SYSTEM_AND_LAYOUT_SPEC.md) for CSS classes, split layout rules, and radial glow specs.
3. **Execute AI Master Prompts**: Use [`08_AI_PROMPT_SUITE_MASTER_PROMPT.md`](./08_AI_PROMPT_SUITE_MASTER_PROMPT.md) to generate the modular components in `frontend/src/features/auth/`.
4. **Verify Implementation**:
   ```bash
   cd frontend
   npm run type-check
   npm run build
   ```
