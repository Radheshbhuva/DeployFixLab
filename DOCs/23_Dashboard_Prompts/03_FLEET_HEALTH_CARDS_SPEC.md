# DeployFix Lab — Container Fleet Health Cards Specification

> **Document ID:** `DFIX-DASH-FLEET-003`  
> **Component:** `frontend/src/features/dashboard/components/ContainerFleetGrid.tsx`

---

## 🐳 1. Node Topology & Metric Model

The Container Fleet Grid displays the status of the 4 core containers comprising the DeployFix Lab topology:

1. **API Gateway & Core Router**: Express 4.19 microservice handling REST and WebSocket dispatch (`port 5000`).
2. **PostgreSQL Relational DB**: PostgreSQL 16 database storing incident records and lab states (`port 5432`).
3. **Nginx Reverse Proxy**: Edge routing and SSL termination proxy (`port 80 / 443`).
4. **Redis Cache & Pub/Sub Cluster**: In-memory incident buffer and rate-limiter (`port 6379`).

---

## 📊 2. Node Data Interface

```typescript
export interface ContainerFleetNode {
  id: string;
  name: string;
  role: string;
  dockerContainerId: string;
  port: number;
  status: 'healthy' | 'degraded' | 'failed' | 'restarting';
  responseTimeMs: number;
  uptimePercent: number;
  cpuPercent: number;
  memoryUsedMb: number;
  memoryTotalMb: number;
  restartCount: number;
  latencyHistory: number[]; // 10 historic data points for sparkline
  lastHealthCheck: string;
}
```

---

## 🎛️ 3. Card Interactive Capabilities

- **Sparkline Latency**: 10-point historical response time trend.
- **Saturation Bars**: Visual CPU and Memory consumption.
- **Port Badge**: Clickable copy-to-clipboard docker endpoint.
- **Restart Alert**: If `restartCount > 0`, renders warning badge with last restart timestamp.
- **Quick Action**: "Inspect Logs" button routing directly to `/logs?container=<id>`.
