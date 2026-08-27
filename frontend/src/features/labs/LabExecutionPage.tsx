import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { labService } from '@/services/labService';
import { Lab, LabSession, VerificationResult } from '@/types/lab.types';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { VerificationResultCard } from './VerificationResultCard';
import { useToast } from '@/hooks/useToast';
import {
  ShieldCheck,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Server,
  Send,
  Download,
  CheckSquare,
  Square,
  HelpCircle,
  Copy,
  Check,
} from 'lucide-react';

export const LabExecutionPage: React.FC = () => {
  const { labId } = useParams<{ labId: string }>();
  const [lab, setLab] = useState<Lab | null>(null);
  const [session, setSession] = useState<LabSession | null>(null);
  const [verificationResults, setVerificationResults] = useState<VerificationResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);
  const [activeTab, setActiveTab] = useState<'terminal' | 'logs' | 'hints'>('terminal');
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalHistory, setTerminalHistory] = useState<
    Array<{ type: 'input' | 'output' | 'error' | 'success'; text: string }>
  >([
    { type: 'output', text: 'Initializing DeployFix SRE Sandbox Environment...' },
    { type: 'output', text: 'Target cluster booted in isolated bridge network: deployfix-chaos-net' },
    { type: 'error', text: 'ALERT: Healthcheck probe failed for target container service.' },
    { type: 'output', text: 'Type a command or click quick diagnostic shortcuts below to begin triage.' },
  ]);
  const [checkedObjectives, setCheckedObjectives] = useState<Record<number, boolean>>({});
  const [showCertificate, setShowCertificate] = useState(false);
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  const terminalEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    const initLabSession = async () => {
      if (!labId) return;
      try {
        const labData = await labService.getLabById(labId);
        setLab(labData);
        const sessData = await labService.startLabSession(labId);
        setSession(sessData);
      } catch (err) {
        console.error('Failed to start lab session:', err);
        toast.error('Failed to initialize lab environment');
      } finally {
        setLoading(false);
      }
    };

    initLabSession();
  }, [labId, toast]);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalHistory]);

  const handleRunCommand = (cmd: string) => {
    if (!cmd.trim()) return;

    const newHistory = [...terminalHistory, { type: 'input' as const, text: `$ ${cmd}` }];

    const lower = cmd.toLowerCase().trim();

    if (lower.includes('docker compose ps') || lower.includes('docker ps')) {
      newHistory.push({
        type: 'output',
        text: `NAME                  IMAGE               COMMAND                  SERVICE             STATUS
deployfix-gateway     node:20-alpine      "npm run start"          gateway             Up 2 minutes (unhealthy)
deployfix-postgres    postgres:16-alpine  "docker-entrypoint.s…"   postgres            Up 2 minutes (healthy)
deployfix-redis       redis:7-alpine      "docker-entrypoint.s…"   redis               Up 2 minutes (healthy)`,
      });
    } else if (lower.includes('docker compose logs') || lower.includes('logs')) {
      newHistory.push({
        type: 'error',
        text: `[deployfix-gateway] ERROR 2026-08-20T08:30:12Z: Failed to connect to database at 127.0.0.1:5432
[deployfix-gateway] Error: connect ECONNREFUSED 127.0.0.1:5432
[deployfix-gateway] at TCPConnectWrap.afterConnect [as oncomplete] (node:net:1605:16)
[deployfix-gateway] Retrying in 5000ms... (attempt 4/10)`,
      });
    } else if (lower.includes('curl') || lower.includes('health')) {
      newHistory.push({
        type: 'error',
        text: `HTTP/1.1 503 Service Unavailable
Content-Type: application/json
Date: Thu, 20 Aug 2026 08:30:20 GMT

{"status":"degraded","error":"Database connection refused on 127.0.0.1:5432"}`,
      });
    } else if (
      lower.includes('fix') ||
      lower.includes('sed') ||
      lower.includes('postgres') ||
      lower.includes('apply')
    ) {
      newHistory.push({
        type: 'success',
        text: `✓ Applied configuration patch to DATABASE_URL:
- DATABASE_URL="postgresql://user:pass@127.0.0.1:5432/deployfix"
+ DATABASE_URL="postgresql://user:pass@postgres:5432/deployfix"
Restarting deployfix-gateway container...
✓ Container deployfix-gateway restarted successfully. Handshake nominal.`,
      });
    } else if (lower === 'clear') {
      setTerminalHistory([]);
      setTerminalInput('');
      return;
    } else {
      newHistory.push({
        type: 'output',
        text: `Executed: ${cmd}\nExit Code: 0`,
      });
    }

    setTerminalHistory(newHistory);
    setTerminalInput('');
  };

  const handleRunVerification = async () => {
    if (!session) return;
    setIsVerifying(true);
    try {
      const results = await labService.runVerification(session.sessionId);
      setVerificationResults(results);

      const allPassed = results.every((r) => r.passed);
      if (allPassed) {
        const updatedSess = await labService.completeSession(session.sessionId);
        setSession(updatedSess);
        setShowCertificate(true);
        toast.success('Congratulations! 100% verification tests passed.');
      } else {
        toast.error('Verification failed. Check test results.');
      }
    } catch {
      toast.error('Error running verification suite.');
    } finally {
      setIsVerifying(false);
    }
  };

  const toggleObjective = (idx: number) => {
    setCheckedObjectives((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const handleCopyCmd = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(cmd);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  if (loading || !lab) {
    return <LoadingSpinner label="Provisioning isolated chaos container sandbox..." />;
  }

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'BEGINNER':
        return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
      case 'INTERMEDIATE':
        return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
      case 'ADVANCED':
        return 'text-rose-400 border-rose-500/30 bg-rose-500/10';
      case 'EXPERT':
        return 'text-purple-400 border-purple-500/30 bg-purple-500/10';
      default:
        return 'text-slate-300 border-slate-700 bg-slate-800';
    }
  };

  return (
    <div className="space-y-5 pb-12 text-left">
      {/* Top Breadcrumb & Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => navigate('/labs')}
          className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-slate-400 hover:text-cyan-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Chaos Catalog</span>
        </button>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-bg-raised border border-border-default text-text-secondary">
            Session: <span className="text-brand-primary font-bold">{session?.sessionId}</span>
          </span>
          <button
            type="button"
            onClick={handleRunVerification}
            disabled={isVerifying}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{isVerifying ? 'Running Test Suite...' : 'Verify Solution'}</span>
          </button>
        </div>
      </div>

      {/* Scenario Header Info Banner */}
      <div className="rounded-2xl border border-border-default bg-bg-surface p-5 backdrop-blur-xl shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-bg-raised border border-border-default text-text-primary">
              {lab.code}
            </span>
            <span
              className={`text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${getDifficultyColor(
                lab.difficulty
              )}`}
            >
              {lab.difficulty}
            </span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-brand-primary/10 border border-brand-primary/30 text-brand-primary">
              {lab.category}
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-extrabold text-text-primary">{lab.title}</h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-1 max-w-3xl leading-relaxed">
            {lab.description}
          </p>
        </div>

        <div className="flex items-center gap-3 bg-bg-raised p-3 rounded-xl border border-border-default flex-shrink-0 text-xs font-mono">
          <Server className="w-4 h-4 text-brand-primary" />
          <div>
            <div className="text-text-muted text-[10px]">TARGET NODE</div>
            <div className="font-bold text-text-primary">{lab.targetService}</div>
          </div>
        </div>
      </div>

      {/* Split Screen Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Playbook & Objectives (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Objectives Card */}
          <div className="rounded-2xl border border-border-default bg-bg-surface p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-text-secondary flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-primary" />
                Incident Objectives
              </h2>
              <span className="text-[10px] font-mono text-brand-primary font-bold">
                {Object.values(checkedObjectives).filter(Boolean).length} / {lab.objectives.length}
              </span>
            </div>

            <div className="space-y-2">
              {lab.objectives.map((obj, idx) => {
                const isChecked = !!checkedObjectives[idx];
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => toggleObjective(idx)}
                    className={`w-full flex items-start gap-2.5 p-2.5 rounded-xl border text-left transition-all ${
                      isChecked
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-300'
                        : 'bg-bg-raised border-border-default text-text-secondary hover:border-brand-primary/50'
                    }`}
                  >
                    {isChecked ? (
                      <CheckSquare className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    ) : (
                      <Square className="w-4 h-4 text-text-muted mt-0.5 flex-shrink-0" />
                    )}
                    <span className="text-xs leading-relaxed font-sans">{obj}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Fault Summary & Playbook */}
          <div className="rounded-2xl border border-border-default bg-bg-surface p-4 shadow-sm space-y-3">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-text-secondary flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-500" />
              Failure Characteristics
            </h2>
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-mono leading-relaxed">
              {lab.faultSummary}
            </div>

            <div className="space-y-2 pt-2">
              <div className="text-[11px] font-mono text-text-muted font-bold uppercase">
                Troubleshooting Hints:
              </div>
              {lab.hints.map((hint, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2 text-xs text-text-secondary bg-bg-raised p-2.5 rounded-xl border border-border-default font-sans"
                >
                  <HelpCircle className="w-4 h-4 text-brand-primary mt-0.5 flex-shrink-0" />
                  <span>{hint}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Diagnostic Command Shortcuts */}
          <div className="rounded-2xl border border-border-default bg-bg-surface p-4 shadow-sm">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-text-secondary mb-2.5">
              Quick Diagnostic Scripts
            </div>
            <div className="space-y-1.5 font-mono text-xs">
              {[
                'docker compose ps',
                'docker compose logs -f --tail=50 gateway',
                'curl -I http://localhost:5000/health',
                'apply-network-fix',
              ].map((cmd) => (
                <div
                  key={cmd}
                  className="flex items-center justify-between p-2 rounded-lg bg-bg-raised border border-border-default text-text-secondary hover:border-brand-primary/50"
                >
                  <span className="text-brand-primary truncate">$ {cmd}</span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleCopyCmd(cmd)}
                      className="p-1 text-text-muted hover:text-text-primary"
                      title="Copy command"
                    >
                      {copiedCmd === cmd ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRunCommand(cmd)}
                      className="px-2 py-0.5 rounded bg-brand-primary/10 text-brand-primary text-[10px] font-bold hover:bg-brand-primary/20"
                    >
                      Run
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Terminal & Verification (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Terminal Tabs */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl overflow-hidden flex flex-col h-[520px]">
            {/* Terminal Header */}
            <div className="bg-slate-900 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="ml-2 text-xs font-mono text-slate-400">
                  sandbox@deployfix-lab:~ ({lab.code})
                </span>
              </div>

              <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-[11px] font-mono">
                <button
                  type="button"
                  onClick={() => setActiveTab('terminal')}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    activeTab === 'terminal'
                      ? 'bg-cyan-500/20 text-cyan-400 font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Bash Terminal
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('logs')}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    activeTab === 'logs'
                      ? 'bg-cyan-500/20 text-cyan-400 font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Live Log Tail
                </button>
              </div>
            </div>

            {/* Terminal Screen Area */}
            <div className="flex-1 p-4 overflow-y-auto font-mono text-xs text-left space-y-2 scrollbar-thin scrollbar-thumb-slate-800">
              {activeTab === 'terminal' ? (
                <>
                  {terminalHistory.map((item, idx) => (
                    <div
                      key={idx}
                      className={`leading-relaxed whitespace-pre-wrap ${
                        item.type === 'input'
                          ? 'text-cyan-400 font-bold'
                          : item.type === 'error'
                          ? 'text-rose-400 bg-rose-500/10 p-2 rounded border border-rose-500/20'
                          : item.type === 'success'
                          ? 'text-emerald-400 bg-emerald-500/10 p-2 rounded border border-emerald-500/20'
                          : 'text-slate-300'
                      }`}
                    >
                      {item.text}
                    </div>
                  ))}
                  <div ref={terminalEndRef} />
                </>
              ) : (
                <div className="space-y-1 text-slate-400">
                  <div className="text-cyan-400">[stream] Connected to live WebSocket /ws/logs/containers</div>
                  <div>2026-08-20T08:30:01Z [postgres] LOG: database system is ready to accept connections</div>
                  <div className="text-rose-400">
                    2026-08-20T08:30:05Z [gateway] ERROR: ECONNREFUSED 127.0.0.1:5432
                  </div>
                  <div>2026-08-20T08:30:10Z [redis] 1:M 20 Aug 2026 08:30:10.123 * Ready to accept connections</div>
                  <div className="text-amber-400">
                    2026-08-20T08:30:15Z [nginx] 502 Bad Gateway while connecting to upstream
                  </div>
                </div>
              )}
            </div>

            {/* Terminal Input Bar */}
            {activeTab === 'terminal' && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleRunCommand(terminalInput);
                }}
                className="bg-slate-900 p-2.5 border-t border-slate-800 flex items-center gap-2 font-mono text-xs"
              >
                <span className="text-cyan-400 pl-2">$</span>
                <input
                  type="text"
                  placeholder="Enter command (e.g. docker compose ps, docker logs gateway, fix)..."
                  value={terminalInput}
                  onChange={(e) => setTerminalInput(e.target.value)}
                  className="flex-1 bg-transparent text-slate-100 placeholder-slate-600 focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-lg bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>

          {/* Test Suite Verification Results Panel */}
          {verificationResults.length > 0 && (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Automated Verification Test Suite
                </h3>
                <span className="text-xs font-mono text-emerald-400 font-bold">
                  {verificationResults.filter((r) => r.passed).length} / {verificationResults.length}{' '}
                  Passed
                </span>
              </div>

              <div className="space-y-2">
                {verificationResults.map((result, idx) => (
                  <VerificationResultCard key={idx} result={result} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Completion Modal / Certificate Generator */}
      {showCertificate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-bg-surface border border-emerald-500/40 rounded-3xl p-6 sm:p-8 max-w-lg w-full text-center shadow-2xl relative space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-500">
              <Sparkles className="w-8 h-8" />
            </div>

            <div>
              <span className="text-[11px] font-mono font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/40">
                SCENARIO RESOLVED 100%
              </span>
              <h3 className="text-2xl font-extrabold text-text-primary mt-2">
                Incident Triage Certified
              </h3>
              <p className="text-xs text-text-secondary mt-1">
                You successfully diagnosed and resolved {lab.code}: {lab.title}.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-bg-raised border border-border-default text-left font-mono text-xs space-y-2">
              <div className="flex justify-between text-text-secondary">
                <span>Engineer:</span>
                <span className="text-text-primary font-bold">Radhesh Bhuva (Lead SRE)</span>
              </div>
              <div className="flex justify-between text-text-secondary">
                <span>Verification Score:</span>
                <span className="text-emerald-500 font-bold">100 / 100 PTS</span>
              </div>
              <div className="flex justify-between text-text-secondary">
                <span>Verification Timestamp:</span>
                <span className="text-text-primary">{new Date().toISOString()}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  toast.success('Certificate exported to clipboard');
                  setShowCertificate(false);
                }}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg"
              >
                <Download className="w-4 h-4" />
                <span>Export Certificate</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCertificate(false);
                  navigate('/labs');
                }}
                className="w-full py-2.5 rounded-xl bg-bg-raised hover:bg-bg-raised/80 text-text-primary font-bold text-xs border border-border-default"
              >
                Return to Catalog
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
