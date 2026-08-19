# DeployFix Lab — Auth Routing & Navigation Specification

> **Document ID:** `DFIX-AUTH-ROUTING-007`  
> **Target Files:** `frontend/src/app/router.tsx`, `frontend/src/components/guards/`

---

## 🚦 1. Route Guard Architecture

DeployFix Lab enforces strict route isolation using declarative React Router DOM wrapper components:

```
                      ┌───────────────────────────┐
                      │    Incoming Route URL     │
                      └─────────────┬─────────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    ▼                               ▼
       ┌─────────────────────────┐     ┌─────────────────────────┐
       │   Public Only Route     │     │     Protected Route     │
       │   (`/login`, `/register`)│     │  (`/dashboard`, `/labs`) │
       └────────────┬────────────┘     └────────────┬────────────┘
                    │                               │
           Is Authenticated?                Is Authenticated?
             ├── YES ──► Redirect /dashboard  ├── YES ──► Render Child Route
             └── NO  ──► Render Form          └── NO  ──► Redirect /login?from=...
```

---

## 🛡️ 2. Route Guard Implementations

### 1. `PublicOnlyRoute.tsx`:
```typescript
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

export const PublicOnlyRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuthStore();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#070A11] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-cyan-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (isAuthenticated) {
    const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard';
    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
};
```

### 2. `ProtectedRoute.tsx`:
```typescript
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuthStore();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#070A11] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-cyan-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
```
