import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { DifficultyBadge } from '@/components/ui/DifficultyBadge';
import { Lab } from '@/types/lab.types';
import { Clock, Users, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export interface LabCardProps {
  lab: Lab;
  onStart: (labId: string) => void;
}

export const LabCard: React.FC<LabCardProps> = ({ lab, onStart }) => {
  return (
    <Card className="flex flex-col justify-between hover:border-slate-500 transition-all duration-200 group">
      <div>
        <div className="flex items-center justify-between mb-3">
          <DifficultyBadge difficulty={lab.difficulty} />
          {lab.isNew && (
            <Badge variant="success" size="sm" className="font-bold">
              NEW
            </Badge>
          )}
        </div>

        <h3 className="text-base font-bold text-text-primary group-hover:text-brand-primary transition-colors mb-2">
          {lab.title}
        </h3>

        <p className="text-xs text-text-secondary line-clamp-3 leading-relaxed mb-4">
          {lab.description}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {lab.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded text-[11px] font-mono bg-bg-raised text-text-muted border border-border-default/60"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between text-xs text-text-muted mb-4 pt-3 border-t border-border-default/60">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {lab.estimatedMinutes} mins
          </span>
          <span className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            {lab.completionCount} completed
          </span>
        </div>

        <Button variant="primary" onClick={() => onStart(lab.id)} className="w-full justify-between">
          <span>Start Lab Scenario</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
};
