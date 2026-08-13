import React, { useEffect, useState } from 'react';
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
import { Zap, Activity } from 'lucide-react';

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
    <div className="space-y-6 pb-8">
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
  );
};
