import React from 'react';
import { ActiveSession } from '@/types/chaos.types';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatRelativeTime } from '@/utils/dateFormatter';
import { Zap, RotateCcw } from 'lucide-react';

export interface SessionsTableProps {
  sessions: ActiveSession[];
  onOpenInjectModal: (session: ActiveSession) => void;
  onResetChaos: (sessionId: string) => void;
}

export const SessionsTable: React.FC<SessionsTableProps> = ({
  sessions,
  onOpenInjectModal,
  onResetChaos,
}) => {
  const getStatusBadge = (status: ActiveSession['status']) => {
    switch (status) {
      case 'ACTIVE':
        return <Badge variant="danger" className="animate-pulse">Chaos Active</Badge>;
      case 'RECOVERING':
        return <Badge variant="warning">Recovering</Badge>;
      case 'RESET':
        return <Badge variant="info">Reset</Badge>;
      default:
        return <Badge variant="default">Idle Session</Badge>;
    }
  };

  return (
    <div className="w-full bg-bg-surface rounded-xl border border-border-default overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-bg-raised/60 border-b border-border-default text-xs font-semibold text-text-muted uppercase tracking-wider">
              <th className="px-4 py-3">Student / User</th>
              <th className="px-4 py-3">Lab Scenario</th>
              <th className="px-4 py-3">Session Status</th>
              <th className="px-4 py-3">Active Failure</th>
              <th className="px-4 py-3">Duration</th>
              <th className="px-4 py-3 text-right">Chaos Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-default/50 text-xs text-text-primary">
            {sessions.map((sess) => (
              <tr key={sess.sessionId} className="hover:bg-bg-raised/40 transition-colors">
                <td className="px-4 py-4 font-semibold text-text-primary">
                  {sess.userName}
                  <span className="block text-[10px] font-mono text-text-muted">{sess.sessionId}</span>
                </td>
                <td className="px-4 py-4">{sess.labTitle}</td>
                <td className="px-4 py-4">{getStatusBadge(sess.status)}</td>
                <td className="px-4 py-4 font-mono text-terminal-red">
                  {sess.currentFailure || '—'}
                </td>
                <td className="px-4 py-4 text-text-muted">
                  {formatRelativeTime(sess.startedAt)}
                </td>
                <td className="px-4 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => onOpenInjectModal(sess)}
                    >
                      <Zap className="w-3.5 h-3.5 mr-1" />
                      Inject Failure
                    </Button>

                    {sess.currentFailure && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onResetChaos(sess.sessionId)}
                      >
                        <RotateCcw className="w-3.5 h-3.5 mr-1" />
                        Reset
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
