import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { labService } from '@/services/labService';
import { Lab, LabSession, VerificationResult, TopologyNode } from '@/types/lab.types';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { VerificationResultCard } from './VerificationResultCard';
import { SreTerminal } from '@/components/terminal/SreTerminal';
import { useToast } from '@/hooks/useToast';
import {
  ShieldCheck,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Server,
  CheckSquare,
  Square,
  HelpCircle,
  RotateCcw,
  Terminal as TerminalIcon,
  Activity,
  FileCode,
  ListFilter,
  Play,
  Pause,
  Clock,
  Radio,
  Cpu,
  HardDrive,
  Wifi,
  CheckCheck,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export const LabExecutionPage: React.FC = () => {
  const { labId } = useParams<{ labId: string }>();
  const [lab, setLab] = useState<Lab | null>(null);
  const [session, setSession] = useState<LabSession | null>(null);
  const [verificationResults, setVerificationResults] = useState<VerificationResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);
  const [activeTab, setActiveTab] = useState<'terminal' | 'logs' | 'telemetry' | 'config'>('terminal');

  // Topology & Patch State
  const [topologyNodes, setTopologyNodes] = useState<TopologyNode[]>([]);
  const [patchApplied, setPatchApplied] = useState(false);
  const [checkedObjectives, setCheckedObjectives] = useState<Record<number, boolean>>({});
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [showHints, setShowHints] = useState(true);

  // Live Logs State
  const [logFilterLevel, setLogFilterLevel] = useState<'ALL' | 'ERROR' | 'WARN' | 'INFO'>('ALL');
  const [logFilterSearch, setLogFilterSearch] = useState('');
  const [isStreamingLogs, setIsStreamingLogs] = useState(true);

  // Config Inspector State
  const [selectedConfigIndex, setSelectedConfigIndex] = useState(0);

  const navigate = useNavigate();
  const toast = useToast();

  // Load Lab and Initialize Sandbox
  useEffect(() => {
    let isMounted = true;
    const initLabSession = async () => {
      if (!labId) return;
      try {
        const labData = await labService.getLabById(labId);
        if (!isMounted) return;
        setLab(labData);
        setTopologyNodes(labData.topology || []);

        const sessData = await labService.startLabSession(labId);
        if (!isMounted) return;
        setSession(sessData);
      } catch (err) {
        console.error('Failed to start lab session:', err);
        if (isMounted) {
          toast.error('Failed to initialize lab environment');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    initLabSession();
    return () => {
      isMounted = false;
    };
  }, [labId]);

  // Incident Elapsed Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTimer = useMemo(() => {
    const mins = Math.floor(elapsedSeconds / 60);
    const secs = elapsedSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, [elapsedSeconds]);

  // Mark Objective Helper
  const markObjective = (index: number) => {
    setCheckedObjectives((prev) => ({ ...prev, [index]: true }));
  };

  // Run Verification Suite
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
        markObjective(3);
        toast.success('Congratulations! 100% verification tests passed.');
      } else {
        toast.error('Verification failed. Check test assertions.');
      }
    } catch {
      toast.error('Error running verification suite.');
    } finally {
      setIsVerifying(false);
    }
  };

  // Reset Sandbox
  const handleResetSandbox = () => {
    setPatchApplied(false);
    setVerificationResults([]);
    setCheckedObjectives({});
    setElapsedSeconds(0);
    setTopologyNodes(lab?.topology || []);
    toast.success('Sandbox environment reset to initial failure state.');
  };

  const handleApplyPatchDirectly = () => {
    setPatchApplied(true);
    markObjective(1);
    markObjective(2);
    setTopologyNodes((prev) =>
      prev.map((node) => ({
        ...node,
        status: 'HEALTHY',
      }))
    );
    toast.success('Configuration patch applied! Target service restarted.');
  };

  const terminalContext = useMemo(() => {
    if (!lab) return undefined;
    return {
      labId: lab.id,
      labTitle: lab.title,
      patchApplied,
      files: lab.configFiles?.reduce((acc, f) => {
        acc[f.filename] = f.content;
        return acc;
      }, {} as Record<string, string>),
      onPatchApplied: handleApplyPatchDirectly,
      onRunVerification: handleRunVerification,
    };
  }, [lab, patchApplied, session]);

  if (loading || !lab) {
    return <LoadingSpinner label="Provisioning isolated chaos container sandbox..." />;
  }

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'BEGINNER':
        return 'text-emerald-600 dark:text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
      case 'INTERMEDIATE':
        return 'text-amber-600 dark:text-amber-400 border-amber-500/30 bg-amber-500/10';
      case 'ADVANCED':
        return 'text-rose-600 dark:text-rose-400 border-rose-500/30 bg-rose-500/10';
      case 'EXPERT':
        return 'text-purple-600 dark:text-purple-400 border-purple-500/30 bg-purple-500/10';
      default:
        return 'text-text-secondary border-border-default bg-bg-raised';
    }
  };

  const completedObjectivesCount = Object.values(checkedObjectives).filter(Boolean).length;
  const progressPercent = Math.round((completedObjectivesCount / lab.objectives.length) * 100);

  return (
    <div className="space-y-5 pb-12 text-left">
      {/* Unified SRE War-Room Mission Header */}
      <div className="rounded-2xl border border-border-default bg-bg-surface p-5 backdrop-blur-xl shadow-sm space-y-4">
        {/* Top Meta Bar */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 border-b border-border-default pb-4">
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              type="button"
              onClick={() => navigate('/labs')}
              className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-text-secondary hover:text-brand-primary transition-colors px-2.5 py-1.5 rounded-lg bg-bg-raised border border-border-default hover:border-brand-primary/40"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Catalog</span>
            </button>

            <span className="text-[11px] font-mono font-extrabold px-2.5 py-1 rounded-lg bg-bg-raised border border-border-default text-text-primary">
              {lab.code}
            </span>

            <span
              className={`text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg border ${getDifficultyColor(
                lab.difficulty
              )}`}
            >
              {lab.difficulty}
            </span>

            <span className="text-[11px] font-mono font-medium px-2.5 py-1 rounded-lg bg-brand-primary/10 border border-brand-primary/30 text-brand-primary">
              {lab.category}
            </span>

            <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400">
              {lab.severity.replace('_', ' ')}
            </span>

            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-bg-raised border border-border-default text-text-secondary text-xs font-mono">
              <Server className="w-3.5 h-3.5 text-brand-primary" />
              <span>Target: <span className="font-bold text-text-primary">{lab.targetService}</span></span>
            </div>
          </div>

          {/* Session, Clock & Actions */}
          <div className="flex items-center gap-2.5 w-full lg:w-auto justify-between lg:justify-end flex-wrap">
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="px-2.5 py-1.5 rounded-xl bg-bg-raised border border-border-default text-text-secondary">
                Session: <span className="text-brand-primary font-bold">{session?.sessionId || 'sess-active'}</span>
              </span>
              <span className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-bg-raised border border-border-default text-text-secondary">
                <Clock className="w-3.5 h-3.5 text-brand-primary animate-pulse" />
                <span>{formattedTimer}</span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleResetSandbox}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-bg-raised hover:bg-bg-surface border border-border-default text-text-secondary hover:text-text-primary text-xs font-semibold transition-colors"
                title="Reset sandbox to initial failure state"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>

              <button
                type="button"
                onClick={handleRunVerification}
                disabled={isVerifying}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{isVerifying ? 'Running Tests...' : 'Verify Solution'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Title & Description */}
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-text-primary tracking-tight">{lab.title}</h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-1 max-w-4xl leading-relaxed font-sans">
            {lab.description}
          </p>
        </div>
      </div>

      {/* Main 2-Column Split Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Triage Intel, Objectives & Topology (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Card 1: Incident Triage Objectives */}
          <div className="rounded-2xl border border-border-default bg-bg-surface p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-text-secondary flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-primary" />
                Incident Triage Objectives
              </h2>
              <span className="text-[11px] font-mono text-brand-primary font-bold">
                {completedObjectivesCount} / {lab.objectives.length} ({progressPercent}%)
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-bg-raised h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-brand-primary h-full transition-all duration-300 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="space-y-2 pt-1">
              {lab.objectives.map((obj, idx) => {
                const isChecked = !!checkedObjectives[idx];
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() =>
                      setCheckedObjectives((prev) => ({ ...prev, [idx]: !prev[idx] }))
                    }
                    className={`w-full flex items-start gap-2.5 p-2.5 rounded-xl border text-left transition-all ${
                      isChecked
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
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

          {/* Card 2: Failure Vector & Diagnostic Hints */}
          <div className="rounded-2xl border border-border-default bg-bg-surface p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-text-secondary flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-500" />
                Failure Vector Synopsis
              </h2>
              <button
                type="button"
                onClick={() => setShowHints(!showHints)}
                className="text-[11px] font-mono text-text-muted hover:text-text-primary flex items-center gap-1"
              >
                <span>{showHints ? 'Hide Hints' : 'Show Hints'}</span>
                {showHints ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>

            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-xs font-mono leading-relaxed">
              {lab.faultSummary}
            </div>

            {showHints && (
              <div className="space-y-2 pt-1">
                <div className="text-[10px] font-mono text-text-muted font-bold uppercase tracking-wider">
                  Diagnostic Hints:
                </div>
                {lab.hints.map((hint, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2 text-xs text-text-secondary bg-bg-raised p-2.5 rounded-xl border border-border-default font-sans"
                  >
                    <HelpCircle className="w-4 h-4 text-brand-primary mt-0.5 flex-shrink-0" />
                    <span className="leading-relaxed">{hint}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Card 3: Live Infrastructure Container Topology */}
          <div className="rounded-2xl border border-border-default bg-bg-surface p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-text-secondary flex items-center gap-2">
                <Radio className="w-4 h-4 text-brand-primary animate-pulse" />
                Live Container Topology
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-bg-raised text-text-muted border border-border-default">
                172.28.0.0/16
              </span>
            </div>

            <div className="grid grid-cols-1 gap-2 font-mono text-xs">
              {topologyNodes.map((node, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-bg-raised border border-border-default flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                        node.status === 'HEALTHY'
                          ? 'bg-emerald-500 shadow-sm shadow-emerald-500/50'
                          : node.status === 'RECOVERING'
                          ? 'bg-amber-500 animate-pulse'
                          : 'bg-rose-500 animate-ping'
                      }`}
                    />
                    <div className="truncate">
                      <div className="font-bold text-text-primary text-[11px] truncate">{node.name}</div>
                      <div className="text-[10px] text-text-muted truncate">
                        {node.role} • {node.internalIp}:{node.port}
                      </div>
                    </div>
                  </div>

                  <span
                    className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase flex-shrink-0 ${
                      node.status === 'HEALTHY'
                        ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                        : 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30'
                    }`}
                  >
                    {node.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Unified SRE Console & Test Suite Results (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main SRE Console Window */}
          <div className="rounded-2xl border border-terminal-border bg-terminal-bg shadow-2xl overflow-hidden flex flex-col min-h-[580px]">
            {/* Unified Console Header & Tab Switcher */}
            <div className="bg-slate-950 px-4 py-2.5 border-b border-terminal-border flex items-center justify-between flex-wrap gap-2 select-none">
              <div className="flex items-center gap-2.5">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                </div>
                <span className="ml-1 text-xs font-mono font-semibold text-slate-300 hidden sm:inline">
                  sandbox@deployfix:~ ({lab.code})
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  ONLINE
                </span>
              </div>

              {/* Console Tabs */}
              <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-xl border border-slate-800 text-[11px] font-mono">
                <button
                  type="button"
                  onClick={() => setActiveTab('terminal')}
                  className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
                    activeTab === 'terminal'
                      ? 'bg-brand-primary text-white font-bold shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <TerminalIcon className="w-3.5 h-3.5" />
                  <span>Terminal</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('logs')}
                  className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
                    activeTab === 'logs'
                      ? 'bg-brand-primary text-white font-bold shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <ListFilter className="w-3.5 h-3.5" />
                  <span>Live Logs</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('telemetry')}
                  className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
                    activeTab === 'telemetry'
                      ? 'bg-brand-primary text-white font-bold shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span>Probes</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('config')}
                  className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
                    activeTab === 'config'
                      ? 'bg-brand-primary text-white font-bold shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <FileCode className="w-3.5 h-3.5" />
                  <span>Config</span>
                </button>
              </div>
            </div>

            {/* TAB 1: Real Working SRE Terminal */}
            {activeTab === 'terminal' && (
              <div className="flex-1 flex flex-col overflow-hidden">
                <SreTerminal
                  key={session?.sessionId || lab.id}
                  title={`sandbox@deployfix:~ (${lab.code})`}
                  showHeader={false}
                  height="h-full min-h-[520px]"
                  context={terminalContext}
                  quickCommands={[
                    { label: 'docker compose ps', cmd: 'docker compose ps' },
                    { label: 'docker logs gateway', cmd: 'docker compose logs gateway' },
                    { label: 'curl /health', cmd: 'curl http://localhost:5000/health' },
                    { label: 'cat .env', cmd: 'cat .env' },
                    { label: 'nslookup db', cmd: 'nslookup postgres' },
                    { label: 'netstat -tuln', cmd: 'netstat -tuln' },
                    { label: 'apply-patch', cmd: 'apply-patch' },
                    { label: 'verify solution', cmd: 'verify' },
                  ]}
                  onCommandExecuted={(cmd) => {
                    const lower = cmd.toLowerCase();
                    if (lower.includes('docker') || lower.includes('logs')) markObjective(0);
                    if (lower.includes('cat') || lower.includes('nslookup') || lower.includes('ping') || lower.includes('curl')) markObjective(1);
                  }}
                />
              </div>
            )}

            {/* TAB 2: Live Log Stream Screen */}
            {activeTab === 'logs' && (
              <div className="flex-1 flex flex-col justify-between overflow-hidden min-h-[520px]">
                {/* Log Controls Header */}
                <div className="p-3 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 text-[11px]">Level:</span>
                    {(['ALL', 'ERROR', 'WARN', 'INFO'] as const).map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setLogFilterLevel(lvl)}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          logFilterLevel === lvl
                            ? 'bg-cyan-500 text-slate-950'
                            : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Filter logs (regex / text)..."
                      value={logFilterSearch}
                      onChange={(e) => setLogFilterSearch(e.target.value)}
                      className="px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-600 text-xs focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setIsStreamingLogs(!isStreamingLogs)}
                      className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                      title={isStreamingLogs ? 'Pause live stream' : 'Resume live stream'}
                    >
                      {isStreamingLogs ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Log Output Screen */}
                <div className="flex-1 p-4 overflow-y-auto font-mono text-xs text-left space-y-1.5 scrollbar-thin scrollbar-thumb-slate-800 text-slate-300">
                  <div className="text-cyan-400 pb-1 flex items-center gap-2">
                    <Radio className="w-3.5 h-3.5 animate-pulse" />
                    <span>[stream] Connected to live container log pipe (172.28.0.0/16)</span>
                  </div>

                  {patchApplied ? (
                    <>
                      <div>2026-08-20T08:35:01Z [postgres] LOG: connection received: host=172.28.0.2 port=48922</div>
                      <div className="text-emerald-400">2026-08-20T08:35:02Z [gateway] INFO: PostgreSQL connection handshake verified (8ms)</div>
                      <div className="text-cyan-400">2026-08-20T08:35:05Z [gateway] HTTP GET /api/health 200 OK (3.2ms)</div>
                      <div>2026-08-20T08:35:10Z [redis] 1:M 20 Aug 2026 08:35:10.123 * 0 clients connected (0 replicas), 128 MB used</div>
                      <div className="text-emerald-400">2026-08-20T08:35:15Z [gateway] INFO: SLA Health status: 100% nominal (0 errors)</div>
                    </>
                  ) : (
                    <>
                      <div>2026-08-20T08:30:01Z [postgres] LOG: database system is ready to accept connections</div>
                      <div className="text-rose-400 bg-rose-500/10 p-1.5 rounded border border-rose-500/20">
                        2026-08-20T08:30:05Z [gateway] ERROR: ECONNREFUSED 127.0.0.1:5432 - connect failed
                      </div>
                      <div className="text-amber-400">2026-08-20T08:30:08Z [gateway] WARN: Database client retry scheduled in 5000ms</div>
                      <div className="text-rose-400">2026-08-20T08:30:13Z [gateway] ERROR: ECONNREFUSED 127.0.0.1:5432 - retrying connection...</div>
                      <div>2026-08-20T08:30:15Z [redis] 1:M 20 Aug 2026 08:30:15.123 * Ready to accept connections</div>
                      <div className="text-rose-400">2026-08-20T08:30:20Z [gateway] HTTP GET /api/health 503 SERVICE UNAVAILABLE (5002ms)</div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* TAB 3: Telemetry & Container Probes Screen */}
            {activeTab === 'telemetry' && (
              <div className="flex-1 p-5 overflow-y-auto space-y-5 text-slate-100 min-h-[520px]">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs">
                    <Activity className="w-4 h-4" />
                    <span>Real-Time Sandbox Probes</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">Sample Rate: 1000ms</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
                  {/* CPU Gauge */}
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-slate-400">
                      <span className="flex items-center gap-1.5"><Cpu className="w-4 h-4 text-cyan-400" /> CPU Load</span>
                      <span className="font-bold text-cyan-400">{patchApplied ? '4.2%' : '48.5%'}</span>
                    </div>
                    <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${patchApplied ? 'bg-cyan-500 w-[5%]' : 'bg-amber-500 w-[48%]'}`}
                      />
                    </div>
                  </div>

                  {/* Memory Consumption */}
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-slate-400">
                      <span className="flex items-center gap-1.5"><HardDrive className="w-4 h-4 text-purple-400" /> Memory Usage</span>
                      <span className="font-bold text-purple-400">{patchApplied ? '348 MB / 2048 MB' : '1420 MB / 2048 MB'}</span>
                    </div>
                    <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${patchApplied ? 'bg-purple-500 w-[17%]' : 'bg-rose-500 w-[70%]'}`}
                      />
                    </div>
                  </div>

                  {/* Network Latency */}
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-slate-400">
                      <span className="flex items-center gap-1.5"><Wifi className="w-4 h-4 text-emerald-400" /> Internal Latency</span>
                      <span className="font-bold text-emerald-400">{patchApplied ? '1.2 ms (Nominal)' : '5002 ms (Timeout)'}</span>
                    </div>
                    <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${patchApplied ? 'bg-emerald-500 w-[5%]' : 'bg-rose-500 w-[95%]'}`}
                      />
                    </div>
                  </div>

                  {/* SLA Uptime */}
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-slate-400">
                      <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-400" /> SLA Recovery</span>
                      <span className={`font-bold ${patchApplied ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {patchApplied ? '100.0% Nominal' : '0.0% Failing'}
                      </span>
                    </div>
                    <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${patchApplied ? 'bg-emerald-500 w-[100%]' : 'bg-rose-500 w-[0%]'}`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: Config Inspector & Patch Editor */}
            {activeTab === 'config' && (
              <div className="flex-1 flex flex-col justify-between overflow-hidden min-h-[520px]">
                <div className="p-3 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 overflow-x-auto">
                    {(lab.configFiles || [{ filename: 'docker-compose.yml', path: './docker-compose.yml', content: '', patchedContent: '' }]).map(
                      (cfg, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setSelectedConfigIndex(idx)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors ${
                            selectedConfigIndex === idx
                              ? 'bg-slate-950 text-cyan-400 border border-slate-800 font-bold'
                              : 'text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          {cfg.filename}
                        </button>
                      )
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={handleApplyPatchDirectly}
                    className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    <span>Apply Recommended Patch</span>
                  </button>
                </div>

                <div className="flex-1 p-4 overflow-y-auto font-mono text-xs text-left bg-slate-950 text-slate-300 whitespace-pre scrollbar-thin scrollbar-thumb-slate-800">
                  {patchApplied
                    ? lab.configFiles?.[selectedConfigIndex]?.patchedContent || lab.configFiles?.[0]?.patchedContent
                    : lab.configFiles?.[selectedConfigIndex]?.content || lab.configFiles?.[0]?.content}
                </div>
              </div>
            )}
          </div>

          {/* Test Suite Verification Results Panel */}
          {verificationResults.length > 0 && (
            <div className="rounded-2xl border border-border-default bg-bg-surface p-5 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-mono font-bold text-text-primary uppercase tracking-wider flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  Automated SRE Verification Test Suite
                </h3>
                <span className="text-xs font-mono text-emerald-500 font-bold">
                  {verificationResults.filter((r) => r.passed).length} / {verificationResults.length} Assertions Passed
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
    </div>
  );
};
