import React, { useState } from 'react';
import { ProjectContextPanel } from './ProjectContextPanel';
import { DiagnosisOutputCard } from './DiagnosisOutputCard';
import { useDiagnosisStore } from '@/store/diagnosisStore';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/Button';
import { SreTerminal } from '@/components/terminal/SreTerminal';
import { Brain, RotateCcw, Terminal, ChevronDown, ChevronUp } from 'lucide-react';

export const DiagnosisPage: React.FC = () => {
  const isAnalyzing = useDiagnosisStore((s) => s.isAnalyzing);
  const currentDiagnosis = useDiagnosisStore((s) => s.currentDiagnosis);
  const clearDiagnosis = useDiagnosisStore((s) => s.clearDiagnosis);
  const [showTerminal, setShowTerminal] = useState(false);

  return (
    <div className="space-y-6 pb-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gradient-to-r from-brand-primary/5 via-bg-surface to-bg-raised p-6 rounded-2xl border border-border-default">
        <div>
          <div className="flex items-center gap-2">
            <Brain className="w-6 h-6 text-brand-primary" />
            <h1 className="text-2xl font-bold text-text-primary">
              AI Evidence-Based Diagnosis Engine
            </h1>
          </div>
          <p className="text-sm text-text-secondary mt-1 max-w-xl">
            Correlates evidence across Website URL, File Uploads, GitHub, and Deployment Platform to synthesize root cause analysis and step-by-step recovery plans.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={showTerminal ? 'primary' : 'ghost'}
            onClick={() => setShowTerminal(!showTerminal)}
            className="text-xs"
          >
            <Terminal className="w-4 h-4 mr-1.5" />
            <span>{showTerminal ? 'Hide Terminal' : 'Diagnostic Terminal'}</span>
            {showTerminal ? <ChevronUp className="w-3.5 h-3.5 ml-1" /> : <ChevronDown className="w-3.5 h-3.5 ml-1" />}
          </Button>

          {currentDiagnosis && (
            <Button variant="ghost" onClick={clearDiagnosis}>
              <RotateCcw className="w-4 h-4 mr-2" />
              New Diagnosis Session
            </Button>
          )}
        </div>
      </div>

      {/* Interactive SRE Diagnostic Terminal */}
      {showTerminal && (
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-text-secondary flex items-center gap-1.5">
              <Terminal className="w-4 h-4 text-brand-primary" />
              Live Diagnostic Probe Console
            </h2>
            <span className="text-[11px] font-mono text-text-muted">
              Execute live probes, curl tests, and network traces
            </span>
          </div>

          <SreTerminal
            title="dfix-diagnostics@sre-probe (Live Verification Runner)"
            height="h-[300px]"
            quickCommands={[
              { label: 'curl /health', cmd: 'curl http://localhost:5000/health' },
              { label: 'nslookup host', cmd: 'nslookup postgres' },
              { label: 'netstat -tuln', cmd: 'netstat -tuln' },
              { label: 'docker compose ps', cmd: 'docker compose ps' },
              { label: 'inspect logs', cmd: 'docker compose logs gateway' },
              { label: 'help', cmd: 'help' },
            ]}
          />
        </div>
      )}

      {isAnalyzing ? (
        <LoadingSpinner fullScreen label="Correlating context sources & synthesizing root cause analysis..." />
      ) : currentDiagnosis ? (
        <DiagnosisOutputCard diagnosis={currentDiagnosis} />
      ) : (
        <ProjectContextPanel />
      )}
    </div>
  );
};
