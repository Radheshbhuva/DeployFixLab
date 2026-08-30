import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  TerminalEngine,
  TerminalOutputLine,
  TerminalEngineContext,
} from './TerminalEngine';
import {
  Terminal as TerminalIcon,
  Trash2,
  Copy,
  Download,
  Maximize2,
  Minimize2,
  Check,
  Zap,
  CornerDownLeft,
  Sparkles,
  Play,
} from 'lucide-react';
import { useToast } from '@/hooks/useToast';

export interface SreTerminalProps {
  initialLines?: TerminalOutputLine[];
  context?: TerminalEngineContext;
  quickCommands?: Array<{ label: string; cmd: string; icon?: React.ReactNode }>;
  height?: string;
  className?: string;
  title?: string;
  onCommandExecuted?: (cmd: string, output: TerminalOutputLine[]) => void;
}

export const SreTerminal: React.FC<SreTerminalProps> = ({
  initialLines,
  context,
  quickCommands = [
    { label: 'docker compose ps', cmd: 'docker compose ps' },
    { label: 'docker logs gateway', cmd: 'docker compose logs gateway' },
    { label: 'curl /health', cmd: 'curl http://localhost:5000/health' },
    { label: 'cat .env', cmd: 'cat .env' },
    { label: 'netstat -tuln', cmd: 'netstat -tuln' },
    { label: 'nslookup db', cmd: 'nslookup postgres' },
    { label: 'apply patch', cmd: 'apply-patch' },
    { label: 'verify', cmd: 'verify' },
  ],
  height = 'h-[460px]',
  className = '',
  title = 'deployfix-sandbox (Docker 26.0 / Alpine 3.19)',
  onCommandExecuted,
}) => {
  const [lines, setLines] = useState<TerminalOutputLine[]>(() => {
    if (initialLines && initialLines.length > 0) return initialLines;
    return [
      {
        id: 'init-1',
        type: 'system',
        text: 'DeployFix SRE Sandbox Environment (v2.4) initialized.',
        timestamp: new Date().toISOString().substring(11, 19),
      },
      {
        id: 'init-2',
        type: 'system',
        text: 'Isolated in Docker bridge network: deployfix-chaos-net (172.28.0.0/16)',
        timestamp: new Date().toISOString().substring(11, 19),
      },
      {
        id: 'init-3',
        type: 'warning',
        text: 'ALERT: Synthetic healthcheck probe reported 503 SERVICE UNAVAILABLE.',
        timestamp: new Date().toISOString().substring(11, 19),
      },
      {
        id: 'init-4',
        type: 'info',
        text: 'Type "help" or click quick diagnostic shortcuts below to begin triage. Press Tab for autocompletion.',
        timestamp: new Date().toISOString().substring(11, 19),
      },
    ];
  });

  const [inputVal, setInputVal] = useState('');
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [completions, setCompletions] = useState<string[]>([]);

  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();

  const engine = useMemo(() => {
    return new TerminalEngine(context);
  }, []);

  // Keep engine context updated
  useEffect(() => {
    if (context) {
      engine.updateContext(context);
    }
  }, [context, engine]);

  // Auto-scroll on new output
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  // Handle Autocompletion suggestion calculation
  useEffect(() => {
    if (inputVal.trim().length > 0) {
      const suggestions = engine.getAvailableCompletions(inputVal);
      setCompletions(suggestions);
    } else {
      setCompletions([]);
    }
  }, [inputVal, engine]);

  const handleExecute = (cmdToRun?: string) => {
    const command = (cmdToRun !== undefined ? cmdToRun : inputVal).trim();
    if (!command) return;

    const output = engine.execute(command);
    setLines((prev) => [...prev, ...output]);
    setInputVal('');
    setHistoryIndex(-1);
    setCompletions([]);

    if (onCommandExecuted) {
      onCommandExecuted(command, output);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const history = engine.getHistory();

    if (e.key === 'Enter') {
      e.preventDefault();
      handleExecute();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length === 0) return;
      const nextIndex = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIndex);
      setInputVal(history[nextIndex] || '');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex === -1) return;
      const nextIndex = historyIndex + 1;
      if (nextIndex >= history.length) {
        setHistoryIndex(-1);
        setInputVal('');
      } else {
        setHistoryIndex(nextIndex);
        setInputVal(history[nextIndex] || '');
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      if (completions.length > 0) {
        const parts = inputVal.split(' ');
        if (parts.length === 1) {
          setInputVal(completions[0]);
        } else {
          parts[parts.length - 1] = completions[0];
          setInputVal(parts.join(' '));
        }
      }
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      handleClear();
    }
  };

  const handleClear = () => {
    setLines([]);
    toast.info('Terminal screen cleared');
  };

  const handleCopy = () => {
    const text = lines.map((l) => l.text).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Terminal session copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const text = lines.map((l) => `[${l.timestamp || ''}] ${l.text}`).join('\n');
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `deployfix-terminal-${new Date().toISOString().replace(/[:.]/g, '-')}.log`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Downloaded terminal session log');
  };

  const renderLineContent = (line: TerminalOutputLine) => {
    switch (line.type) {
      case 'input':
        return <span className="text-terminal-cyan font-bold">{line.text}</span>;
      case 'success':
        return <span className="text-terminal-green">{line.text}</span>;
      case 'error':
        return <span className="text-terminal-red">{line.text}</span>;
      case 'warning':
        return <span className="text-terminal-amber">{line.text}</span>;
      case 'system':
        return <span className="text-slate-400 italic">{line.text}</span>;
      case 'info':
        return <span className="text-cyan-300">{line.text}</span>;
      case 'output':
      default:
        return <span className="text-terminal-text">{line.text}</span>;
    }
  };

  return (
    <div
      className={`flex flex-col bg-terminal-bg border border-terminal-border rounded-2xl shadow-2xl overflow-hidden font-mono text-xs text-left ${
        isFullscreen ? 'fixed inset-4 z-50 h-[calc(100vh-32px)]' : height
      } ${className}`}
      onClick={() => inputRef.current?.focus()}
    >
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950/80 border-b border-terminal-border select-none flex-shrink-0">
        {/* Left Window Traffic Lights & Title */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 hover:bg-rose-500 inline-block transition-colors cursor-pointer" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80 hover:bg-amber-500 inline-block transition-colors cursor-pointer" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 hover:bg-emerald-500 inline-block transition-colors cursor-pointer" />
          </div>
          <div className="flex items-center gap-2">
            <TerminalIcon className="w-3.5 h-3.5 text-terminal-cyan" />
            <span className="text-[11px] font-semibold text-slate-300 tracking-wide truncate max-w-xs">
              {title}
            </span>
          </div>
        </div>

        {/* Right Controls & Actions */}
        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            SANDBOX READY
          </span>

          <div className="flex items-center gap-1 border-l border-terminal-border pl-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleCopy();
              }}
              className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-100 transition-colors"
              title="Copy output"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleDownload();
              }}
              className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-100 transition-colors"
              title="Download session log"
            >
              <Download className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleClear();
              }}
              className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-rose-400 transition-colors"
              title="Clear terminal (Ctrl+L)"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsFullscreen(!isFullscreen);
              }}
              className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-100 transition-colors"
              title="Toggle Fullscreen"
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Quick Action Shortcut Chips */}
      {quickCommands && quickCommands.length > 0 && (
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900/60 border-b border-terminal-border/50 overflow-x-auto flex-shrink-0 scrollbar-thin">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold flex items-center gap-1 flex-shrink-0 mr-1">
            <Zap className="w-3 h-3 text-amber-400" />
            Quick:
          </span>
          {quickCommands.map((qc, idx) => (
            <button
              key={idx}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleExecute(qc.cmd);
              }}
              className="px-2 py-0.5 rounded-md bg-slate-800/80 hover:bg-slate-700 text-[11px] text-slate-300 hover:text-cyan-300 border border-slate-700/60 hover:border-cyan-500/40 transition-all flex items-center gap-1 whitespace-nowrap flex-shrink-0 font-mono"
            >
              {qc.icon || <Play className="w-2.5 h-2.5 text-cyan-400" />}
              <span>{qc.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Terminal Screen Body */}
      <div className="flex-1 p-3.5 overflow-y-auto space-y-1.5 text-[12px] leading-relaxed selection:bg-brand-primary/30">
        {lines.map((line) => (
          <div key={line.id} className="whitespace-pre-wrap break-all">
            {renderLineContent(line)}
          </div>
        ))}
        <div ref={terminalEndRef} />
      </div>

      {/* Autocomplete Hints Toolbar */}
      {completions.length > 0 && (
        <div className="flex items-center gap-2 px-3 py-1 bg-slate-950/90 border-t border-terminal-border/60 text-[11px] text-slate-400 overflow-x-auto flex-shrink-0">
          <span className="text-[10px] font-semibold text-cyan-400 uppercase tracking-widest flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-cyan-400" /> Tab Suggestions:
          </span>
          {completions.slice(0, 5).map((comp, idx) => (
            <button
              key={idx}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setInputVal(comp);
                inputRef.current?.focus();
              }}
              className="px-2 py-0.5 rounded bg-slate-800 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 border border-slate-700 transition-colors"
            >
              {comp}
            </button>
          ))}
        </div>
      )}

      {/* Bottom Command Input Bar */}
      <div className="flex items-center gap-2 px-3 py-2 bg-slate-950 border-t border-terminal-border flex-shrink-0">
        <span className="text-terminal-green font-bold select-none whitespace-nowrap">
          {engine.getPrompt()}
        </span>
        <input
          ref={inputRef}
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="type SRE command (e.g. docker compose ps, curl /health, apply-patch, help)..."
          className="flex-1 bg-transparent text-slate-100 placeholder:text-slate-600 focus:outline-none font-mono text-xs selection:bg-brand-primary/40"
          autoFocus
          spellCheck={false}
          autoComplete="off"
        />
        <button
          type="button"
          onClick={() => handleExecute()}
          disabled={!inputVal.trim()}
          className="p-1 rounded-md text-slate-400 hover:text-cyan-400 hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-colors"
          title="Run command (Enter)"
        >
          <CornerDownLeft className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
