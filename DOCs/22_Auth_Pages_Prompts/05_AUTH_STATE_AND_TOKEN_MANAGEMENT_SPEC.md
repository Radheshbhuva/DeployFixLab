# DeployFix Lab — Auth State & Token Management Specification

> **Document ID:** `DFIX-AUTH-STATE-005`  
> **Target Files:** `frontend/src/store/authStore.ts`, `frontend/src/services/apiClient.ts`

---

## 🔐 1. Token Lifecycle Architecture

DeployFix Lab implements an industry-standard **Dual-Token Authentication Strategy** designed to eliminate XSS token theft vulnerabilities while providing seamless session persistence.

```
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                                 Dual-Token Architecture                                     │
├───────────────────────────────────────────────┬─────────────────────────────────────────────┤
│         Short-Lived Access Token              │           Long-Lived Refresh Token          │
├───────────────────────────────────────────────┼─────────────────────────────────────────────┤
│ • Lifespan: 15 Minutes (900 seconds)          │ • Lifespan: 7 Days (604,800 seconds)        │
│ • Storage: In-Memory (Zustand Auth Store)     │ • Storage: HttpOnly, Secure, SameSite Cookie│
│ • Transmitted: `Authorization: Bearer <JWT>` │ • Transmitted: Automatic Cookie Header      │
│ • Vulnerable to XSS: ❌ NO (Not in storage)   │ • Vulnerable to JS Theft: ❌ NO (HttpOnly)  │
└───────────────────────────────────────────────┴─────────────────────────────────────────────┘
```

---

## 🧠 2. Zustand State Store (`authStore.ts`)

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types/auth.types';

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Actions
  setUser: (user: User, token: string) => void;
  setAccessToken: (token: string) => void;
  clearUser: () => void;
  setIsLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: true,

      setUser: (user, token) =>
        set({
          user,
          accessToken: token,
          isAuthenticated: true,
          isLoading: false,
        }),

      setAccessToken: (token) =>
        set({
          accessToken: token,
          isAuthenticated: true,
        }),

      clearUser: () =>
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
          isLoading: false,
        }),

      setIsLoading: (loading) =>
        set({
          isLoading: loading,
        }),
    }),
    {
      name: 'deployfix-auth',
      // Persist only non-sensitive user metadata across reloads
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);
```

---

## 🔄 3. 401 Silent Token Refresh Interceptor

When an authenticated API request receives `401 Unauthorized`, the client interceptor attempts silent token rotation before failing:

```typescript
let isRefreshing = false;
let failedQueue: Array<{ resolve: (token: string) => void; reject: (err: any) => void }> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });
  failedQueue = [];
};

export const handle401Error = async (originalRequest: any) => {
  if (isRefreshing) {
    return new Promise((resolve, reject) => {
      failedQueue.push({ resolve, reject });
    }).then((token) => {
      originalRequest.headers['Authorization'] = `Bearer ${token}`;
      return fetch(originalRequest);
    });
  }

  isRefreshing = true;

  try {
    const refreshRes = await fetch('/api/v1/auth/refresh', {
      method: 'POST',
      credentials: 'include', // Includes HttpOnly cookie
    });

    if (!refreshRes.ok) {
      throw new Error('Refresh token invalid or expired');
    }

    const { data } = await refreshRes.json();
    useAuthStore.getState().setAccessToken(data.accessToken);
    processQueue(null, data.accessToken);
    
    originalRequest.headers['Authorization'] = `Bearer ${data.accessToken}`;
    return fetch(originalRequest);
  } catch (err) {
    processQueue(err, null);
    useAuthStore.getState().clearUser();
    window.location.href = '/login?session_expired=true';
    return Promise.reject(err);
  } finally {
    isRefreshing = false;
  }
};
```
