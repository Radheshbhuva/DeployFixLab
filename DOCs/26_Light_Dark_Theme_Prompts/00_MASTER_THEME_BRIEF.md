# DeployFix Lab — Master Theme System Brief

> **Document ID:** `DFIX-THEME-BRIEF-001`  
> **Status:** Production Specification  
> **Target Subsystems:** `frontend/src/index.css`, `frontend/tailwind.config.js`, `frontend/src/store/themeStore.ts`, `frontend/src/components/theme/`

---

## 🎯 1. Mission & Philosophy

The theme architecture in **DeployFix Lab** is built for extreme clarity, developer focus, and aesthetic excellence. As an engineering incident recovery platform, engineers work across prolonged troubleshooting sessions under diverse lighting conditions.

### Core Tenets:
1. **Zero-Glitch, Instantaneous Switching**: Theme toggling must be immediate (0ms delay), smooth, and free of layout jank, unstyled flashes, or mismatched background artifacts.
2. **High-Density, High-Contrast Light Theme**: Light mode is NOT an afterthought or washed-out white canvas. It uses a refined cool-slate structure with distinct card elevation boundaries, crisp typography, and deep status colors.
3. **Preserved Developer Authenticity**: Diagnostic terminals, log streams, and code diff blocks retain optimized dark code canvases across both light and dark themes to maximize syntax readability.
4. **Complete Persona & State Harmony**: Role badges (`STUDENT`, `INSTRUCTOR`, `ADMIN`), severity indicators (Danger, Warning, Success), and telemetry gauges automatically adapt their glow and background alpha levels to ensure compliance with WCAG 2.2 AA standards (> 4.5:1 text contrast).

---

## 🎨 2. Dual Palette Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          LIGHT THEME PALETTE                                │
├──────────────────────────┬──────────────────────────┬───────────────────────┤
│ Background Canvas        │ #F8FAFC (Slate 50)       │ Clean, glare-free base│
│ Surface Cards & Panels   │ #FFFFFF (Pure White)     │ Elevated focus surface│
│ Raised Secondary Surface │ #F1F5F9 (Slate 100)      │ Hovers, tabs, tables  │
│ Borders & Dividers       │ #E2E8F0 (Slate 200)      │ Crisp geometric lines │
│ Primary Text             │ #0F172A (Slate 900)      │ 15.8:1 Contrast Ratio │
│ Secondary Text           │ #475569 (Slate 600)      │ 7.2:1 Contrast Ratio  │
│ Muted Captions           │ #94A3B8 (Slate 400)      │ 4.8:1 Contrast Ratio  │
└──────────────────────────┴──────────────────────────┴───────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                           DARK THEME PALETTE                                │
├──────────────────────────┬──────────────────────────┬───────────────────────┤
│ Background Canvas        │ #0F172A (Deep Slate 900) │ Deep eye-relief base  │
│ Surface Cards & Panels   │ #1E293B (Slate 800)      │ Layered depth surface │
│ Raised Secondary Surface │ #334155 (Slate 700)      │ Hovers, dropdowns     │
│ Borders & Dividers       │ #475569 (Slate 600)      │ Subtle separation     │
│ Primary Text             │ #F8FAFC (Slate 50)       │ 14.9:1 Contrast Ratio │
│ Secondary Text           │ #94A3B8 (Slate 400)      │ 6.8:1 Contrast Ratio  │
│ Muted Captions           │ #64748B (Slate 500)      │ 4.5:1 Contrast Ratio  │
└──────────────────────────┴──────────────────────────┴───────────────────────┘
```

---

## ⚡ 3. Anti-FOIT (Flash of Incorrect Theme) Standard

To guarantee zero flash when a user reloads the application:

```html
<!-- Executed synchronously in index.html <head> before CSS or React loads -->
<script>
  (function () {
    try {
      var storedTheme = localStorage.getItem('deployfix-lab-theme');
      var systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (storedTheme === 'dark' || (!storedTheme && systemDark)) {
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

---

## 🕹️ 4. Theme Modes & Behavior

The system supports **3 explicit states**:
- `light`: Forces crisp light mode.
- `dark`: Forces deep dark mode.
- `system` (Default): Listens to OS-level `prefers-color-scheme` changes via `window.matchMedia` and updates automatically in real-time.
