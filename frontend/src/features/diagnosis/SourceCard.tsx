import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { EvidenceSource, EvidenceSourceType } from '@/types/diagnosis.types';
import { Trash2, Link, FileCode, Terminal } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface SourceCardProps {
  source: EvidenceSource;
  onUpdate: (id: string, value: string) => void;
  onRemove: (id: string) => void;
}

export const SourceCard: React.FC<SourceCardProps> = ({
  source,
  onUpdate,
  onRemove,
}) => {
  const getIcon = (type: EvidenceSourceType) => {
    switch (type) {
      case 'GITHUB_URL':
      case 'PRODUCTION_URL':
        return <Link className="w-4 h-4 text-blue-400" />;
      case 'DOCKERFILE':
      case 'DOCKER_COMPOSE':
      case 'ENV_FILE':
      case 'CONFIG_FILE':
        return <FileCode className="w-4 h-4 text-purple-400" />;
      default:
        return <Terminal className="w-4 h-4 text-terminal-green" />;
    }
  };

  return (
    <Card className="relative p-4 border border-border-default space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {getIcon(source.type)}
          <span className="text-xs font-semibold text-text-primary uppercase tracking-wider">
            {source.label}
          </span>
          {source.isRequired && (
            <span className="text-[10px] text-status-danger font-bold uppercase">*Required</span>
          )}
        </div>
        {!source.isRequired && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemove(source.id)}
            className="p-1 h-auto text-text-muted hover:text-status-danger"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        )}
      </div>

      <textarea
        value={source.value}
        onChange={(e) => onUpdate(source.id, e.target.value)}
        placeholder={`Paste exact content for ${source.label}...`}
        rows={source.type.includes('URL') ? 2 : 4}
        className={cn(
          'w-full bg-bg-primary border border-border-default rounded-md p-2.5 text-xs font-mono text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand-primary resize-y',
          source.type.includes('URL') && 'font-sans'
        )}
      />
    </Card>
  );
};
