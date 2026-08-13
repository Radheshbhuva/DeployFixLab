import React from 'react';
import { Loader2 } from 'lucide-react';

export interface LoadingSpinnerProps {
  fullScreen?: boolean;
  label?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  fullScreen = false,
  label = 'Loading...',
}) => {
  const content = (
    <div className="flex flex-col items-center justify-center gap-3">
      <Loader2 className="w-10 h-10 animate-spin text-brand-primary" />
      {label && <span className="text-sm font-medium text-text-muted">{label}</span>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg-primary/80 backdrop-blur-sm">
        {content}
      </div>
    );
  }

  return <div className="py-12 flex justify-center">{content}</div>;
};
