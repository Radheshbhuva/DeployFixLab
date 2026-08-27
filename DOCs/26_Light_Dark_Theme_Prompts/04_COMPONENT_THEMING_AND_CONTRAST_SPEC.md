# DeployFix Lab — Component Theming & Contrast Specification

> **Document ID:** `DFIX-THEME-COMP-004`  
> **Status:** Production Specification  
> **Target Subsystems:** `frontend/src/components/ui/`, `frontend/src/features/`

---

## 📐 1. Component Theming Architecture

To ensure zero conflicts between light and dark themes:
1. **Never use hardcoded dark utility classes** like `bg-slate-900` or `text-white` on generic page surfaces. Always use semantic token utilities (`bg-bg-surface`, `text-text-primary`, `border-border-default`).
2. **Dedicated Terminal Surfaces**: Terminals, log consoles, and code diff blocks always retain dark styling (`bg-terminal-bg border-terminal-border text-terminal-text`).
3. **WCAG 2.2 AA Contrast Compliance**: All text must achieve minimum 4.5:1 contrast against its immediate parent surface.

---

## 🧩 2. Core UI Component Specifications

### 2.1 Cards (`Card.tsx`)
- **Light Theme**: `bg-bg-surface` (`#FFFFFF`), `border-border-default` (`#E2E8F0`), subtle drop shadow `shadow-sm shadow-slate-200/50`.
- **Dark Theme**: `bg-bg-surface` (`#1E293B`), `border-border-default` (`#475569`), deep shadow `shadow-xl shadow-black/20`.

### 2.2 Form Inputs (`Input.tsx`)
- **Light Theme**: `bg-bg-surface` (`#FFFFFF`), `border-border-default` (`#E2E8F0`), `text-text-primary` (`#0F172A`), placeholder `text-text-muted` (`#94A3B8`). Focus ring: `focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20`.
- **Dark Theme**: `bg-bg-primary/80` (`#0F172A`), `border-border-default` (`#475569`), `text-text-primary` (`#F8FAFC`), placeholder `text-text-muted` (`#64748B`).

### 2.3 Data Tables (`DataTable.tsx` & `UserManagementPage.tsx`)
- **Header Row**: `bg-bg-raised` (`#F1F5F9` in light, `#334155` in dark), `text-text-secondary`, `border-b border-border-default`.
- **Table Rows**: `hover:bg-bg-raised/50` transition, `border-b border-border-default/60`.

### 2.4 Modals & Dialogs (`Modal.tsx`)
- **Backdrop**: `bg-slate-950/60` backdrop-blur-sm.
- **Dialog Body**: `bg-bg-surface border border-border-default rounded-2xl shadow-2xl`.

### 2.5 Animated Theme Toggle (`ThemeToggle.tsx`)
- Pill button with rotating `<Sun>` (Amber-500) in light mode and `<Moon>` (Cyan-400) in dark mode.
- Smooth CSS rotation (`transform transition-transform duration-300`).
- Tooltip displaying current mode (`Light Mode`, `Dark Mode`, or `System Theme`).

### 2.6 Telemetry & Recharts Theming
- **Grid Lines**: `var(--border-default)` with 30% opacity.
- **Axis Text**: `var(--text-muted)` (size 11px).
- **Tooltip Container**: `bg-bg-surface border border-border-default text-text-primary shadow-xl rounded-lg`.
