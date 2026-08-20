# DeployFix Lab — GitHub Repository Integration: Frontend UI/UX Specification

| Property | Value |
| :--- | :--- |
| **Document Name** | Frontend UI/UX Technical Specification |
| **Document ID** | DFL-GH-FE-004 |
| **Version** | 1.0.0 |
| **Status** | Approved |
| **Category** | Frontend Architecture & Design System |
| **Owner** | DeployFix Lab Frontend Team |
| **Created On** | 2026-08-17 |
| **Last Updated** | 2026-08-17 |
| **Repository** | DeployFix Lab (`Radheshbhuva/DeployFixLab`) |

---

## 1. UI State Machine & Transitions

The GitHub Integration UI transitions through 6 distinct states, ensuring immediate feedback and zero dead-ends:

```text
               ┌───────────────────────┐
               │     DISCONNECTED      │
               └──────────┬────────────┘
                          │ (Click "Connect GitHub")
                          ▼
               ┌───────────────────────┐
               │      CONNECTING       │ (GitHub App OAuth Popup / Redirect)
               └──────────┬────────────┘
                          │ (Installation Authorized)
                          ▼
               ┌───────────────────────┐
               │    SELECTING_REPO     │ (RepoSelectModal Open)
               └──────────┬────────────┘
                          │ (Click "Analyze Repository")
                          ▼
               ┌───────────────────────┐
               │       INGESTING       │ (Streaming Progress & Pulse Loader)
               └──────────┬────────────┘
                          │
          ┌───────────────┴───────────────┐
          │ (Success)                     │ (Error)
          ▼                               ▼
┌───────────────────┐           ┌───────────────────┐
│     CONNECTED     │           │       ERROR       │
│ (Context Display) │           │ (Actionable Retry)│
└───────────────────┘           └───────────────────┘
```

---

## 2. Component Wireframes & Visual Layouts

### 2.1 Disconnected State (`GitHubConnectCard.tsx`)

```text
┌───────────────────────────────────────────────────────────────────────────┐
│ 🔗 GitHub Repository Integration                                          │
│                                                                           │
│ Connect your GitHub repository to enable automated architectural         │
│ analysis, container configuration audits, and evidence-backed Flares.    │
│                                                                           │
│  [  Connect GitHub Repository  ]        [ Analyze Public Repo URL ]       │
│                                                                           │
│ ℹ️ Read-only permissions • Selected repositories only • Zero code stored  │
└───────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Repository Selector Modal (`RepoSelectModal.tsx`)

```text
┌───────────────────────────────────────────────────────────────────────────┐
│ Select Repository to Analyze                                          [✕] │
├───────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│ Account: 🏢 Radheshbhuva (GitHub App Installed)                           │
│                                                                           │
│ Repository:                                                               │
│ ┌───────────────────────────────────────────────────────────────────────┐ │
│ │ 🔍 Filter repositories...                                             │ │
│ ├───────────────────────────────────────────────────────────────────────┤ │
│ │ 🔵 Radheshbhuva/DeployFixLab (Private)                    [ Selected ] │ │
│ │ ⚪ Radheshbhuva/Devlink-v1 (Public)                                    │ │
│ │ ⚪ Radheshbhuva/Ecommerce-Microservices (Private)                     │ │
│ └───────────────────────────────────────────────────────────────────────┘ │
│                                                                           │
│ Target Branch:                                                            │
│ [ main  ▾ ]      ☑ Run deep configuration audit                          │
│                                                                           │
├───────────────────────────────────────────────────────────────────────────┤
│ [ Cancel ]                                         [ Analyze Repository ] │
└───────────────────────────────────────────────────────────────────────────┘
```

### 2.3 Connected & Ingested State (`ProjectContextSummary.tsx`)

```text
┌───────────────────────────────────────────────────────────────────────────┐
│ ✅ Connected Repository: Radheshbhuva/DeployFixLab                 [ 🔄 ] │
│ Branch: main  •  Commit: 8a4b2c1  •  Last Ingested: 2 mins ago    [ ✕ ] │
├───────────────────────────────────────────────────────────────────────────┤
│ Context Completeness Score: 50% (+25% from GitHub source)                 │
│ [████████████████████░░░░░░░░░░░░░░░░░░░░]                                │
├───────────────────────────────────────────────────────────────────────────┤
│ Ingested Architecture Artifacts:                                          │
│  ✓ package.json (Node/Express, React, Vite)                               │
│  ✓ Dockerfile (Node:18-alpine, EXPOSE 5000)                               │
│  ✓ docker-compose.yml (2 Services: web, db)                               │
│  ✓ nginx.conf (Reverse Proxy -> localhost:3000)                           │
│  ✓ .env.example (8 required keys parsed)                                  │
│  ✓ prisma/schema.prisma (PostgreSQL, 5 Models)                            │
│  ✓ .github/workflows/ci.yml (Build & Test CI)                             │
├───────────────────────────────────────────────────────────────────────────┤
│ 🔴 Flares Detected from Repository Evidence:                              │
│  • CRITICAL: Port Mismatch (Dockerfile EXPOSE 5000 vs Nginx proxy 3000)   │
│    [ View Diagnosis & Suggested Fix ]                                     │
└───────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Component Architecture & Props

### 3.1 `GitHubConnectCard.tsx`
- **Location:** `frontend/src/components/context/GitHubConnectCard.tsx`
- **Props:**
  ```typescript
  interface GitHubConnectCardProps {
    onConnectSuccess?: () => void;
    onFallbackSelect?: (type: "public_url" | "zip_upload") => void;
  }
  ```
- **Behavior:**
  - Calls `GET /api/github/connect` to obtain popup installation URL.
  - Listens for `window.addEventListener("message")` from GitHub auth popup.
  - Triggers `onConnectSuccess` when the authorization handshake completes.

### 3.2 `RepoSelectModal.tsx`
- **Location:** `frontend/src/components/context/RepoSelectModal.tsx`
- **Props:**
  ```typescript
  interface RepoSelectModalProps {
    isOpen: boolean;
    onClose: () => void;
    onScanStarted: (scanId: string) => void;
  }
  ```
- **Behavior:**
  - Fetches repository list via `useGitHubConnection` hook.
  - Provides real-time instant search filtering across repository names.
  - Dispatches `POST /api/github/repositories/:id/scan`.

### 3.3 `IngestedArtifactsGrid.tsx`
- **Location:** `frontend/src/components/context/IngestedArtifactsGrid.tsx`
- **Props:**
  ```typescript
  interface IngestedArtifactsGridProps {
    artifacts: {
      hasPackageJson: boolean;
      hasDockerfile: boolean;
      hasDockerCompose: boolean;
      hasNginx: boolean;
      hasEnvExample: boolean;
      hasPrisma: boolean;
      hasWorkflows: boolean;
    };
    onArtifactClick?: (artifactKey: string) => void;
  }
  ```
- **Behavior:** Renders interactive chip badges that glow green when detected and display tooltip summaries of extracted parameters.

---

## 4. Frontend State Management Hooks

### 4.1 `useGitHubConnection.ts`
```typescript
export interface GitHubConnectionState {
  isConnected: boolean;
  isLoading: boolean;
  accountName: string | null;
  repositories: RepositoryListItem[];
  error: string | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  refreshRepositories: () => Promise<void>;
}
```

### 4.2 `useRepositoryScan.ts`
```typescript
export interface RepositoryScanState {
  isScanning: boolean;
  scanProgress: number; // 0 to 100
  currentScan: ScanSummary | null;
  projectContext: ProjectContextData | null;
  flaresCount: number;
  triggerScan: (repoId: string, branch?: string) => Promise<void>;
}
```

---

## 5. Error Handling & Micro-Interactions

1. **Popup Blocked Recovery:** If browser popup blocker intercepts GitHub App installation, display an inline toast with an explicit "Open GitHub Authorization Window" button.
2. **Rate Limit Warning:** If GitHub API limits are approached, render an informational amber badge: `"GitHub API Rate Limited — Cached context will be used"`.
3. **Resync Button (Debounced):** The resync button (`[ 🔄 ]`) is throttled to 1 click every 30 seconds to prevent API flooding, with an animated rotating icon during re-ingestion.
4. **Clean Disconnect Modal:** Disconnecting triggers a confirmation dialog ensuring the user understands associated scans will be unlinked.
