import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useLogStreamStore } from '@/store/logStreamStore';
import { Zap, ShieldAlert, AlertTriangle, RefreshCw, Radio } from 'lucide-react';

export const ChaosControlPage = () => {
  const addLogEntry = useLogStreamStore((state) => state.addLogEntry);
  const [activeFault, setActiveFault] = useState<string | null>(null);

  const faults = [
    {
      id: 'FAIL-DB-04',
      title: 'Supabase PostgreSQL Connection Timeout',
      category: 'DATABASE',
      description: 'Simulate TLS network partition between Express API container and remote Supabase pooler.',
    },
    {
      id: 'FAIL-NGINX-01',
      title: '502 Bad Gateway Nginx Upstream Disconnect',
      category: 'NGINX',
      description: 'Trigger hostname resolution failure in Nginx reverse proxy container.',
    },
    {
      id: 'FAIL-SEC-02',
      title: 'Root Execution Kernel Privilege Violation',
      category: 'SECURITY',
      description: 'Inject container root user execution (UID 0) and read-only filesystem lock.',
    },
  ];

  const handleInjectFault = (faultId: string) => {
    setActiveFault(faultId);
    addLogEntry({
      level: 'ERROR',
      subsystem: 'CHAOS_ENGINE',
      message: `CRITICAL: Admin injected controlled failure ${faultId} into target container topology`,
    });
  };

  const handleClearFaults = () => {
    setActiveFault(null);
    addLogEntry({
      level: 'INFO',
      subsystem: 'CHAOS_ENGINE',
      message: 'RECOVERY: All active chaos faults cleared. Topology restored to operational baseline.',
    });
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <Zap className="w-6 h-6 text-amber-400" />
            Chaos Engine Fault Injector (Admin Only)
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Simulate controlled container failures to test diagnostic probes and incident response
          </p>
        </div>

        {activeFault && (
          <Button variant="danger" size="sm" onClick={handleClearFaults} leftIcon={<RefreshCw className="w-4 h-4" />}>
            Clear Active Chaos Faults
          </Button>
        )}
      </div>

      {/* Active Fault Indicator */}
      {activeFault ? (
        <div className="p-4 bg-red-500/10 border border-red-500/40 rounded-2xl flex items-center justify-between animate-pulse">
          <div className="flex items-center gap-3">
            <Radio className="w-5 h-5 text-red-400 animate-ping" />
            <div>
              <div className="text-xs font-mono font-bold text-red-400 uppercase">Active Fault Injected</div>
              <div className="text-sm font-semibold text-slate-100">{activeFault} Scenario Running</div>
            </div>
          </div>
          <Badge variant="danger" size="md">SYSTEM DEGRADED</Badge>
        </div>
      ) : (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-5 h-5 text-emerald-400" />
            <div>
              <div className="text-xs font-mono font-bold text-emerald-400 uppercase">Chaos Engine Idle</div>
              <div className="text-sm font-semibold text-slate-100">Topology running clean without synthetic faults</div>
            </div>
          </div>
          <Badge variant="success" size="md">ALL SYSTEMS OPERATIONAL</Badge>
        </div>
      )}

      {/* Fault Injector Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {faults.map((fault) => (
          <Card key={fault.id} className="flex flex-col justify-between">
            <CardHeader>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-amber-400">{fault.id}</span>
                <Badge variant="warning" size="sm">{fault.category}</Badge>
              </div>
              <CardTitle className="text-base mt-2">{fault.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-slate-300">{fault.description}</CardDescription>
            </CardContent>
            <div className="p-6 pt-0">
              <Button
                variant={activeFault === fault.id ? 'danger' : 'warning'}
                size="md"
                onClick={() => handleInjectFault(fault.id)}
                leftIcon={<Zap className="w-4 h-4" />}
                className="w-full"
              >
                {activeFault === fault.id ? 'Fault Currently Active' : 'Inject Fault'}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
