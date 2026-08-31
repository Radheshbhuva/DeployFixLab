import React from 'react';
import { DiagnosisEvidence } from '@/types/diagnosis.types';
import { Badge } from '@/components/ui/Badge';
import { AlertTriangle, Info, ShieldAlert } from 'lucide-react';

export interface EvidenceItemProps {
  evidence: DiagnosisEvidence;
}

export const EvidenceItem: React.FC<EvidenceItemProps> = ({ evidence }) => {
  const getBadgeVariant = (severity: DiagnosisEvidence['severity']) => {
    switch (severity) {
      case 'critical':
        return 'danger';
      case 'major':
        return 'warning';
      case 'minor':
        return 'info';
      default:
        return 'default';
    }
  };

  const getIcon = (severity: DiagnosisEvidence['severity']) => {
    switch (severity) {
      case 'critical':
        return <ShieldAlert className="w-4 h-4 text-status-danger flex-shrink-0" />;
      case 'major':
        return <AlertTriangle className="w-4 h-4 text-status-warning flex-shrink-0" />;
      default:
        return <Info className="w-4 h-4 text-blue-400 flex-shrink-0" />;
    }
  };

  return (
    <div className="flex items-start gap-3 p-3 rounded-lg bg-bg-primary border border-border-default/60">
      <div className="mt-0.5">{getIcon(evidence.severity)}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className="text-xs font-semibold text-text-secondary">
            {evidence.sourceLabel}
          </span>
          <Badge variant={getBadgeVariant(evidence.severity)} size="sm" className="uppercase font-mono text-[10px]">
            {evidence.severity}
          </Badge>
        </div>
        <p className="text-xs text-text-primary font-mono leading-relaxed">{evidence.finding}</p>
      </div>
    </div>
  );
};
