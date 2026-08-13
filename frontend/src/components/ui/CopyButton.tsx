import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface CopyButtonProps {
  textToCopy: string;
  size?: 'sm' | 'md';
  className?: string;
}

export const CopyButton: React.FC<CopyButtonProps> = ({
  textToCopy,
  size = 'sm',
  className,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for clipboard copy if permissions fail
      setCopied(false);
    }
  };

  const sizes = {
    sm: 'p-1.5 text-xs',
    md: 'p-2 text-sm',
  };

  return (
    <button
      onClick={handleCopy}
      title={copied ? 'Copied!' : 'Copy to clipboard'}
      aria-label="Copy to clipboard"
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md border border-border-default bg-bg-surface text-text-secondary hover:text-text-primary hover:bg-bg-raised transition-colors',
        sizes[size],
        copied && 'border-green-600 text-status-success',
        className
      )}
    >
      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
      <span className="text-xs font-mono">{copied ? 'Copied' : 'Copy'}</span>
    </button>
  );
};
