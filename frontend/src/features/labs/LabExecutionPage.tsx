import React, { useEffect, useState, useRef, useMemo } from 'react';
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
  Copy,
  Check,
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
} from 'lucide-react';

interface TerminalLine {
  type: 'input' | 'output' | 'error' | 'success' | 'system';
  text: string;
  timestamp?: string;
}

export const LabExecutionPage: React.FC = () => {
  const { labId } = useParams<{ labId: string }>();
  const [lab, setLab] = useState<Lab | null>(null);
  const [session, setSession] = useState<LabSession | null>(null);
  const [verificationResults, setVerificationResults] = useState<VerificationResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);
  const [activeTab, setActiveTab] = useState<'terminal' | 'logs' | 'telemetry' | 'config'>('terminal');

  // Terminal State
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [, setHistoryIndex] = useState<number>(-1);
  const [terminalLines, setTerminalLines] = useState<TerminalLine[]>([
    { type: 'system', text: 'Initializing DeployFix SRE Sandbox Environment...' },
    { type: 'system', text: 'Sandbox isolated in Docker bridge network: deployfix-chaos-net (172.28.0.0/16)' },
    { type: 'error', text: 'ALERT: Synthetic healthcheck probe reported 503 SERVICE UNAVAILABLE.' },
    { type: 'output', text: 'Type "help" or click quick diagnostic shortcuts below to begin triage.' },
  ]);

  // Topology & Patch State
  const [topologyNodes, setTopologyNodes] = useState<TopologyNode[]>([]);
  const [patchApplied, setPatchApplied] = useState(false);
  const [checkedObjectives, setCheckedObjectives] = useState<Record<number, boolean>>({});
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Live Logs State
  const [logFilterLevel, setLogFilterLevel] = useState<'ALL' | 'ERROR' | 'WARN' | 'INFO'>('ALL');
  const [logFilterSearch, setLogFilterSearch] = useState('');
  const [isStreamingLogs, setIsStreamingLogs] = useState(true);

  // Config Inspector State
  const [selectedConfigIndex, setSelectedConfigIndex] = useState(0);

  const terminalEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const toast = useToast();

  // Load Lab and Initialize Sandbox
  useEffect(() => {
    const initLabSession = async () => {
      if (!labId) return;
      try {
        const labData = await labService.getLabById(labId);
        setLab(labData);
        setTopologyNodes(labData.topology || []);

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

  // Incident Elapsed Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Auto-scroll terminal
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalLines]);

  const formattedTimer = useMemo(() => {
    const mins = Math.floor(elapsedSeconds / 60);
    const secs = elapsedSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, [elapsedSeconds]);

  // Mark Objective Done Helper
  const markObjective = (index: number) => {
    setCheckedObjectives((prev) => ({ ...prev, [index]: true }));
  };

  // SRE Command Evaluator
  const executeCommand = (rawCmd: string) => {
    const cmd = rawCmd.trim();
    if (!cmd) return;

    // Record in command history
    setCommandHistory((prev) => [...prev, cmd]);
    setHistoryIndex(-1);

    const newLines: TerminalLine[] = [...terminalLines, { type: 'input', text: `$ ${cmd}` }];
    const lower = cmd.toLowerCase();

    // Command Handlers
    if (lower === 'clear' || lower === 'cls') {
      setTerminalLines([]);
      return;
    }

    if (lower === 'help' || lower === 'man') {
      newLines.push({
        type: 'output',
        text: `DeployFix SRE Sandbox Tooling (v2.0):
  docker compose ps          List running container health states & port bindings
  docker compose logs [svc]  Tail container stdout/stderr logs (-f, --tail=N)
  docker compose restart     Gracefully restart target container services
  curl [url]                 Execute HTTP probes with status & response headers (-I, -v)
  cat [file]                 Inspect configuration files (docker-compose.yml, .env, etc.)
  netstat -tuln              Inspect listening TCP/UDP port tables
  nslookup [host]            Test internal DNS resolution against CoreDNS
  env | printenv             Dump active container environment variables
  top | free -m              Inspect live CPU and memory allocation metrics
  apply-patch | fix          Apply recommended configuration fix and restart
  clear                      Clear terminal display
  history                    Display recently executed commands`,
      });
    } else if (lower.includes('docker compose ps') || lower.includes('docker ps')) {
      markObjective(0);
      const gwStatus = patchApplied ? 'Up (healthy)' : 'Up (unhealthy)';
      const redisStatus = patchApplied || lab?.id !== 'lab-03' ? 'Up (healthy)' : 'Restarting (OOMKilled)';
      newLines.push({
        type: 'output',
        text: `NAME                  IMAGE               COMMAND                  SERVICE             STATUS
deployfix-gateway     node:20-alpine      "npm run start"          gateway             ${gwStatus}
deployfix-postgres    postgres:16-alpine  "docker-entrypoint.s…"   postgres            Up (healthy)
deployfix-redis       redis:7-alpine      "docker-entrypoint.s…"   redis               ${redisStatus}`,
      });
    } else if (lower.includes('docker compose logs') || lower.includes('docker logs') || lower.includes('logs')) {
      markObjective(0);
      if (patchApplied) {
        newLines.push({
          type: 'success',
          text: `[deployfix-gateway] INFO 2026-08-20T08:35:00Z: Database connection verified on postgres:5432 (Pool: 10 connections)
[deployfix-gateway] INFO 2026-08-20T08:35:01Z: HTTP server listening on port 5000 (SLA nominal 100%)
[deployfix-postgres] LOG: connection received: host=172.28.0.2 port=48922
[deployfix-postgres] LOG: replication connection authorized: user=sre_user`,
        });
      } else {
        newLines.push({
          type: 'error',
          text: `[deployfix-gateway] ERROR 2026-08-20T08:30:12Z: Failed to connect to database at 127.0.0.1:5432
[deployfix-gateway] Error: connect ECONNREFUSED 127.0.0.1:5432
[deployfix-gateway] at TCPConnectWrap.afterConnect [as oncomplete] (node:net:1605:16)
[deployfix-gateway] Retrying in 5000ms... (attempt 4/10)`,
        });
      }
    } else if (lower.includes('curl') || lower.includes('health')) {
      markObjective(0);
      if (patchApplied) {
        newLines.push({
          type: 'success',
          text: `HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Date: ${new Date().toUTCString()}
Connection: keep-alive
Keep-Alive: timeout=5

{"status":"healthy","database":"connected","redis":"ready","latencyMs":8,"uptimeSeconds":182}`,
        });
      } else {
        newLines.push({
          type: 'error',
          text: `HTTP/1.1 503 Service Unavailable
Content-Type: application/json; charset=utf-8
Date: ${new Date().toUTCString()}
Connection: close

{"status":"degraded","error":"Database connection refused on 127.0.0.1:5432","activeConnections":0}`,
        });
      }
    } else if (lower.includes('cat') && (lower.includes('docker-compose') || lower.includes('compose'))) {
      markObjective(1);
      newLines.push({
        type: 'output',
        text: lab?.configFiles?.[0]?.content || `version: '3.8'\nservices:\n  gateway:\n    image: node:20-alpine\n    environment:\n      - DATABASE_URL=postgresql://sre_user:secret@127.0.0.1:5432/deployfix`,
      });
    } else if (lower.includes('cat') && lower.includes('.env')) {
      markObjective(1);
      newLines.push({
        type: 'output',
        text: patchApplied
          ? `PORT=5000\nDATABASE_URL=postgresql://sre_user:secret@postgres:5432/deployfix\nREDIS_URL=redis://redis:6379\nNODE_ENV=production`
          : `PORT=5000\nDATABASE_URL=postgresql://sre_user:secret@127.0.0.1:5432/deployfix\nREDIS_URL=redis://redis:6379\nNODE_ENV=production`,
      });
    } else if (lower.includes('cat') && lower.includes('resolv.conf')) {
      markObjective(1);
      newLines.push({
        type: 'output',
        text: patchApplied
          ? `nameserver 172.28.0.1\noptions ndots:1\nsearch deployfix.internal`
          : `nameserver 172.28.0.1\noptions ndots:5 timeout:2\nsearch deployfix.internal svc.cluster.local`,
      });
    } else if (lower.includes('netstat') || lower.includes('ss')) {
      newLines.push({
        type: 'output',
        text: `Active Internet connections (only servers)
Proto Recv-Q Send-Q Local Address           Foreign Address         State       PID/Program name    
tcp        0      0 0.0.0.0:5000            0.0.0.0:*               LISTEN      14/node             
tcp        0      0 0.0.0.0:5432            0.0.0.0:*               LISTEN      28/postgres         
tcp        0      0 0.0.0.0:6379            0.0.0.0:*               LISTEN      42/redis-server     `,
      });
    } else if (lower.includes('nslookup') || lower.includes('dig') || lower.includes('ping')) {
      markObjective(1);
      newLines.push({
        type: 'success',
        text: `Server:         172.28.0.1
Address:        172.28.0.1#53

Name:   postgres.deployfix-chaos-net
Address: 172.28.0.3 (0.42ms response)`,
      });
    } else if (lower.includes('env') || lower.includes('printenv')) {
      newLines.push({
        type: 'output',
        text: `HOSTNAME=deployfix-gateway\nPORT=5000\nDATABASE_URL=${patchApplied ? 'postgresql://sre_user:secret@postgres:5432/deployfix' : 'postgresql://sre_user:secret@127.0.0.1:5432/deployfix'}\nREDIS_HOST=redis\nPATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin`,
      });
    } else if (lower.includes('free') || lower.includes('top') || lower.includes('htop') || lower.includes('ps aux')) {
      newLines.push({
        type: 'output',
        text: `               total        used        free      shared  buff/cache   available
Mem:            2048         384        1420          12         244        1664
Swap:           1024           0        1024`,
      });
    } else if (
      lower.includes('fix') ||
      lower.includes('patch') ||
      lower.includes('apply') ||
      lower.includes('sed') ||
      lower.includes('echo')
    ) {
      setPatchApplied(true);
      markObjective(1);
      markObjective(2);

      // Update topology nodes to HEALTHY
      setTopologyNodes((prev) =>
        prev.map((node) => ({
          ...node,
          status: 'HEALTHY',
        }))
      );

      newLines.push({
        type: 'success',
        text: `✓ Applied configuration patch to container environment.
- DATABASE_URL="postgresql://sre_user:secret@127.0.0.1:5432/deployfix"
+ DATABASE_URL="postgresql://sre_user:secret@postgres:5432/deployfix"

Executing: docker compose restart gateway...
✓ Container deployfix-gateway restarted successfully.
✓ Healthcheck probe responded: HTTP 200 OK (8ms). All nodes nominal.`,
      });

      toast.success('Configuration patch applied! Container service restarted.');
    } else if (lower.includes('restart')) {
      markObjective(2);
      newLines.push({
        type: 'success',
        text: `Restarting target container services...
✓ deployfix-gateway restarted.
✓ Handshake status: ${patchApplied ? 'HEALTHY (HTTP 200)' : 'UNHEALTHY (ECONNREFUSED)'}`,
      });
    } else if (lower === 'history') {
      newLines.push({
        type: 'output',
        text: commandHistory.map((c, i) => `  ${i + 1}  ${c}`).join('\n'),
      });
    } else {
      newLines.push({
        type: 'output',
        text: `bash: ${cmd}: command executed in sandbox environment (exit code: 0)`,
      });
    }

    setTerminalLines(newLines);
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
    setTerminalLines([
      { type: 'system', text: 'Resetting DeployFix SRE Sandbox Environment...' },
      { type: 'system', text: 'Docker containers rebooted into initial faulty state.' },
      { type: 'error', text: 'ALERT: Synthetic healthcheck probe reported 503 SERVICE UNAVAILABLE.' },
      { type: 'output', text: 'Type "help" or click quick diagnostic shortcuts below to begin triage.' },
    ]);
    toast.success('Sandbox environment reset to initial failure state.');
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
      {/* Top Header & SRE Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-bg-surface p-4 rounded-2xl border border-border-default shadow-sm">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/labs')}
            className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-text-secondary hover:text-brand-primary transition-colors px-2.5 py-1.5 rounded-lg hover:bg-bg-raised"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Catalog</span>
          </button>

          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="px-2.5 py-1 rounded-lg bg-bg-raised border border-border-default text-text-secondary">
              Session: <span className="text-brand-primary font-bold">{session?.sessionId}</span>
            </span>
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-bg-raised border border-border-default text-text-secondary">
              <Clock className="w-3.5 h-3.5 text-text-muted" />
              <span>{formattedTimer}</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          <button
            type="button"
            onClick={handleResetSandbox}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-bg-raised hover:bg-bg-surface border border-border-default text-text-secondary hover:text-text-primary text-xs font-semibold transition-colors"
            title="Reset sandbox to initial failure state"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Sandbox</span>
          </button>

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

      {/* Scenario Title Banner */}
      <div className="rounded-2xl border border-border-default bg-bg-surface p-5 backdrop-blur-xl shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="text-[11px] font-mono font-extrabold px-2 py-0.5 rounded bg-bg-raised border border-border-default text-text-primary">
              {lab.code}
            </span>
            <span
              className={`text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${getDifficultyColor(
                lab.difficulty
              )}`}
            >
              {lab.difficulty}
            </span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-brand-primary/10 border border-brand-primary/30 text-brand-primary">
              {lab.category}
            </span>
            <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400">
              {lab.severity.replace('_', ' ')}
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-extrabold text-text-primary">{lab.title}</h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-1 max-w-3xl leading-relaxed font-sans">
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
        {/* Left Column: Playbook, Topology & Objectives (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Live Infrastructure Topology Card */}
          <div className="rounded-2xl border border-border-default bg-bg-surface p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-text-secondary flex items-center gap-2">
                <Radio className="w-4 h-4 text-brand-primary animate-pulse" />
                Live Container Topology
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-bg-raised text-text-muted">
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

          {/* Objectives Progress Card */}
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

          {/* Failure Synopsis & Hints Card */}
          <div className="rounded-2xl border border-border-default bg-bg-surface p-4 shadow-sm space-y-3">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-text-secondary flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-500" />
              Failure Vector Synopsis
            </h2>
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-xs font-mono leading-relaxed">
              {lab.faultSummary}
            </div>

            <div className="space-y-2 pt-1">
              <div className="text-[11px] font-mono text-text-muted font-bold uppercase">
                Diagnostic Hints:
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

          {/* Diagnostic Shortcuts */}
          <div className="rounded-2xl border border-border-default bg-bg-surface p-4 shadow-sm">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-text-secondary mb-2.5">
              Quick Diagnostic Scripts
            </div>
            <div className="space-y-1.5 font-mono text-xs">
              {(lab.shortcuts || [
                { command: 'docker compose ps', description: 'List active container health statuses', category: 'inspect' },
                { command: 'docker compose logs --tail=30 gateway', description: 'Stream latest error logs', category: 'log' },
                { command: 'curl -I http://localhost:5000/health', description: 'Probe HTTP health endpoint', category: 'network' },
                { command: 'apply-patch', description: 'Apply recommended fix', category: 'fix' },
              ]).map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 rounded-lg bg-bg-raised border border-border-default text-text-secondary hover:border-brand-primary/50"
                >
                  <span className="text-brand-primary truncate text-[11px]">$ {item.command}</span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleCopyCmd(item.command)}
                      className="p-1 text-text-muted hover:text-text-primary"
                      title="Copy command"
                    >
                      {copiedCmd === item.command ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => executeCommand(item.command)}
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

        {/* Right Column: Multi-Tab Interactive SRE Console (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Console Window */}
          <div className="rounded-2xl border border-terminal-border bg-terminal-bg shadow-2xl overflow-hidden flex flex-col h-[560px]">
            {/* Console Header Tabs */}
            <div className="bg-bg-raised px-4 py-2.5 border-b border-border-default flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="ml-2 text-xs font-mono text-text-muted hidden sm:inline">
                  sandbox@deployfix:~ ({lab.code})
                </span>
              </div>

              {/* Console Tabs */}
              <div className="flex items-center gap-1 bg-bg-surface p-0.5 rounded-xl border border-border-default text-[11px] font-mono">
                <button
                  type="button"
                  onClick={() => setActiveTab('terminal')}
                  className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
                    activeTab === 'terminal'
                      ? 'bg-brand-primary text-white font-bold shadow-sm'
                      : 'text-text-secondary hover:text-text-primary'
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
                      : 'text-text-secondary hover:text-text-primary'
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
                      : 'text-text-secondary hover:text-text-primary'
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
                      : 'text-text-secondary hover:text-text-primary'
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
                  height="h-full"
                  context={{
                    labId: lab.id,
                    labTitle: lab.title,
                    patchApplied,
                    files: lab.configFiles?.reduce((acc, f) => {
                      acc[f.filename] = f.content;
                      return acc;
                    }, {} as Record<string, string>),
                    onPatchApplied: () => {
                      setPatchApplied(true);
                      markObjective(1);
                      markObjective(2);
                      setTopologyNodes((prev) =>
                        prev.map((node) => ({
                          ...node,
                          status: 'HEALTHY',
                        }))
                      );
                      toast.success('Configuration patch applied! Target container restarted.');
                    },
                    onRunVerification: handleRunVerification,
                  }}
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
              <div className="flex-1 flex flex-col justify-between overflow-hidden">
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
              <div className="flex-1 p-5 overflow-y-auto space-y-5 text-slate-100">
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
              <div className="flex-1 flex flex-col justify-between overflow-hidden">
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
                    onClick={() => {
                      executeCommand('apply-patch');
                    }}
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
                  <ShieldCheck className="w-4 h-4 text-status-success" />
                  Automated SRE Verification Test Suite
                </h3>
                <span className="text-xs font-mono text-status-success font-bold">
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

