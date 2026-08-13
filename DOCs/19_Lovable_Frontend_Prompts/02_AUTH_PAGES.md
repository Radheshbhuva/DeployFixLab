# 02 — Authentication Module Specification for Antigravity

> **Prerequisites:** Specifications 00 and 01 must be reviewed first.
> This specification details the complete Authentication module: Login, Register, token management, Zustand store, and route protection guards to implement in Antigravity.

---

## ANTIGRAVITY DIRECT IMPLEMENTATION BLUEPRINT:

```
Build the complete Authentication module for DeployFix Lab. This includes the Login page, Registration page, Zustand auth store, Axios auth service, and route protection guards.

---

ZUSTAND AUTH STORE (src/store/authStore.ts):

Create a Zustand store with the following:

Interface:
  user: {
    id: string;
    email: string;
    fullName: string;
    role: 'STUDENT' | 'INSTRUCTOR' | 'ADMIN';
    avatarUrl?: string;
    createdAt: string;
  } | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

Actions:
  setUser(user, token): void  — stores user and token in memory
  clearAuth(): void           — wipes all auth state (logout)
  setLoading(bool): void      — toggle loading state

NOTE: The accessToken MUST be stored in-memory only. Never write to localStorage or sessionStorage.

---

AUTH SERVICE (src/services/authService.ts):

Create an Axios service with:
  - baseURL from import.meta.env.VITE_API_BASE_URL + '/api/v1/auth'
  - withCredentials: true  (for HttpOnly cookie refresh token)

Functions:
  login(email: string, password: string): Promise<LoginResponse>
    POST /api/v1/auth/login
    Returns: { user, accessToken }

  register(email, password, fullName): Promise<RegisterResponse>
    POST /api/v1/auth/register
    Returns: { user, accessToken }

  logout(): Promise<void>
    POST /api/v1/auth/logout

  refreshToken(): Promise<{ accessToken: string }>
    POST /api/v1/auth/refresh

---

AXIOS INTERCEPTOR (src/services/apiClient.ts):

Create an Axios instance with:
  - Request interceptor: attach Authorization: Bearer <accessToken> from authStore
  - Response interceptor: on 401, call refreshToken(), update store, retry original request
  - On refresh failure: call clearAuth() and redirect to /login

---

AUTH PAGES:

Create src/features/auth/ with:

1. LoginPage.tsx:
   
   Layout:
   - Full-screen AuthLayout (dark background, centered card)
   - Card: max-w-md, bg-surface, rounded-xl, p-8, shadow-2xl
   
   Header section:
   - Logo: A small terminal icon (Lucide Terminal icon in Blue-500) + "DeployFix Lab" text in text-text-primary font-bold text-2xl
   - Subtitle: "Sign in to your engineering workspace" in text-text-secondary text-sm
   
   Form (React Hook Form + Zod):
   - Email field: label "Email Address", type email, placeholder "engineer@company.com"
   - Password field: label "Password", type password, show/hide toggle (Lucide Eye / EyeOff icon)
   - Zod schema:
     email: z.string().email("Enter a valid email address")
     password: z.string().min(8, "Password must be at least 8 characters")
   - Submit button: full-width, Primary variant, text "Sign In", shows LoadingSpinner when submitting
   - Error display: if login fails, show a red alert box (bg-status-danger-dim border border-status-danger rounded-md p-3 text-status-danger text-sm) above the submit button
   
   Footer:
   - "Don't have an account? Register" link to /register

2. RegisterPage.tsx:

   Layout: Same AuthLayout as Login
   
   Header:
   - Same terminal icon + "DeployFix Lab"
   - Subtitle: "Create your engineering account"
   
   Form (React Hook Form + Zod):
   - Full Name field: label "Full Name", placeholder "Alex Johnson"
   - Email field: label "Email Address", placeholder "alex@company.com"
   - Password field: label "Password", show/hide toggle
   - Confirm Password field: label "Confirm Password", must match password
   - Zod schema:
     fullName: z.string().min(2, "Full name must be at least 2 characters")
     email: z.string().email("Enter a valid email address")
     password: z.string().min(8, "Password must be at least 8 characters")
       .regex(/[A-Z]/, "Must contain at least one uppercase letter")
       .regex(/[0-9]/, "Must contain at least one number")
     confirmPassword: must match password with .refine()
   
   - On submit: call register(), save to authStore, redirect to /dashboard
   - Success: redirect to /dashboard (no alert, seamless transition)
   - Error: red alert box same as login
   
   Footer:
   - "Already have an account? Sign In" link to /login

3. AuthLayout.tsx (src/layouts/AuthLayout.tsx):

   - Full viewport height: min-h-screen
   - Background: bg-primary (#0F172A)
   - Subtle grid pattern overlay (CSS background-image: grid lines in slate-800 opacity-30)
   - Center content vertically and horizontally
   - Include a subtle animated gradient background (very slow pulsing radial gradient from blue-900/20 to transparent)
   - Children rendered inside the centered card

---

ROUTE GUARDS (src/app/router.tsx or src/components/guards/):

1. ProtectedRoute.tsx:
   - If isAuthenticated = false, redirect to /login
   - While isLoading = true, show LoadingSpinner (full screen)
   - Otherwise render children

2. PublicOnlyRoute.tsx:
   - If isAuthenticated = true, redirect to /dashboard
   - Otherwise render children (used for /login and /register)

3. RoleGuard.tsx:
   - Props: allowedRoles: ('STUDENT' | 'INSTRUCTOR' | 'ADMIN')[]
   - If user.role not in allowedRoles, redirect to /dashboard
   - Used for /admin/chaos page

---

VISUAL DETAILS:
- The AuthLayout background should have a very faint hexagonal or dot grid pattern using CSS (not a library)
- Input focus states should show a blue glow (box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2))
- The card should have a very subtle glowing border: border border-slate-700 with a box-shadow: 0 0 40px rgba(59, 130, 246, 0.05)
- Smooth page transitions: fade-in animation on mount (0.2s ease)

---

TYPES (src/types/auth.types.ts):

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'STUDENT' | 'INSTRUCTOR' | 'ADMIN';
  avatarUrl?: string;
  createdAt: string;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
}

export interface RegisterResponse {
  user: User;
  accessToken: string;
}

export type UserRole = 'STUDENT' | 'INSTRUCTOR' | 'ADMIN';
```

---

## TARGET FILES TO BUILD IN ANTIGRAVITY

Antigravity will construct:
- `src/store/authStore.ts`
- `src/services/authService.ts`
- `src/services/apiClient.ts`
- `src/features/auth/LoginPage.tsx`
- `src/features/auth/RegisterPage.tsx`
- `src/layouts/AuthLayout.tsx`
- `src/components/guards/ProtectedRoute.tsx`
- `src/components/guards/PublicOnlyRoute.tsx`
- `src/components/guards/RoleGuard.tsx`
- `src/types/auth.types.ts`
