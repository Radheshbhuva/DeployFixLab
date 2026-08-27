# DeployFix Lab — Theme Provider & State Management Specification

> **Document ID:** `DFIX-THEME-STATE-003`  
> **Status:** Production Specification  
> **Target Subsystems:** `frontend/src/store/themeStore.ts`, `frontend/src/components/theme/ThemeProvider.tsx`, `frontend/src/hooks/useTheme.ts`

---

## 🏗️ 1. Theme State Lifecycle

```
                                  USER ACTION / SYSTEM EVENT
                                               │
                                               ▼
                                ┌──────────────────────────────┐
                                │ useThemeStore.setTheme(mode) │ ('light' | 'dark' | 'system')
                                └──────────────┬───────────────┘
                                               │
                                               ▼
                                ┌──────────────────────────────┐
                                │ Update localStorage          │ ('deployfix-lab-theme')
                                └──────────────┬───────────────┘
                                               │
                                               ▼
                                ┌──────────────────────────────┐
                                │ Evaluate resolvedTheme       │ ('light' or 'dark')
                                └──────────────┬───────────────┘
                                               │
                                               ▼
                                ┌──────────────────────────────┐
                                │ Update document.documentElement
                                │  - classList.toggle('dark')  │
                                │  - style.colorScheme         │
                                └──────────────────────────────┘
```

---

## 📦 2. Implementation Model: `themeStore.ts`

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ThemeMode = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

interface ThemeState {
  theme: ThemeMode;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
}

export const getSystemTheme = (): ResolvedTheme => {
  if (typeof window === 'undefined') return 'dark';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'system',
      resolvedTheme: getSystemTheme(),
      setTheme: (theme) => {
        const resolved = theme === 'system' ? getSystemTheme() : theme;
        set({ theme, resolvedTheme: resolved });
        applyThemeToDOM(resolved);
      },
      toggleTheme: () => {
        const current = get().resolvedTheme;
        const next: ThemeMode = current === 'dark' ? 'light' : 'dark';
        get().setTheme(next);
      },
    }),
    {
      name: 'deployfix-lab-theme',
      partialize: (state) => ({ theme: state.theme }),
    }
  )
);

export function applyThemeToDOM(theme: ResolvedTheme) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  if (theme === 'dark') {
    root.classList.add('dark');
    root.classList.remove('light');
    root.style.colorScheme = 'dark';
  } else {
    root.classList.remove('dark');
    root.classList.add('light');
    root.style.colorScheme = 'light';
  }
}
```

---

## ⚙️ 3. `ThemeProvider.tsx` Integration

`ThemeProvider` listens for OS-level scheme adjustments via `matchMedia`:

```tsx
import React, { useEffect } from 'react';
import { useThemeStore, applyThemeToDOM, getSystemTheme } from '@/store/themeStore';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme, resolvedTheme, setTheme } = useThemeStore();

  useEffect(() => {
    applyThemeToDOM(resolvedTheme);

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (useThemeStore.getState().theme === 'system') {
        const nextSystem = getSystemTheme();
        useThemeStore.setState({ resolvedTheme: nextSystem });
        applyThemeToDOM(nextSystem);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [resolvedTheme]);

  return <>{children}</>;
};
```
