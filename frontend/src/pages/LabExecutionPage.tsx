import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLabStore } from '@/store/labStore';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  ShieldCheck,
  Terminal,
  Server,
  Layers,
} from 'lucide-react';

export const LabExecutionPage = () => {
  const { id } = useParams<{ id: string }>();
  const { labs, runProbeVerification, resetLabState } = useLabStore();
  const lab = labs.find((l) => l.id === id) || labs[0];

  const [isRunningVerification, setIsRunningVerification] = useState(false);

  const handleVerify = () => {
    setIsRunningVerification(true);
    setTimeout(() => {
      runProbeVerification(lab.id);
      setIsRunningVerification(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link to="/labs">
          <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Back to Lab Catalog
          </Button>
        </Link>
        <Badge
          variant={
            lab.status === 'VERIFIED' ? 'success' : lab.status === 'IN_PROGRESS' ? 'warning' : 'neutral'
          }
          size="md"
          pulse={lab.status === 'IN_PROGRESS'}
        >
          Status: {lab.status.replace('_', ' ')}
        </Badge>
      </div>

      {/* Scenario Title Banner */}
      <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-6 shadow-xl space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono text-blue-400 font-semibold uppercase tracking-wider">
          <Layers className="w-4 h-4" />
          {lab.category} • {lab.id}
        </div>
        <h1 className="text-xl md:text-2xl font-bold text-slate-100">{lab.title}</h1>
        <p className="text-xs text-slate-300 leading-relaxed">{lab.summary}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left (2 Cols): Problem Statement & Verification Probes */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                Problem Statement & Diagnostic Specs
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
                <div className="font-semibold text-slate-200">Observed Fault:</div>
                <p className="text-slate-300 leading-relaxed">{lab.problemStatement}</p>
              </div>

              <div className="space-y-2">
                <div className="font-semibold text-slate-200">Reported System Symptoms:</div>
                <div className="space-y-1.5">
                  {lab.symptoms.map((symptom, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2.5 bg-slate-900/60 rounded-lg border border-slate-800 text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                      <span>{symptom}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Verification Engine Probes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Automated Verification Engine Probes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {lab.verificationSteps.map((step) => (
                  <div
                    key={step.id}
                    className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                      step.passed
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center gap-3 text-xs font-medium">
                      <CheckCircle2
                        className={`w-4 h-4 ${step.passed ? 'text-emerald-400' : 'text-slate-600'}`}
                      />
                      <span>{step.label}</span>
                    </div>
                    <Badge variant={step.passed ? 'success' : 'neutral'} size="sm">
                      {step.passed ? 'PASSED' : 'PENDING'}
                    </Badge>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex items-center justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => resetLabState(lab.id)}
                  leftIcon={<RotateCcw className="w-4 h-4" />}
                >
                  Reset Lab State
                </Button>

                <Button
                  variant="primary"
                  size="md"
                  isLoading={isRunningVerification}
                  onClick={handleVerify}
                  leftIcon={<Play className="w-4 h-4" />}
                >
                  Execute Verification Probe
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right (1 Col): Architectural Topology */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Target Topology Node</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-200">Container Node</span>
                  <Badge variant="primary" size="sm">docker-compose</Badge>
                </div>
                <div className="space-y-1 text-slate-400 font-mono text-[11px]">
                  <div>Target: deployfix-db:5432</div>
                  <div>Driver: postgres:16-alpine</div>
                  <div>Network: deployfix-internal-net</div>
                </div>
              </div>

              <Link to="/logs" className="block">
                <Button variant="secondary" size="md" className="w-full" leftIcon={<Terminal className="w-4 h-4" />}>
                  Inspect Live Telemetry Logs
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
