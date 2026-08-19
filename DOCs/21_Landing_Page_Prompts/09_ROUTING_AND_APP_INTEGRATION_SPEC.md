# 09 — DeployFix Lab: Routing & Application Integration Specification

---

## Document Metadata

| Field | Value |
|---|---|
| **Document Name** | Routing & Application Integration Specification |
| **Document ID** | DFIX-SPEC-021-09 |
| **Version** | 1.0.0 |
| **Status** | Approved |
| **Target File** | `frontend/src/app/router.tsx` |

---

## 1. Routing Architecture & Route Hierarchy

DeployFix Lab's React Router DOM configuration (`frontend/src/app/router.tsx`) will be updated to serve the public **Landing Page** at root `/` while preserving all authenticated application routes:

```
                                      ┌────────────────────────┐
                                      │   URL: "/" (ROOT)      │
                                      └───────────┬────────────┘
                                                  │
                                       <LandingPage /> (Public)
                                                  │
                ┌─────────────────────────────────┼─────────────────────────────────┐
                ▼                                 ▼                                 ▼
      ┌──────────────────┐              ┌──────────────────┐              ┌──────────────────┐
      │   "/login"       │              │  "/register"     │              │  "/dashboard"    │
      │   PublicOnlyRoute│              │  PublicOnlyRoute │              │  ProtectedRoute  │
      └──────────────────┘              └──────────────────┘              └────────┬─────────┘
                                                                                   │
                                                        ┌──────────────────────────┴──────────────────────────┐
                                                        ▼                          ▼                          ▼
                                               ┌─────────────────┐        ┌─────────────────┐        ┌─────────────────┐
                                               │ "/labs"         │        │ "/diagnosis"    │        │ "/logs"         │
                                               │ Lab Catalog     │        │ AI Studio       │        │ Live Stream     │
                                               └─────────────────┘        └─────────────────┘        └─────────────────┘
```

---

## 2. Updated Router Configuration (`frontend/src/app/router.tsx`)

```tsx
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '@/layouts/AppLayout';
import { ProtectedRoute } from '@/components/guards/ProtectedRoute';
import { PublicOnlyRoute } from '@/components/guards/PublicOnlyRoute';
import { RoleGuard } from '@/components/guards/RoleGuard';

import { LandingPage } from '@/features/landing/LandingPage';
import { LoginPage } from '@/features/auth/LoginPage';
import { RegisterPage } from '@/features/auth/RegisterPage';
import { DashboardPage } from '@/features/dashboard/DashboardPage';
import { LabCatalogPage } from '@/features/labs/LabCatalogPage';
import { LabExecutionPage } from '@/features/labs/LabExecutionPage';
import { LogViewerPage } from '@/features/logs/LogViewerPage';
import { DiagnosisPage } from '@/features/diagnosis/DiagnosisPage';
import { ChaosControlPage } from '@/features/admin/ChaosControlPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { NotFoundPage } from '@/pages/NotFoundPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/login',
    element: (
      <PublicOnlyRoute>
        <LoginPage />
      </PublicOnlyRoute>
    ),
  },
  {
    path: '/register',
    element: (
      <PublicOnlyRoute>
        <RegisterPage />
      </PublicOnlyRoute>
    ),
  },
  {
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: '/dashboard',
        element: <DashboardPage />,
      },
      {
        path: '/labs',
        element: <LabCatalogPage />,
      },
      {
        path: '/labs/:labId',
        element: <LabExecutionPage />,
      },
      {
        path: '/logs',
        element: <LogViewerPage />,
      },
      {
        path: '/diagnosis',
        element: <DiagnosisPage />,
      },
      {
        path: '/admin/chaos',
        element: (
          <RoleGuard allowedRoles={['ADMIN', 'INSTRUCTOR']}>
            <ChaosControlPage />
          </RoleGuard>
        ),
      },
      {
        path: '/settings',
        element: <SettingsPage />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);
```

---

## 3. Dynamic Authentication State in Landing Header

When an authenticated user visits `/`, the `LandingHeader` seamlessly detects active tokens via `useAuthStore` and renders a `"Go to Dashboard"` button instead of `"Sign In / Register"`:

```tsx
import { useAuthStore } from '@/store/authStore';

export const LandingHeader = () => {
  const { isAuthenticated, user } = useAuthStore();

  return (
    <header className="sticky top-0 z-50 ...">
      {/* Navigation links */}
      <div className="flex items-center gap-3">
        {isAuthenticated ? (
          <Link to="/dashboard" className="px-4 py-2 rounded-lg bg-cyan-500 text-slate-950 font-semibold text-sm">
            Dashboard ({user?.name || 'User'})
          </Link>
        ) : (
          <>
            <Link to="/login" className="text-slate-300 hover:text-white text-sm font-medium">
              Sign In
            </Link>
            <Link to="/register" className="px-4 py-2 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-semibold text-sm">
              Get Started
            </Link>
          </>
        )}
      </div>
    </header>
  );
};
```
