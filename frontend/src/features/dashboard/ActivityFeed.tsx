import React from 'react';
import { Card } from '@/components/ui/Card';
import { RecentActivity } from '@/types/dashboard.types';
import { formatRelativeTime } from '@/utils/dateFormatter';
import { PlayCircle, CheckCircle, Zap, ShieldCheck } from 'lucide-react';

export interface ActivityFeedProps {
  activities: RecentActivity[];
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ activities }) => {
  const getIcon = (type: RecentActivity['type']) => {
    switch (type) {
      case 'lab_started':
        return <PlayCircle className="w-4 h-4 text-brand-primary" />;
      case 'lab_completed':
        return <CheckCircle className="w-4 h-4 text-status-success" />;
      case 'chaos_injected':
        return <Zap className="w-4 h-4 text-status-danger" />;
      case 'recovery_verified':
        return <ShieldCheck className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <Card title="Recent Engineering Activity" description="Live audit feed of lab sessions and chaos injections">
      <div className="space-y-4 mt-4">
        {activities.map((act) => (
          <div
            key={act.id}
            className="flex items-start gap-3 p-3 rounded-lg bg-bg-primary/60 border border-border-default/40 hover:border-slate-600 transition-colors"
          >
            <div className="mt-0.5 p-1.5 rounded-full bg-bg-raised flex-shrink-0">
              {getIcon(act.type)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-text-primary leading-relaxed">{act.message}</p>
              <span className="text-[11px] text-text-muted mt-1 block">
                {formatRelativeTime(act.timestamp)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
