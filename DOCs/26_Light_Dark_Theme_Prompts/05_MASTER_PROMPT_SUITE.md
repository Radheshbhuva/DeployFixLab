# DeployFix Lab — Master AI Prompt Suite: Light & Dark Theme System

> **Document ID:** `DFIX-THEME-PROMPTS-005`  
> **Status:** Production-Ready Master Prompt Suite  
> **Usage:** Copy and execute each prompt sequentially in an AI coding assistant (Google Antigravity, Claude Code, Cursor, Copilot) to generate the complete Light & Dark Theme subsystem.

---

## 📑 Prompt Index

- [Prompt 1: CSS Variable Design System & Tailwind Engine Setup](#-prompt-1-css-variable-design-system--tailwind-engine-setup)
- [Prompt 2: Theme State Management (`themeStore.ts`) & Anti-FOIT Script](#-prompt-2-theme-state-management-themestorets--anti-foit-script)
- [Prompt 3: ThemeProvider & Reactive System Scheme Listener](#-prompt-3-themeprovider--reactive-system-scheme-listener)
- [Prompt 4: Animated Theme Toggle Component (`ThemeToggle.tsx`)](#-prompt-4-animated-theme-toggle-component-themetoggletsx)
- [Prompt 5: Header, Sidebar & Layout Theming Integration](#-prompt-5-header-sidebar--layout-theming-integration)
- [Prompt 6: Component Library & Data Visualization Theming](#-prompt-6-component-library--data-visualization-theming)
- [Prompt 7: Verification, Automated Testing & Visual Regression Checks](#-prompt-7-verification-automated-testing--visual-regression-checks)

---

## 🤖 Prompt 1: CSS Variable Design System & Tailwind Engine Setup

```markdown
You are an expert Frontend Architect & Tailwind CSS Specialist. Configure the dynamic CSS variable token pipeline for DeployFix Lab to support both Light and Dark themes.

### Requirements:
1. Update `frontend/src/index.css`:
   - Define `:root` (Light Mode) with cool-slate & pure white tokens:
     - `--bg-primary: #F8FAFC;`
     - `--bg-surface: #FFFFFF;`
     - `--bg-raised: #F1F5F9;`
     - `--border-default: #E2E8F0;`
     - `--border-subtle: #F1F5F9;`
     - `--text-primary: #0F172A;`
     - `--text-secondary: #475569;`
     - `--text-muted: #94A3B8;`
     - `--brand-primary: #2563EB;`
     - `--brand-hover: #1D4ED8;`
     - `--status-success: #16A34A;`
     - `--status-success-dim: #DCFCE7;`
     - `--status-danger: #DC2626;`
     - `--status-danger-dim: #FEE2E2;`
     - `--status-warning: #D97706;`
     - `--status-warning-dim: #FEF3C7;`
     - Terminal tokens (always dark): `--terminal-bg: #0F172A; --terminal-border: #334155; --terminal-text: #F8FAFC; --terminal-green: #4ADE80; --terminal-red: #F87171; --terminal-amber: #FCD34D; --terminal-cyan: #67E8F9;`
   - Define `.dark` with deep slate/cyberpunk tokens:
     - `--bg-primary: #0F172A;`
     - `--bg-surface: #1E293B;`
     - `--bg-raised: #334155;`
     - `--border-default: #475569;`
     - `--border-subtle: #334155;`
     - `--text-primary: #F8FAFC;`
     - `--text-secondary: #94A3B8;`
     - `--text-muted: #64748B;`
     - `--brand-primary: #3B82F6;`
     - `--brand-hover: #2563EB;`
     - `--status-success: #22C55E;`
     - `--status-success-dim: #14532D;`
     - `--status-danger: #EF4444;`
     - `--status-danger-dim: #7F1D1D;`
     - `--status-warning: #F59E0B;`
     - `--status-warning-dim: #78350F;`
     - `--terminal-bg: #090D16; --terminal-border: #1E293B; --terminal-text: #F8FAFC;`
   - Update body base styles to use `bg-bg-primary text-text-primary` and smooth color transitions: `transition-colors duration-150`.
   - Update scrollbar styles to dynamically use `var(--bg-surface)` and `var(--border-default)`.

2. Update `frontend/tailwind.config.js`:
   - Set `darkMode: 'class'`.
   - Map all semantic colors to `var(--token)`.

Enforce clean CSS syntax without compilation errors.
```

---

## 🤖 Prompt 2: Theme State Management (`themeStore.ts`) & Anti-FOIT Script

```markdown
You are an expert TypeScript & State Management Engineer. Implement the Zustand theme store and anti-flash bootstrapper script for DeployFix Lab.

### Requirements:
1. Create `frontend/src/store/themeStore.ts`:
   - Export type `ThemeMode = 'light' | 'dark' | 'system'`.
   - Export type `ResolvedTheme = 'light' | 'dark'`.
   - Implement Zustand store `useThemeStore` with `persist` middleware (key: `'deployfix-lab-theme'`):
     - State: `theme: ThemeMode`, `resolvedTheme: ResolvedTheme`.
     - Actions: `setTheme: (theme: ThemeMode) => void`, `toggleTheme: () => void`.
   - Export helper function `getSystemTheme(): ResolvedTheme`.
   - Export helper function `applyThemeToDOM(theme: ResolvedTheme): void` that synchronizes `document.documentElement.classList` (`dark` vs `light`) and `document.documentElement.style.colorScheme`.

2. Update `frontend/index.html`:
   - Add synchronous inline `<script>` in `<head>` before any stylesheet or React bundle:
     ```html
     <script>
       (function () {
         try {
           var stored = localStorage.getItem('deployfix-lab-theme');
           var theme = stored ? JSON.parse(stored).state.theme : 'system';
           var isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
           if (isDark) {
             document.documentElement.classList.add('dark');
             document.documentElement.style.colorScheme = 'dark';
           } else {
             document.documentElement.classList.remove('dark');
             document.documentElement.style.colorScheme = 'light';
           }
         } catch (e) {}
       })();
     </script>
     ```

This guarantees 0ms Flash of Incorrect Theme (Anti-FOIT).
```

---

## 🤖 Prompt 3: ThemeProvider & Reactive System Scheme Listener

```markdown
You are an expert React & Frontend Engineer. Build the ThemeProvider component and custom `useTheme` hook for DeployFix Lab.

### Requirements:
1. Create `frontend/src/hooks/useTheme.ts`:
   - Custom hook returning `{ theme, resolvedTheme, isDark: resolvedTheme === 'dark', isLight: resolvedTheme === 'light', isSystem: theme === 'system', setTheme, toggleTheme }`.

2. Create `frontend/src/components/theme/ThemeProvider.tsx`:
   - Wraps children.
   - Listens to `window.matchMedia('(prefers-color-scheme: dark)')` change events.
   - Automatically updates `resolvedTheme` and DOM classes in real-time when the user changes their operating system theme and DeployFix Lab is in `'system'` mode.

3. Update `frontend/src/App.tsx`:
   - Wrap the root `<RouterProvider>` inside `<ThemeProvider>`.
```

---

## 🤖 Prompt 4: Animated Theme Toggle Component (`ThemeToggle.tsx`)

```markdown
You are an expert Tailwind CSS & Framer/Micro-Animation UI Specialist. Build the interactive ThemeToggle component for DeployFix Lab.

### Requirements:
1. Create `frontend/src/components/theme/ThemeToggle.tsx`:
   - Uses `useTheme()` hook.
   - Design: Sleek pill button with subtle border (`border-border-default hover:bg-bg-raised text-text-secondary hover:text-text-primary`).
   - Icon animations:
     - In Light mode: Renders `<Sun className="w-4 h-4 text-amber-500 transition-transform duration-300 rotate-0" />`.
     - In Dark mode: Renders `<Moon className="w-4 h-4 text-cyan-400 transition-transform duration-300 rotate-0" />`.
   - Supports 2 modes:
     - **Simple Click Mode**: Single click toggles between Light and Dark mode with smooth rotation animation.
     - **Dropdown Mode (Optional)**: Allows explicit selection of `Light`, `Dark`, or `System (Auto)`.
   - Includes accessible `aria-label="Toggle color theme"` and tooltip.
```

---

## 🤖 Prompt 5: Header, Sidebar & Layout Theming Integration

```markdown
You are a senior React Layout Engineer. Integrate the ThemeToggle into DeployFix Lab's navigation header and update all layout shells.

### Requirements:
1. Update `frontend/src/layouts/components/Header.tsx`:
   - Import and render `<ThemeToggle />` directly in the top action bar alongside the Environment Badge and Notifications icon.
   - Ensure header backdrop blur works cleanly in light mode (`bg-bg-surface/80 backdrop-blur-md border-b border-border-default`).

2. Update `frontend/src/layouts/components/Sidebar.tsx`:
   - Replace any remaining hardcoded dark colors with semantic utilities (`bg-bg-surface`, `border-border-default`, `text-text-primary`, `text-text-muted`, `hover:bg-bg-raised`).
   - Ensure navigation badges (`badge.variant`) render vibrant colors with readable contrast in both themes.

3. Update `frontend/src/layouts/AppLayout.tsx`:
   - Canvas background: `bg-bg-primary text-text-primary min-h-screen`.
```

---

## 🤖 Prompt 6: Component Library & Data Visualization Theming

```markdown
You are a UI Component & Design Systems Engineer. Audit and refine all DeployFix Lab core components and Recharts charts for dual theme harmony.

### Requirements:
1. Audit and update:
   - `frontend/src/components/ui/Card.tsx`: Uses `bg-bg-surface border-border-default shadow-sm`.
   - `frontend/src/components/ui/Input.tsx`: Clean focus ring in light and dark mode.
   - `frontend/src/components/ui/Modal.tsx`: Clean surface styling with soft backdrop.
   - `frontend/src/components/ui/DataTable.tsx`: Light/dark header backgrounds and zebra stripes.
   - `frontend/src/components/ui/RoleBadge.tsx`: Ensure badge backgrounds (`cyan-500/10` vs `amber-500/10` vs `rose-500/10`) have clear contrast on white/slate cards.

2. Telemetry & Log Viewer (`LogViewerPage.tsx` / `CodeBlock.tsx`):
   - Terminal and log streaming viewports MUST remain dark (`bg-terminal-bg border-terminal-border text-terminal-text`) with terminal green/red/cyan accents, preserving incident room feel.

3. Charts & Gauges:
   - Dynamic grid line color (`var(--border-default)`) and tooltip backgrounds (`bg-bg-surface border-border-default text-text-primary`).
```

---

## 🤖 Prompt 7: Verification, Automated Testing & Visual Regression Checks

```markdown
You are a QA & Test Automation Engineer. Implement unit and component tests verifying the Light & Dark theme subsystem.

### Requirements:
1. Create `frontend/src/tests/themeStore.test.ts` (using Vitest):
   - Test initial default resolution.
   - Test `setTheme('light')` sets `resolvedTheme: 'light'`, updates `localStorage`, and sets `document.documentElement` class.
   - Test `setTheme('dark')` sets `resolvedTheme: 'dark'`, updates `localStorage`, and sets `.dark` class.
   - Test `toggleTheme()` flips between light and dark.

2. Create `frontend/src/tests/ThemeToggle.test.tsx`:
   - Tests clicking `<ThemeToggle />` changes the active theme and toggles the DOM class.

3. Verify that running `npm run test` passes with 100% success rate.
```
