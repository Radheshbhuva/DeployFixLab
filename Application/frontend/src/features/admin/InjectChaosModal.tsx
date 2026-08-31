import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { ActiveSession } from '@/types/chaos.types';
import { FailureType } from '@/types/lab.types';
import { Zap } from 'lucide-react';

export interface InjectChaosModalProps {
  isOpen: boolean;
  session: ActiveSession | null;
  onClose: () => void;
  onConfirmInject: (sessionId: string, failureType: FailureType) => void;
}

const FAILURES: { type: FailureType; label: string }[] = [
  { type: 'db_connection', label: 'Database Connection Failure' },
  { type: 'dns_failure', label: 'DNS Name Resolution Breakdown' },
  { type: 'memory_leak', label: 'Memory Leak Under Load' },
  { type: 'container_crash', label: 'Container Startup Crash Loop' },
  { type: 'schema_drift', label: 'Database Schema Drift' },
  { type: 'network_timeout', label: 'Network Timeout Cascade' },
  { type: 'port_conflict', label: 'Port Binding Conflict' },
  { type: 'env_misconfiguration', label: 'Environment Misconfiguration' },
];

export const InjectChaosModal: React.FC<InjectChaosModalProps> = ({
  isOpen,
  session,
  onClose,
  onConfirmInject,
}) => {
  const [selectedFailure, setSelectedFailure] = useState<FailureType>('db_connection');
  const [loading, setLoading] = useState(false);

  if (!session) return null;

  const handleInject = async () => {
    setLoading(true);
    try {
      await onConfirmInject(session.sessionId, selectedFailure);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Inject Failure Scenario">
      <div className="space-y-4">
        <div className="p-3 rounded bg-bg-primary border border-border-default text-xs">
          <p className="text-text-muted">Target Student Session:</p>
          <p className="font-bold text-text-primary mt-0.5">{session.userName} ({session.labTitle})</p>
          <span className="font-mono text-[10px] text-text-muted">{session.sessionId}</span>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider block">
            Select Failure Type to Inject
          </label>
          <select
            value={selectedFailure}
            onChange={(e) => setSelectedFailure(e.target.value as FailureType)}
            className="w-full bg-bg-primary border border-border-default rounded-md px-3 py-2 text-xs font-mono text-text-primary focus:outline-none focus:ring-2 focus:ring-status-danger"
          >
            {FAILURES.map((f) => (
              <option key={f.type} value={f.type}>
                {f.label} ({f.type})
              </option>
            ))}
          </select>
        </div>

        <div className="pt-4 flex justify-end gap-2 border-t border-border-default">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="danger" isLoading={loading} onClick={handleInject}>
            <Zap className="w-4 h-4 mr-1.5" />
            Inject Failure Now
          </Button>
        </div>
      </div>
    </Modal>
  );
};
