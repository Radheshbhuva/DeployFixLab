import React from 'react';
import { CopyButton } from './CopyButton';
import { cn } from '@/utils/cn';

export interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
  showCopy?: boolean;
  className?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language = 'bash',
  title,
  showCopy = true,
  className,
}) => {
  return (
    <div className={cn('rounded-lg border border-terminal-border bg-terminal-bg overflow-hidden', className)}>
      {(title || showCopy) && (
        <div className="flex items-center justify-between px-4 py-2 bg-bg-raised/80 border-b border-terminal-border text-xs font-mono text-text-muted">
          <span>{title || language}</span>
          {showCopy && <CopyButton textToCopy={code} size="sm" />}
        </div>
      )}
      <pre className="p-4 font-mono text-sm overflow-x-auto text-terminal-green leading-relaxed selection:bg-slate-700">
        <code>{code}</code>
      </pre>
    </div>
  );
};
