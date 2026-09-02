import React, { useEffect, useState } from 'react';
import { PageWrapper } from '@/components/ui/PageWrapper';
import { SessionsTable } from './SessionsTable';
import { ChaosEventLog } from './ChaosEventLog';
import { ScenarioReference } from './ScenarioReference';
import { InjectChaosModal } from './InjectChaosModal';
import { chaosService } from '@/services/chaosService';
import { ActiveSession, ChaosEvent } from '@/types/chaos.types';
import { FailureType } from '@/types/lab.types';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Card } from '@/components/ui/Card';
import { useToast } from '@/hooks/useToast';
import { SreTerminal } from '@/components/terminal/SreTerminal';
import { Zap, Activity, Terminal as TerminalIcon } from 'lucide-react';

export const ChaosControlPage: React.FC = () => {
  const [sessions, setSessions] = useState<ActiveSession[]>([]);
  const [events, setEvents] = useState<ChaosEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState<ActiveSession | null>(null);
  const [injectModalOpen, setInjectModalOpen] = useState(false);

  const toast = useToast();

  const fetchData = async () => {
    try {
      const [sData, eData] = await Promise.all([
        chaosService.getActiveSessions(),
        chaosService.getChaosEventLog(),
      ]);
      setSessions(sData);
      setEvents(eData);
    } catch (err) {
      console.error('Failed to load chaos control data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenInjectModal = (session: ActiveSession) => {
    setSelectedSession(session);
    setInjectModalOpen(true);
  };

  const handleConfirmInject = async (sessionId: string, failureType: FailureType) => {
    try {
      await chaosService.injectChaos(sessionId, failureType);
      toast.success(`Injected ${failureType} into session ${sessionId}`);
      fetchData();
    } catch {
      toast.error('Failed to inject chaos scenario');
    }
  };

  const handleResetChaos = async (sessionId: string) => {
    try {
      await chaosService.resetChaos(sessionId);
      toast.info(`Reset failure scenario on session ${sessionId}`);
      fetchData();
    } catch {
      toast.error('Failed to reset chaos scenario');
    }
  };

  if (loading) {
    return <LoadingSpinner label="Connecting to Chaos Engine sandbox daemon..." />;
  }

  const activeChaosCount = sessions.filter((s) => s.status === 'ACTIVE').length;

  return (
    <PageWrapper>
      <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gradient-to-r from-red-950/40 via-bg-surface to-bg-raised p-6 rounded-2xl border border-red-900/50 shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <Zap className="w-6 h-6 text-status-danger" />
            <h1 className="text-2xl font-bold text-text-primary">
              Admin Failure Injection Sandbox
            </h1>
          </div>
          <p className="text-sm text-text-secondary mt-1 max-w-xl">
            Controlled failure injection control center for instructors and administrators.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-bg-primary/80 px-4 py-3 rounded-xl border border-border-default">
          <div className="text-right">
            <span className="text-[10px] font-semibold text-text-muted uppercase block">Active Chaos</span>
            <span className="text-xl font-bold text-status-danger">{activeChaosCount} Sessions</span>
          </div>
        </div>
      </div>

      {/* Interactive Chaos SRE Terminal Console */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
            <TerminalIcon className="w-5 h-5 text-brand-primary" />
            Chaos CLI Operator Terminal
          </h2>
          <span className="text-xs font-mono text-text-muted">
            Direct failure injection via SRE shell
          </span>
        </div>

        <SreTerminal
          title="chaos-daemon@deployfix-cluster (Privileged SRE Operator)"
          height="h-[320px]"
          quickCommands={[
            { label: 'chaos list', cmd: 'chaos list' },
            { label: 'inject latency', cmd: 'chaos inject latency --target=database --delay=500ms' },
            { label: 'inject cpu-spike', cmd: 'chaos inject cpu-spike --target=gateway --load=95%' },
            { label: 'inject crash', cmd: 'chaos inject crash --target=redis' },
            { label: 'chaos status', cmd: 'chaos status' },
            { label: 'chaos reset all', cmd: 'chaos reset all' },
          ]}
          context={{
            user: 'chaos-admin',
            hostname: 'chaos-controller',
            currentDir: '/var/chaos',
            onCustomCommand: (cmd) => {
              const lower = cmd.toLowerCase();
              const now = new Date().toISOString().substring(11, 19);
              const lineId = () => Math.random().toString(36).substring(2, 9);

              if (lower.startsWith('chaos')) {
                if (lower.includes('list')) {
                  const sessList = sessions.map(
                    (s) => `  [${s.sessionId}] User: ${s.userId} | Lab: ${s.labTitle} | Status: ${s.status}`
                  ).join('\n');
                  return [
                    {
                      id: lineId(),
                      type: 'output',
                      text: `Active Chaos Sessions (${sessions.length}):\n${sessList || '  No active sessions currently found.'}`,
                      timestamp: now,
                    },
                  ];
                }
                if (lower.includes('inject')) {
                  const targetSession = sessions[0];
                  if (targetSession) {
                    handleConfirmInject(targetSession.sessionId, 'SERVICE_UNREACHABLE' as FailureType);
                  }
                  return [
                    {
                      id: lineId(),
                      type: 'warning',
                      text: `⚡ Chaos event injected: Fault scenario triggered on active cluster session. Synthetic SLA degraded to 42%.`,
                      timestamp: now,
                    },
                  ];
                }
                if (lower.includes('reset')) {
                  sessions.forEach((s) => handleResetChaos(s.sessionId));
                  return [
                    {
                      id: lineId(),
                      type: 'success',
                      text: `✓ All active cluster chaos faults revoked. Target containers restarted with nominal latency.`,
                      timestamp: now,
                    },
                  ];
                }
                if (lower.includes('status')) {
                  return [
                    {
                      id: lineId(),
                      type: 'info',
                      text: `Chaos Daemon v2.4 Status: ACTIVE (Cluster Mesh: deployfix-chaos-net)\nTotal Active Faults: ${activeChaosCount}\nMonitoring Daemon: Nominal (0 dropped heartbeats)`,
                      timestamp: now,
                    },
                  ];
                }
              }
              return null;
            },
          }}
        />
      </div>

      {/* Active Student Sessions Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
            <Activity className="w-5 h-5 text-brand-primary" />
            Active Student Lab Sessions ({sessions.length})
          </h2>
        </div>

        <SessionsTable
          sessions={sessions}
          onOpenInjectModal={handleOpenInjectModal}
          onResetChaos={handleResetChaos}
        />
      </div>

      {/* Bottom Grid: Chaos Event History & Scenario Reference */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ScenarioReference />
        </div>

        <div>
          <Card title="Chaos Audit Event Log">
            <div className="mt-3">
              <ChaosEventLog events={events} />
            </div>
          </Card>
        </div>
      </div>

      {/* Inject Modal */}
      <InjectChaosModal
        isOpen={injectModalOpen}
        session={selectedSession}
        onClose={() => setInjectModalOpen(false)}
        onConfirmInject={handleConfirmInject}
      />
    </div>
    </PageWrapper>
  );
};
