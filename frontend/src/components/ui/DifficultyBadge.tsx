import React from 'react';
import { cn } from '@/utils/cn';

export interface DifficultyBadgeProps {
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
  className?: string;
}

export const DifficultyBadge: React.FC<DifficultyBadgeProps> = ({
  difficulty,
  className,
}) => {
  const styles = {
    BEGINNER: 'bg-green-900/40 text-green-400 border-green-800',
    INTERMEDIATE: 'bg-amber-900/40 text-amber-400 border-amber-800',
    ADVANCED: 'bg-red-900/40 text-red-400 border-red-800',
    EXPERT: 'bg-purple-900/40 text-purple-400 border-purple-800',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider border',
        styles[difficulty],
        className
      )}
    >
      {difficulty}
    </span>
  );
};
