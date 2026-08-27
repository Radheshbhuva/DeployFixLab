# DeployFix Lab — Design Tokens & Color System Specification

> **Document ID:** `DFIX-THEME-TOKENS-002`  
> **Status:** Production Specification  
> **Target Subsystems:** `frontend/src/index.css`, `frontend/tailwind.config.js`

---

## 🎨 1. CSS Variable Architecture

All semantic colors are defined as raw RGB or HEX variables in `frontend/src/index.css`. This enables standard opacity modifier support in Tailwind (e.g. `bg-bg-surface/80`, `text-text-primary/90`).

```css
@layer base {
  :root {
    /* Base Canvases (Light Mode) */
    --bg-primary: #F8FAFC;         /* Slate 50 */
    --bg-surface: #FFFFFF;         /* White */
    --bg-raised: #F1F5F9;          /* Slate 100 */
    --border-default: #E2E8F0;     /* Slate 200 */
    --border-subtle: #F1F5F9;      /* Slate 100 */

    /* Typography (Light Mode) */
    --text-primary: #0F172A;       /* Slate 900 */
    --text-secondary: #475569;     /* Slate 600 */
    --text-muted: #94A3B8;         /* Slate 400 */

    /* Brand & Accent (Light Mode) */
    --brand-primary: #2563EB;      /* Blue 600 */
    --brand-hover: #1D4ED8;        /* Blue 700 */

    /* Status Tokens (Light Mode) */
    --status-success: #16A34A;     /* Green 600 */
    --status-success-dim: #DCFCE7; /* Green 100 */
    --status-danger: #DC2626;      /* Red 600 */
    --status-danger-dim: #FEE2E2;  /* Red 100 */
    --status-warning: #D97706;     /* Amber 600 */
    --status-warning-dim: #FEF3C7; /* Amber 100 */

    /* Terminal Subsystem (Always Dark) */
    --terminal-bg: #0F172A;        /* Slate 900 */
    --terminal-border: #334155;    /* Slate 700 */
    --terminal-text: #F8FAFC;      /* Slate 50 */
    --terminal-green: #4ADE80;
    --terminal-red: #F87171;
    --terminal-amber: #FCD34D;
    --terminal-cyan: #67E8F9;
  }

  .dark {
    /* Base Canvases (Dark Mode) */
    --bg-primary: #0F172A;         /* Slate 900 */
    --bg-surface: #1E293B;         /* Slate 800 */
    --bg-raised: #334155;          /* Slate 700 */
    --border-default: #475569;     /* Slate 600 */
    --border-subtle: #334155;      /* Slate 700 */

    /* Typography (Dark Mode) */
    --text-primary: #F8FAFC;       /* Slate 50 */
    --text-secondary: #94A3B8;     /* Slate 400 */
    --text-muted: #64748B;         /* Slate 500 */

    /* Brand & Accent (Dark Mode) */
    --brand-primary: #3B82F6;      /* Blue 500 */
    --brand-hover: #2563EB;        /* Blue 600 */

    /* Status Tokens (Dark Mode) */
    --status-success: #22C55E;     /* Green 500 */
    --status-success-dim: #14532D; /* Green 900 */
    --status-danger: #EF4444;      /* Red 500 */
    --status-danger-dim: #7F1D1D;  /* Red 900 */
    --status-warning: #F59E0B;     /* Amber 500 */
    --status-warning-dim: #78350F; /* Amber 900 */

    /* Terminal Subsystem */
    --terminal-bg: #090D16;        /* Deep Black/Slate */
    --terminal-border: #1E293B;    /* Slate 800 */
    --terminal-text: #F8FAFC;      /* Slate 50 */
  }
}
```

---

## 🛠️ 2. Tailwind Configuration Mapping

In `frontend/tailwind.config.js`:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'bg-primary': 'var(--bg-primary)',
        'bg-surface': 'var(--bg-surface)',
        'bg-raised': 'var(--bg-raised)',
        'border-default': 'var(--border-default)',
        'border-subtle': 'var(--border-subtle)',
        'brand-primary': 'var(--brand-primary)',
        'brand-hover': 'var(--brand-hover)',
        'status-success': 'var(--status-success)',
        'status-success-dim': 'var(--status-success-dim)',
        'status-danger': 'var(--status-danger)',
        'status-danger-dim': 'var(--status-danger-dim)',
        'status-warning': 'var(--status-warning)',
        'status-warning-dim': 'var(--status-warning-dim)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-muted': 'var(--text-muted)',
        'terminal-bg': 'var(--terminal-bg)',
        'terminal-border': 'var(--terminal-border)',
        'terminal-text': 'var(--terminal-text)',
        'terminal-green': 'var(--terminal-green)',
        'terminal-red': 'var(--terminal-red)',
        'terminal-amber': 'var(--terminal-amber)',
        'terminal-cyan': 'var(--terminal-cyan)',
      },
    },
  },
};
```
