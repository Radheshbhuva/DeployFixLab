import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ChaosScenario } from '@/types/chaos.types';

const SCENARIOS: ChaosScenario[] = [
  { type: 'db_connection', label: 'Database Connection Drop', description: 'Remaps host DB connection string or stops PostgreSQL container listener.', severity: 'CRITICAL', estimatedDetectionMinutes: 5 },
  { type: 'dns_failure', label: 'DNS Name Resolution Break', description: 'Rewrites Docker network resolv.conf or injects invalid container hostname.', severity: 'HIGH', estimatedDetectionMinutes: 10 },
  { type: 'memory_leak', label: 'Out-Of-Memory Heap Spike', description: 'Fills heap allocation buffer until container encounters SIGKILL restart loop.', severity: 'HIGH', estimatedDetectionMinutes: 15 },
  { type: 'container_crash', label: 'Startup Container Crash', description: 'Applies missing env parameter causing process exit(1) on boot.', severity: 'CRITICAL', estimatedDetectionMinutes: 5 },
  { type: 'schema_drift', label: 'Database Schema Drift', description: 'Alters column types or drops un-migrated tables in live database.', severity: 'MEDIUM', estimatedDetectionMinutes: 20 },
  { type: 'network_timeout', label: 'Gateway Timeout Cascade', description: 'Injects 3000ms latency into upstream proxy connection pipeline.', severity: 'HIGH', estimatedDetectionMinutes: 12 },
];

export const ScenarioReference: React.FC = () => {
  return (
    <Card title="Supported Chaos Scenarios Reference">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
        {SCENARIOS.map((sc) => (
          <div key={sc.type} className="p-3 rounded-lg bg-bg-primary border border-border-default/50 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-text-primary">{sc.label}</span>
              <Badge variant={sc.severity === 'CRITICAL' ? 'danger' : 'warning'} size="sm">
                {sc.severity}
              </Badge>
            </div>
            <p className="text-[11px] text-text-secondary leading-relaxed">{sc.description}</p>
            <span className="text-[10px] font-mono text-terminal-cyan block">
              Type: {sc.type} (~{sc.estimatedDetectionMinutes}m detection)
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
};
