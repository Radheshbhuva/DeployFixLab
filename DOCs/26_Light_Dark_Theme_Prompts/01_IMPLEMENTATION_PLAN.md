# DeployFix Lab — Light & Dark Theme Technical Implementation Plan

> **Document ID:** `DFIX-THEME-PLAN-001`  
> **Status:** Production Implementation Plan  
> **Target Subsystems:** Frontend Theme Architecture & UI Components

---

## 🏗️ 1. Execution Phases

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ Phase 1: CSS Variables & Tailwind Engine Integration                        │
│ - Configure :root and .dark tokens in index.css                             │
│ - Map Tailwind tokens to var(--token) in tailwind.config.js                 │
├─────────────────────────────────────────────────────────────────────────────┤
│ Phase 2: Theme State & Anti-FOIT Storage Engine                             │
│ - Create Zustand themeStore.ts with persistence                             │
│ - Add inline theme detector script to index.html                            │
├─────────────────────────────────────────────────────────────────────────────┤
│ Phase 3: ThemeProvider & System Event Listeners                             │
│ - Build ThemeProvider.tsx syncing HTML class and colorScheme                │
│ - Build useTheme() custom hook                                              │
├─────────────────────────────────────────────────────────────────────────────┤
│ Phase 4: UI Controls & Header ThemeToggle                                   │
│ - Build animated ThemeToggle.tsx with Sun/Moon/System options               │
│ - Integrate ThemeToggle into Header.tsx and Mobile Sidebar                  │
├─────────────────────────────────────────────────────────────────────────────┤
│ Phase 5: Component-Level Light/Dark Refinements                             │
│ - Audit and upgrade Card, Input, Modal, DataTable, RoleBadge, etc.         │
│ - Ensure Recharts gridlines and tooltips adapt to theme                     │
├─────────────────────────────────────────────────────────────────────────────┤
│ Phase 6: Automated Testing & Visual Regression Checks                       │
│ - Write Vitest unit tests for themeStore and ThemeToggle                    │
│ - Verify zero console warnings, zero TS errors, and WCAG AA contrast        │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 📦 2. Deliverables & File Changes

1. `frontend/src/index.css` [MODIFY]: CSS variable tokens for `:root` and `.dark`.
2. `frontend/tailwind.config.js` [MODIFY]: Map color palette to CSS variables with `darkMode: 'class'`.
3. `frontend/index.html` [MODIFY]: Anti-FOIT inline bootstrapper script.
4. `frontend/src/store/themeStore.ts` [NEW]: Zustand theme state with `setTheme` and `toggleTheme`.
5. `frontend/src/hooks/useTheme.ts` [NEW]: React hook for declarative theme querying.
6. `frontend/src/components/theme/ThemeProvider.tsx` [NEW]: Root context syncing classes and media queries.
7. `frontend/src/components/theme/ThemeToggle.tsx` [NEW]: Interactive toggle button with micro-animations.
8. `frontend/src/layouts/components/Header.tsx` [MODIFY]: Embed `<ThemeToggle />` in top navigation.
9. `frontend/src/App.tsx` [MODIFY]: Wrap application in `<ThemeProvider>`.
10. `frontend/src/tests/themeStore.test.ts` [NEW]: Unit tests for theme switching and storage.

---

## 🔍 3. Verification Criteria

- [ ] **Instant Toggle**: Theme toggles in <16ms (60 FPS) without full page reloads.
- [ ] **Zero FOIT**: Refreshing in Light Mode shows 0 milliseconds of dark background.
- [ ] **Contrast Compliance**: Headings and body text maintain $\ge 4.5:1$ contrast ratio against backgrounds.
- [ ] **Preserved Terminal Authenticity**: Code terminals remain dark and high-contrast in both modes.
