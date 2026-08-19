# 06 — DeployFix Lab: Log Streaming Terminal & Security Architecture Specification

---

## Document Metadata

| Field | Value |
|---|---|
| **Document Name** | Log Streaming Terminal & Security Architecture Specification |
| **Document ID** | DFIX-SPEC-021-06 |
| **Version** | 1.0.0 |
| **Status** | Approved |
| **Components** | `LiveLogStreamSection.tsx`, `SecurityArchitectureSection.tsx` |

---

## 1. Live Log Stream Terminal Section (`LiveLogStreamSection.tsx`)

### Value Proposition
DeployFix Lab features a **high-throughput WebSocket log streaming pipeline** that collects events across all microservices.

On the landing page, an interactive terminal widget gives prospective users a live look at multi-service log ingestion:

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│ ● ● ●  deployfix-stream://live-telemetry (WebSocket Connected)        [Filters: ALL ▼] │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│ [12:00:01.120] INFO   [nginx]   Proxy initialized. Upstream mapped to backend:3000      │
│ [12:00:01.450] INFO   [backend] Express API initialized on port 3000 in development     │
│ [12:00:02.102] WARN   [backend] Database query timed out after 2000ms. Retrying...      │
│ [12:00:04.110] FATAL  [backend] connect ECONNREFUSED 127.0.0.1:5432                     │
│ [12:00:04.115] ERROR  [nginx]   Upstream backend:3000 connection lost. Emitting 502     │
│ [12:00:05.000] INFO   [chaos]   Chaos failure injected: [Vector: DB_HOST_MISMATCH]      │
│ [12:01:10.400] INFO   [backend] DATABASE_URL updated to postgres:5432. Connected OK     │
│ [12:01:10.510] INFO   [health]  Readiness probe returned HTTP 200 OK (14ms)             │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

### Terminal Features
- Source tag badges: `[backend]` (purple), `[nginx]` (blue), `[postgres]` (emerald), `[chaos]` (amber).
- Severity level badges: `INFO` (slate), `WARN` (amber), `ERROR` (rose), `FATAL` (red bold).
- Autoscroll toggle and source filter dropdown.

---

## 2. Security & Zero-Secret Architecture (`SecurityArchitectureSection.tsx`)

### Core Security Guarantees Displayed to Developers

```
  ┌─────────────────────────────────────────────────────────────────────────────────────┐
  │                           ZERO-SECRET PRIVACY PIPELINE                              │
  ├─────────────────────────────────────────────────────────────────────────────────────┤
  │ 1. CLIENT-SIDE REDACTION  • Regex filters tokens & passwords before network dispatch │
  │ 2. IN-MEMORY ISOLATION    • Telemetry processed in transient memory; never sold     │
  │ 3. DOCKER NETWORK SHIELD  • Containers communicate strictly on isolated bridge net  │
  │ 4. READ-ONLY HEALTH CHECK • Diagnostic probes never execute state-modifying requests│
  └─────────────────────────────────────────────────────────────────────────────────────┘
```

### Security Architecture Comparison Table

| Security Feature | DeployFix Lab | Generic AI Chatbot / Public API |
|---|---|---|
| **Secret Redaction** | Automated 12+ regex patterns (AWS, DB, JWT, SSH) | Plaintext transmission to public servers |
| **Network Isolation** | Internal Docker bridge (`dfix-net`) | Uncontrolled external network exposure |
| **Data Retention** | Ephemeral diagnostic session buffer | Permanent training data retention |
| **Execution Safety** | Sandboxed container verification scripts | Dangerous commands suggested without guardrails |

---

## 3. UI Layout Specification

```tsx
<section className="py-24 px-4 max-w-7xl mx-auto border-t border-slate-800/80">
  <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
    {/* Left Column (5 cols): Security Architecture Pillars */}
    <div className="lg:col-span-5">
      <span className="text-emerald-400 font-mono text-xs uppercase tracking-widest">Enterprise-Grade Security</span>
      <h2 className="text-3xl md:text-4xl font-bold text-slate-100 mt-2">Zero-Secret Guarantee</h2>
      <p className="text-slate-400 mt-4 text-base leading-relaxed">
        Production credentials should never leave your boundary. DeployFix Lab implements client-side redaction, container network isolation, and read-only inspection protocols.
      </p>
      
      {/* 3 Key Security Bullet Cards */}
      <div className="mt-8 space-y-4">
        {/* Card 1: Client-Side Regex Redaction */}
        {/* Card 2: Isolated Docker Sandbox */}
        {/* Card 3: Transient In-Memory Pipeline */}
      </div>
    </div>

    {/* Right Column (7 cols): Interactive Live Terminal Simulation */}
    <div className="lg:col-span-7">
      <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 font-mono text-xs shadow-2xl">
        {/* Terminal Header */}
        {/* Scrolling Log Window */}
        {/* Filter controls */}
      </div>
    </div>
  </div>
</section>
```
