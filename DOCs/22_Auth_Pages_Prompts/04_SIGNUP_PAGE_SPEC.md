# DeployFix Lab — Sign Up (Registration) Page Specification

> **Document ID:** `DFIX-AUTH-REGISTER-004`  
> **Target Route:** `/register`  
> **Component:** `frontend/src/features/auth/RegisterPage.tsx`

---

## 🎯 1. Overview & Objectives

The Sign Up page handles user onboarding. It incorporates interactive password strength validation, engineering role selection, inline requirement checklists, and automatic login with instant workspace provisioning.

---

## 📋 2. Component Blueprint

```
┌─────────────────────────────────────────────────────────────┐
│ ⚡ [Icon] DeployFix Lab                                      │
│ Create Your Engineering Account                             │
│ Start diagnosing broken deployments in sandboxed containers │
├─────────────────────────────────────────────────────────────┤
│ 🏷️ Select Your Primary Role:                                │
│ [ 👨‍💻 Student / Junior ] [ 🛡️ SRE / DevOps ] [ 🎓 Instructor ] │
├─────────────────────────────────────────────────────────────┤
│ 👤 Full Name                                                │
│ [ Alex Johnson                                            ] │
│                                                             │
│ 📧 Work / University Email Address                          │
│ [ alex@company.com                                        ] │
│                                                             │
│ 🔑 Create Password                                          │
│ [ ••••••••••••••••••                                 👁️ ] │
│                                                             │
│ 📊 Password Strength: [====    ] Strong                     │
│    ✓ At least 8 characters        ✓ 1 uppercase letter      │
│    ✓ 1 number                    ✓ 1 special character     │
│                                                             │
│ 🔁 Confirm Password                                         │
│ [ ••••••••••••••••••                                      ] │
│                                                             │
│ [✓] I agree to the Zero-Secret Security & Privacy Policy    │
│                                                             │
│ [  🚀 Create Account & Launch Lab                      → ] │
├─────────────────────────────────────────────────────────────┤
│ Already have an account? Sign In to Workspace               │
└─────────────────────────────────────────────────────────────┘
```

---

## ⚙️ 3. State & Validation Contract

### Form Data Interface:
```typescript
export interface RegisterFormData {
  fullName: string;
  email: string;
  role: 'STUDENT' | 'SRE' | 'INSTRUCTOR';
  password: string;
  confirmPassword: string;
  termsAccepted: boolean;
}
```

### Zod Validation Schema:
```typescript
import { z } from 'zod';

export const registerSchema = z
  .object({
    fullName: z
      .string()
      .min(2, 'Full name must be at least 2 characters')
      .max(64, 'Full name must be under 64 characters'),
    email: z
      .string()
      .min(1, 'Email address is required')
      .email('Please enter a valid email address'),
    role: z
      .enum(['STUDENT', 'SRE', 'INSTRUCTOR'])
      .default('STUDENT'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Must contain at least one uppercase letter (A-Z)')
      .regex(/[0-9]/, 'Must contain at least one number (0-9)')
      .regex(/[^A-Za-z0-9]/, 'Must contain at least one special character (!@#$%^&*)'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    termsAccepted: z
      .boolean()
      .refine((val) => val === true, 'You must accept the security policy to register'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });
```

---

## 🔄 4. Registration Execution Flow

1. **User Submits**: Validation passes on all fields and matching password confirmation.
2. **API Dispatch**:
   ```typescript
   const res = await authService.register(
     data.email,
     data.password,
     data.fullName,
     data.role
   );
   ```
3. **Automatic Workspace Provisioning**:
   - Backend creates user in PostgreSQL via Prisma with hashed password (`bcryptjs`).
   - Issues short-lived access token and HttpOnly refresh token cookie.
4. **State Update & Route Navigation**:
   - `authStore.setUser(res.user, res.accessToken)`
   - Dispatches toast: `"Account created! Welcome to DeployFix Lab, ${data.fullName}."`
   - Navigates to `/dashboard` (or selected lab redirect).
