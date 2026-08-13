# 09 — Reusable UI Components Module Specification for Antigravity

> **Prerequisites:** Specifications 00–08 must be reviewed first.
> This specification details additional domain-specific reusable UI components to implement in Antigravity.

---

## ANTIGRAVITY DIRECT IMPLEMENTATION BLUEPRINT:

```
Build the remaining shared reusable UI components for DeployFix Lab. These are used across multiple pages and features.

---

COMPONENT 1: ConfidenceScoreGauge (src/components/ui/ConfidenceScoreGauge.tsx)

Used in the Diagnosis Output Card.

Props:
  score: number     // 0–100
  size: 'sm' | 'md' | 'lg'
  showLabel: boolean

Visual:
  - A circular arc progress gauge (use SVG — no external chart library for this)
  - Arc from bottom-left to bottom-right (180° arc / half-circle style)
  - Background arc: stroke slate-700
  - Progress arc: 
    - 80–100: stroke Green-500
    - 50–79: stroke Amber-500
    - 20–49: stroke Red-400
    - 0–19: stroke Slate-500
  - Center: large percentage number in font-bold, color matching arc
  - Below center: confidence level label in text-xs ("HIGH CONFIDENCE" / "MEDIUM" / "LOW" / "INSUFFICIENT")
  - Subtle animation on mount: arc draws from 0 to score value (500ms ease-out SVG stroke-dashoffset animation)

---

COMPONENT 2: ServiceStatusBadge (src/components/ui/ServiceStatusBadge.tsx)

Props:
  status: 'healthy' | 'degraded' | 'failed' | 'unknown'
  showPulse: boolean (default true for active states)
  size: 'sm' | 'md'

Visual:
  - healthy: Green-500 dot (pulsing) + "Healthy" text in green
  - degraded: Amber-500 dot (pulsing) + "Degraded" text in amber
  - failed: Red-500 dot (pulsing faster) + "Failed" text in red
  - unknown: Slate-500 dot (no pulse) + "Unknown" text in slate

---

COMPONENT 3: CopyButton (src/components/ui/CopyButton.tsx)

Props:
  textToCopy: string
  size: 'sm' | 'md'

Behavior:
  - Click → copy textToCopy to clipboard using navigator.clipboard
  - Shows Copy icon normally
  - On successful copy: icon changes to CheckCheck (Lucide) for 2 seconds then resets
  - Tooltip: "Copy" (normal) / "Copied!" (success state)

---

COMPONENT 4: CodeBlock (src/components/ui/CodeBlock.tsx)

Props:
  code: string
  language?: string    // 'bash' | 'yaml' | 'json' | 'env' etc.
  title?: string       // optional filename label
  showCopy: boolean    // default true

Visual:
  - Dark terminal background: #0D1117
  - If title: header bar with filename in text-xs text-text-muted + copy button right-aligned
  - Code area: font-mono text-sm, text-terminal-green (for bash), text-text-primary (for others)
  - Horizontal scroll if code is too wide (overflow-x: auto)
  - Border: border border-slate-700 rounded-lg
  - Padding: p-4

---

COMPONENT 5: DifficultyBadge (src/components/ui/DifficultyBadge.tsx)

Props:
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT'

Visual:
  - BEGINNER: bg-green-900/40 text-green-400 border border-green-800
  - INTERMEDIATE: bg-amber-900/40 text-amber-400 border border-amber-800
  - ADVANCED: bg-red-900/40 text-red-400 border border-red-800
  - EXPERT: bg-purple-900/40 text-purple-400 border border-purple-800
  - All: text-xs font-medium px-2.5 py-0.5 rounded-full

---

COMPONENT 6: EmptyState (src/components/feedback/EmptyState.tsx)

Props:
  icon: React.ReactNode  // Lucide icon component
  title: string
  description: string
  action?: { label: string, onClick: () => void }  // optional CTA button

Visual:
  - Centered vertically and horizontally in its container
  - Icon: large (48px), text-text-muted
  - Title: text-lg font-semibold text-text-secondary
  - Description: text-sm text-text-muted max-w-xs text-center
  - If action: Primary button below description
  - Minimal, clean — no illustrations

---

COMPONENT 7: ProgressStepper (src/components/ui/ProgressStepper.tsx)

Props:
  steps: { label: string; description?: string }[]
  currentStep: number    // 0-indexed
  completedSteps: number[]

Visual:
  - Horizontal stepper (vertical on mobile)
  - Each step:
    - Circle with step number or CheckIcon (if completed)
    - Completed: filled Green-500 bg, white check icon
    - Active: filled Blue-500 bg, white number, subtle glow ring
    - Future: slate-700 bg, slate-400 text number
  - Connecting line between steps:
    - Completed segment: Green-500 line
    - Remaining: slate-700 dashed line
  - Step label below circle in text-xs
  - Smooth transition animation when step advances

---

COMPONENT 8: DataTable (src/components/ui/DataTable.tsx)

A generic, reusable table component for the Admin panel and anywhere else.

Props:
  columns: { key: string; header: string; render?: (row) => ReactNode; width?: string }[]
  data: Record<string, unknown>[]
  isLoading?: boolean
  emptyMessage?: string
  onRowClick?: (row) => void

Visual:
  - bg-surface, rounded-xl, border border-default, overflow-hidden
  - Header row: bg-bg-raised, text-xs font-semibold text-text-muted uppercase tracking-wider px-4 py-3
  - Data rows: px-4 py-4 text-sm text-text-primary
  - Row separator: border-b border-default
  - Row hover: bg-bg-raised/50 (if onRowClick provided, cursor-pointer)
  - Loading state: show Skeleton rows (4 rows of Skeleton components)
  - Empty state: centered "No data" message in text-text-muted

---

COMPONENT 9: Tooltip (src/components/ui/Tooltip.tsx)

Props:
  content: string
  children: React.ReactNode
  position: 'top' | 'bottom' | 'left' | 'right' (default: 'top')

Visual:
  - On hover: show a small dark pill tooltip (bg-slate-900 border border-slate-600 text-text-secondary text-xs rounded-md px-2 py-1)
  - Fade-in animation (opacity 0→1, 150ms)
  - Arrow pointer pointing toward the trigger element
  - No external library — use pure CSS/React state

---

COMPONENT 10: StatCard (src/components/ui/StatCard.tsx)

A versatile stat display card (used in dashboard, admin panel, etc.)

Props:
  label: string
  value: string | number
  unit?: string
  icon: React.ReactNode
  trend?: { value: string; direction: 'up' | 'down' | 'neutral' }
  color?: 'default' | 'success' | 'danger' | 'warning' | 'info'

Visual:
  - bg-surface, rounded-lg, p-5, border border-default
  - Top: icon (right-aligned, 20px, text-text-muted) + label (text-xs uppercase text-text-muted tracking-wider)
  - Middle: large value (text-3xl font-bold, color matching color prop) + unit (text-sm text-text-secondary inline)
  - Bottom: trend chip if provided
    - up + green ArrowUpRight icon + green text
    - down + red ArrowDownRight icon + red text
    - neutral + slate Minus icon + slate text

---

ADDITIONAL UTILITY: useDebounce hook (src/hooks/useDebounce.ts)

  const useDebounce = <T>(value: T, delay: number): T => { ... }
  
  Standard debounce hook. Used in search inputs across labs, log viewer, etc.

---

ADDITIONAL UTILITY: usePrevious hook (src/hooks/usePrevious.ts)

  const usePrevious = <T>(value: T): T | undefined => { ... }
  
  Returns the previous render's value. Useful for detecting state changes.

---

ADDITIONAL UTILITY: useLocalStorage hook (src/hooks/useLocalStorage.ts)

  const useLocalStorage = <T>(key: string, initialValue: T): [T, (v: T) => void] => { ... }
  
  Used ONLY for non-sensitive UI preferences (sidebar collapsed state, theme preferences, etc.)
  NEVER for auth tokens.

---

TYPE UTILITIES (src/types/common.types.ts):

export type ApiResponse<T> = {
  data: T;
  message: string;
  success: boolean;
  timestamp: string;
};

export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

---

All components must:
- Be named exports
- Have complete TypeScript prop interfaces
- Use only Tailwind CSS classes
- Include aria-label or aria-describedby where appropriate for accessibility
- Handle edge cases (empty props, undefined values, null checks)
```

---

## TARGET FILES TO BUILD IN ANTIGRAVITY

Antigravity will construct:
- `src/components/ui/ConfidenceScoreGauge.tsx`
- `src/components/ui/ServiceStatusBadge.tsx`
- `src/components/ui/CopyButton.tsx`
- `src/components/ui/CodeBlock.tsx`
- `src/components/ui/DifficultyBadge.tsx`
- `src/components/ui/ProgressStepper.tsx`
- `src/components/ui/DataTable.tsx`
- `src/components/ui/Tooltip.tsx`
- `src/components/ui/StatCard.tsx`
- `src/components/feedback/EmptyState.tsx`
- `src/hooks/useDebounce.ts`
- `src/hooks/usePrevious.ts`
- `src/hooks/useLocalStorage.ts`
- `src/types/common.types.ts`
