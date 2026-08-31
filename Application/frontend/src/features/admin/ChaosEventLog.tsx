import React from 'react';
import { ChaosEvent } from '@/types/chaos.types';
import { formatRelativeTime } from '@/utils/dateFormatter';
import { Zap, RotateCcw, ShieldCheck } from 'lucide-react';

export interface ChaosEventLogProps {
  events: ChaosEvent[];
}

export const ChaosEventLog: React.FC<ChaosEventLogProps> = ({ events }) => {
  const getActionIcon = (action: ChaosEvent['action']) => {
    switch (action) {
      case 'INJECTED':
        return <Zap className="w-4 h-4 text-status-danger" />;
      case 'RESET':
        return <RotateCcw className="w-4 h-4 text-amber-400" />;
      case 'VERIFIED':
        return <ShieldCheck className="w-4 h-4 text-status-success" />;
    }
  };

  return (
    <div className="space-y-3">
      {events.map((evt) => (
        <div
          key={evt.id}
          className="flex items-start gap-3 p-3 rounded-lg bg-bg-primary/70 border border-border-default/40 text-xs"
        >
          <div className="mt-0.5 p-1 rounded bg-bg-raised">{getActionIcon(evt.action)}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-text-primary">
                {evt.adminName} <span className="text-text-muted font-normal">action:</span> {evt.action}
              </span>
              <span className="text-[10px] text-text-muted">{formatRelativeTime(evt.timestamp)}</span>
            </div>
            <p className="text-text-secondary mt-1">
              Target: <span className="font-semibold text-text-primary">{evt.userName}</span> ({evt.labTitle})
              {evt.failureType && (
                <span className="ml-2 font-mono text-terminal-red">[{evt.failureType}]</span>
              )}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
