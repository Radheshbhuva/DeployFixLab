# 10 — Pages, Routing & App Root Module Specification for Antigravity

> **Prerequisites:** Specifications 00–09 must be reviewed first.
> This specification details the final integration step: React Router, App root, Vite configuration, environment variables, and package dependencies to implement in Antigravity.

---

## ANTIGRAVITY DIRECT IMPLEMENTATION BLUEPRINT:

```
Wire together the complete DeployFix Lab React application. This is the final integration step: React Router, App root, Vite configuration, environment variables, and the package.json dependencies.

---

PACKAGE.JSON (package.json):

{
  "name": "deployfix-lab-frontend",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint src --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "react-router-dom": "^6.22.0",
    "zustand": "^4.5.0",
    "axios": "^1.6.0",
    "react-hook-form": "^7.51.0",
    "@hookform/resolvers": "^3.3.0",
    "zod": "^3.22.0",
    "lucide-react": "^0.350.0",
    "recharts": "^2.12.0",
    "date-fns": "^3.6.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.0"
  },
  "devDependencies": {
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.2.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",
    "tailwindcss": "^3.4.0",
    "typescript": "^5.4.0",
    "vite": "^5.2.0",
    "eslint": "^8.57.0",
    "@typescript-eslint/eslint-plugin": "^7.0.0",
    "@typescript-eslint/parser": "^7.0.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.0"
  }
}

---

TSCONFIG (tsconfig.json):

{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}

---

VITE CONFIG (vite.config.ts):

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: process.env.VITE_API_BASE_URL || 'http://localhost:3000',
        changeOrigin: true,
      },
      '/ws': {
        target: process.env.VITE_WS_URL || 'ws://localhost:3000',
        ws: true,
      },
    },
  },
})

---

ENVIRONMENT VARIABLES (.env.example):

# API Configuration
VITE_API_BASE_URL=http://localhost:3000
VITE_WS_URL=ws://localhost:3000

# Environment Label (shown in header badge)
# Options: development | staging | production
VITE_ENVIRONMENT=development

# Feature Flags
VITE_ENABLE_AI_DIAGNOSIS=true
VITE_ENABLE_CHAOS_PANEL=true

# App Config
VITE_APP_NAME=DeployFix Lab
VITE_APP_VERSION=1.0.0

---

REACT ROUTER (src/app/router.tsx):

Use createBrowserRouter from react-router-dom.

Complete route table:

const router = createBrowserRouter([
  // PUBLIC ROUTES (wrapped in PublicOnlyRoute)
  {
    path: '/login',
    element: <PublicOnlyRoute><LoginPage /></PublicOnlyRoute>
  },
  {
    path: '/register',
    element: <PublicOnlyRoute><RegisterPage /></PublicOnlyRoute>
  },
  
  // PROTECTED ROUTES (wrapped in ProtectedRoute + AppLayout)
  {
    path: '/',
    element: <ProtectedRoute><AppLayout /></ProtectedRoute>,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />  // redirect / → /dashboard
      },
      {
        path: 'dashboard',
        element: <DashboardPage />
      },
      {
        path: 'labs',
        element: <LabCatalogPage />
      },
      {
        path: 'labs/:id',
        element: <LabExecutionPage />
      },
      {
        path: 'logs',
        element: <LogViewerPage />
      },
      {
        path: 'diagnosis',
        element: <DiagnosisPage />
      },
      {
        path: 'admin/chaos',
        element: (
          <RoleGuard allowedRoles={['ADMIN', 'INSTRUCTOR']}>
            <ChaosControlPage />
          </RoleGuard>
        )
      },
      {
        path: 'settings',
        element: <SettingsPage />    // placeholder
      },
    ]
  },
  
  // CATCH-ALL 404
  {
    path: '*',
    element: <NotFoundPage />
  }
]);

All page components should be loaded with React.lazy() and wrapped in Suspense with a LoadingSpinner fallback for code splitting.

---

APP ROOT (src/app/App.tsx):

import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { Toaster } from '../components/ui/Toast'; // Toast container

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  );
}

export default App;

---

MAIN ENTRY (src/main.tsx):

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app/App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

---

SETTINGS PAGE (placeholder) (src/pages/SettingsPage.tsx):

A simple placeholder page that says:
  Title: "Settings"
  Card: "Settings & preferences coming soon in a future version."
  Wrapped in AppLayout (via router, already inside the layout)

---

CN UTILITY (src/utils/cn.ts):

Create a className merging utility:

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

This should be used across all components to merge Tailwind classes safely.

---

DATE FORMATTER (src/utils/dateFormatter.ts):

Utility functions:
  formatRelativeTime(date: string | Date): string
    — returns "2 min ago", "1 hr ago", "3 days ago"
    — uses manual calculation (no external library dependency)
  
  formatTimestamp(date: string | Date): string
    — returns "HH:mm:ss.SSS" format for log viewer
  
  formatDateTime(date: string | Date): string
    — returns "13 Aug 2026, 14:32" format for display

---

INDEX.HTML (index.html):

<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="DeployFix Lab — AI-powered production deployment troubleshooting and recovery platform for engineers." />
    <meta name="theme-color" content="#0F172A" />
    
    <!-- Inter Font -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
    
    <title>DeployFix Lab — Engineering Platform</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>

---

FINAL INTEGRATION CHECKLIST:
Confirm the following are wired correctly:

1. ✓ All routes match the route table
2. ✓ ProtectedRoute guards all authenticated routes
3. ✓ PublicOnlyRoute wraps /login and /register
4. ✓ RoleGuard wraps /admin/chaos
5. ✓ All pages use React.lazy() for code splitting
6. ✓ AppLayout renders <Outlet /> from React Router for nested routes
7. ✓ Zustand authStore is used in ProtectedRoute to check isAuthenticated
8. ✓ Axios apiClient intercepts 401 and refreshes token
9. ✓ Toast notifications work globally
10. ✓ No TypeScript errors (strict mode)
11. ✓ `npm run dev` starts successfully on port 5173
12. ✓ All Tailwind utility classes resolve correctly
```

---

## TARGET FILES TO BUILD IN ANTIGRAVITY

Antigravity will construct:
- `package.json`
- `tsconfig.json`
- `vite.config.ts`
- `.env.example`
- `index.html`
- `src/main.tsx`
- `src/app/App.tsx`
- `src/app/router.tsx`
- `src/pages/SettingsPage.tsx`
- `src/utils/cn.ts`
- `src/utils/dateFormatter.ts`

---

## 🎉 COMPLETION CONFIRMATION

After executing this specification, the **full DeployFix Lab frontend** will be:

- ✅ Fully wired and bootable with `npm run dev`
- ✅ All 9 pages implemented and routed
- ✅ Complete design system applied
- ✅ Authentication with JWT in-memory storage
- ✅ Real-time log streaming UI
- ✅ AI Diagnosis Flow with structured output
- ✅ Admin Chaos Control Panel
- ✅ Responsive sidebar layout
- ✅ Dark-mode first, professional engineering aesthetic
- ✅ All TypeScript types defined
- ✅ Zero TypeScript errors in strict mode
