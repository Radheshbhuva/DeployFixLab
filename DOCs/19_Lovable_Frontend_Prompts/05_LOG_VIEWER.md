# 05 — Log Viewer Prompt for Lovable

> **Prerequisites:** Files 00–04 must be applied first.
> This prompt builds the live log stream viewer with WebSocket, filtering, and export.

---

## PROMPT TO PASTE INTO LOVABLE:

```
Build the Log Viewer page for DeployFix Lab. This is a real-time terminal-style log streaming interface. It uses WebSocket to stream live container logs and supports filtering, color-coded log levels, pause/resume, and export.

This page should feel like a professional terminal log viewer — think Papertrail or Datadog logs panel.

---

LOG TYPES (src/types/log.types.ts):

export type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'FATAL';
export type LogSource = 'frontend' | 'backend' | 'database' | 'nginx' | 'chaos-engine';

export interface LogEntry {
  id: string;
  timestamp: string;         // ISO 8601
  level: LogLevel;
  source: LogSource;
  message: string;
  metadata?: Record<string, string>;
  traceId?: string;
}

---

LOG STREAM STORE (src/store/logStreamStore.ts):

Zustand store:
  logs: LogEntry[]            — bounded buffer, max 2000 entries (FIFO drop oldest)
  isConnected: boolean
  isPaused: boolean
  filterLevel: LogLevel | 'ALL'
  filterSource: LogSource | 'ALL'
  searchQuery: string
  
  appendLog(entry: LogEntry): void   — adds entry, enforces 2000-entry limit
  clearLogs(): void
  setConnected(bool: boolean): void
  setPaused(bool: boolean): void
  setFilterLevel(level): void
  setFilterSource(source): void
  setSearchQuery(query: string): void

Computed selector (derived state):
  filteredLogs: derived from logs, filterLevel, filterSource, searchQuery
  (filter in this priority: level filter → source filter → text search in message)

---

WEBSOCKET HOOK (src/hooks/useLogStream.ts):

Custom React hook that manages the WebSocket lifecycle:

const useLogStream = (labSessionId?: string) => {
  // Opens WebSocket to:
  // ws://<VITE_WS_URL>/logs/stream?sessionId=<labSessionId> if labSessionId exists
  // ws://<VITE_WS_URL>/logs/stream for global stream
  
  // On message: parse JSON → append to logStreamStore
  // On open: setConnected(true)
  // On close: setConnected(false) + attempt reconnect after 3s (max 5 retries)
  // On error: log error, set connected=false
  // Cleanup: close socket on component unmount
  
  return { isConnected, reconnect }
}

---

LOG VIEWER PAGE (src/features/logs/LogViewerPage.tsx):

Layout: AppLayout wrapper. Full-height layout (flex column, fills remaining viewport height).

---

TOP TOOLBAR:

Left side:
  - Title: "Live Log Stream" in text-xl font-semibold
  - Connection status chip: 
    - Green pulsing dot + "Connected" when isConnected = true
    - Red dot + "Disconnected" when false

Right side (controls row):
  - Search input: text input with Lucide Search icon inside, placeholder "Search logs...", real-time filter
  - Level filter dropdown: ALL | DEBUG | INFO | WARN | ERROR | FATAL
    (each option color-coded: DEBUG=slate, INFO=blue, WARN=amber, ERROR=red, FATAL=red bold)
  - Source filter dropdown: ALL | frontend | backend | database | nginx | chaos-engine
  - Pause/Resume button:
    - When NOT paused: Pause icon + "Pause" (Amber-500 text)
    - When paused: Play icon + "Resume" (Green-500 text)
    - Paused state: stop appending new logs to the view (they queue internally)
  - Clear button: Trash2 icon + "Clear" (Ghost variant)
  - Export button: Download icon + "Export" (Ghost variant) — exports visible logs as .txt file

---

LOG DISPLAY AREA (main area, takes all remaining height):

Terminal-style monospace display:
  - Background: #0D1117 (even darker than bg-primary — a near-black terminal background)
  - Font: JetBrains Mono, text-xs (12px), line-height relaxed
  - Overflow-y: scroll (auto-scroll to bottom on new entries, unless paused)
  - Custom thin scrollbar (dark track, slate thumb)

Each log row (LogRow component):

Format: [TIMESTAMP]  [LEVEL]  [SOURCE]  MESSAGE  [TRACE_ID if exists]

Visual:
  - Timestamp: text-terminal-cyan, monospace — formatted as HH:mm:ss.SSS
  - Level badge (no background — just colored text, monospace):
    - DEBUG: text-slate-500
    - INFO:  text-blue-400
    - WARN:  text-terminal-amber (bold)
    - ERROR: text-terminal-red (bold)
    - FATAL: text-terminal-red bg-red-900/30 px-1 rounded (very prominent)
  - Source: text-purple-400 in brackets [backend]
  - Message: text-slate-100
  - TraceId: text-slate-600 text-xs at far right (if present)
  
  Row hover: subtle highlight (bg-slate-800/40)
  
  ERROR and FATAL rows: add a very subtle left border (border-l-2 border-terminal-red) to the entire row

EMPTY STATE:
  When no logs and not connected:
    Centered terminal icon (Lucide Terminal) in slate-600, large
    "No logs available. Start a lab session to stream logs." in text-text-muted

AUTO-SCROLL BEHAVIOR:
  - When isPaused = false: always scroll to bottom on new log entries
  - When isPaused = true: stop auto-scrolling, show a "paused" banner overlay at the bottom:
    Amber banner: "⏸ Paused — X new logs waiting. Click Resume to continue."

---

MOCK DATA FOR DEMO:

Generate a set of realistic mock log entries that simulate a container startup + database failure:

  [12:00:01.123] INFO  [backend] Server starting on port 3000
  [12:00:01.456] INFO  [database] Connecting to PostgreSQL at localhost:5432
  [12:00:01.789] INFO  [nginx] Proxy initialized, upstream: backend:3000
  [12:00:02.001] ERROR [database] Connection refused: ECONNREFUSED 127.0.0.1:5432
  [12:00:02.012] WARN  [backend] Database connection failed, retrying in 3s...
  [12:00:05.013] ERROR [database] Connection refused: ECONNREFUSED 127.0.0.1:5432
  [12:00:05.015] FATAL [backend] Max database connection retries exceeded. Shutting down.
  [12:00:05.020] ERROR [nginx] Upstream backend:3000 is down. 502 Bad Gateway.

Then show a recovery sequence:
  [12:01:00.001] INFO  [backend] DATABASE_URL updated by user recovery action
  [12:01:00.050] INFO  [database] Connecting to PostgreSQL at postgres:5432
  [12:01:00.123] INFO  [database] Connection established successfully
  [12:01:00.200] INFO  [backend] Server fully operational. Health: OK
  [12:01:00.210] INFO  [nginx] Upstream backend:3000 restored. Proxy healthy.

This tells a story of a failure and recovery.

---

STATS BAR (below toolbar, above log area):

A slim bar showing:
  - Total logs: X | Errors: X (red) | Warnings: X (amber) | Info: X (blue) | Filtered: X
  - Real-time, updates as logs stream in

---

VISUAL POLISH:
- The entire log area should feel like a real terminal — dark, monospaced, dense
- Add a subtle scanline effect (very faint CSS background repeating-linear-gradient) for atmosphere
- New log entries animate in with a brief fade (opacity 0 → 1, 100ms)
- FATAL entries briefly flash a red background glow before settling
```

---

## EXPECTED OUTPUT FROM LOVABLE

- `src/features/logs/LogViewerPage.tsx`
- `src/features/logs/components/LogRow.tsx`
- `src/store/logStreamStore.ts`
- `src/hooks/useLogStream.ts`
- `src/types/log.types.ts`
