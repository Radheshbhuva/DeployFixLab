# DeployFix Lab — Sign In (Login) Page Specification

> **Document ID:** `DFIX-AUTH-LOGIN-003`  
> **Target Route:** `/login`  
> **Component:** `frontend/src/features/auth/LoginPage.tsx`

---

## 🎯 1. Overview & Objectives

The Sign In page provides authenticated access for engineers, students, and instructors. It prioritizes zero-friction evaluation by featuring a **1-Click Demo Credential Pre-fill Toolbar**, instant Zod schema validation, explicit error banners, and automatic redirection to previous deep links (`?redirect=/labs/lab-01`).

---

## 📋 2. Component Blueprint

```
┌─────────────────────────────────────────────────────────────┐
│ ⚡ [Icon] DeployFix Lab                                      │
│ Welcome Back, Engineer                                      │
│ Sign in to access your diagnostic workspaces & chaos labs   │
├─────────────────────────────────────────────────────────────┤
│ 🚀 Quick Demo Accounts (Click to Fill):                     │
│ [ 👨‍💻 Student: student@deployfix.lab ]                      │
│ [ 🛡️ Lead SRE: engineer@deployfix.lab ]                     │
├─────────────────────────────────────────────────────────────┤
│ ⚠️ [API Error Alert Banner (Conditional)]                   │
├─────────────────────────────────────────────────────────────┤
│ 📧 Email Address                                            │
│ [ engineer@deployfix.lab                                  ] │
│                                                             │
│ 🔑 Password                                                 │
│ [ ••••••••••••••••••                                 👁️ ] │
│                                                             │
│ [✓] Remember this browser              Forgot Password?    │
│                                                             │
│ [  ⚡ Sign In to Workspace                             → ] │
├─────────────────────────────────────────────────────────────┤
│ Don't have an account? Create an Account Free               │
└─────────────────────────────────────────────────────────────┘
```

---

## ⚙️ 3. State & Validation Contract

### Form Data Interface:
```typescript
export interface LoginFormData {
  email: string;
  password: string;
  rememberMe?: boolean;
}
```

### Zod Validation Schema:
```typescript
import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email address is required')
    .email('Please enter a valid email address (e.g. name@company.com)'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters'),
  rememberMe: z.boolean().optional(),
});
```

### Demo Accounts Dataset:
```typescript
export const DEMO_ACCOUNTS = [
  {
    role: 'Lead SRE',
    email: 'engineer@deployfix.lab',
    password: 'Password123!',
    badge: 'DEFAULT'
  },
  {
    role: 'Student Engineer',
    email: 'student@deployfix.lab',
    password: 'Password123!',
    badge: 'STUDENT'
  }
];
```

---

## 🔄 4. Submission & Redirection Pipeline

1. **User Submits**: `handleSubmit(onSubmit)` triggers client validation.
2. **Loading State**: Form fields disabled, submit button displays spinning `<Loader2 className="animate-spin" />` with *"Authenticating..."* label.
3. **API Dispatch**:
   ```typescript
   const res = await authService.login(data.email, data.password);
   ```
4. **Session Hydration**:
   - `authStore.setUser(res.user, res.accessToken)`
   - Set browser toast: `"Welcome back, ${res.user.fullName}!"`
5. **Redirection**:
   ```typescript
   const from = location.state?.from?.pathname || searchParams.get('redirect') || '/dashboard';
   navigate(from, { replace: true });
   ```
