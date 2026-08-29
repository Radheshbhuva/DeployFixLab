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
    BEGINNER: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
    INTERMEDIATE: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
    ADVANCED: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30',
    EXPERT: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30',
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
