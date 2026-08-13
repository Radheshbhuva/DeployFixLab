import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { labService } from '@/services/labService';
import { Lab, LabSession, VerificationResult } from '@/types/lab.types';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { LabStatusBadge } from './LabStatusBadge';
import { VerificationResultCard } from './VerificationResultCard';
import { ProgressStepper } from '@/components/ui/ProgressStepper';
import { DifficultyBadge } from '@/components/ui/DifficultyBadge';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { useToast } from '@/hooks/useToast';
import { ShieldCheck, ArrowLeft, Terminal as TerminalIcon, CheckCircle2, RotateCcw } from 'lucide-react';

export const LabExecutionPage: React.FC = () => {
  const { labId } = useParams<{ labId: string }>();
  const [lab, setLab] = useState<Lab | null>(null);
  const [session, setSession] = useState<LabSession | null>(null);
  const [verificationResults, setVerificationResults] = useState<VerificationResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);

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
        toast.success('Congratulations! All verification tests passed successfully.');
      } else {
        toast.error('Verification failed. Check the test results below.');
      }
    } catch {
      toast.error('Error running verification suite.');
    } finally {
      setIsVerifying(false);
    }
  };

  if (loading || !lab) {
    return <LoadingSpinner label="Provisioning lab environment container..." />;
  }

  const steps = [
    { label: 'Environment Setup', description: 'Container booted' },
    { label: 'Chaos Injection', description: 'Failure triggered' },
    { label: 'Troubleshooting', description: 'Investigate logs' },
    { label: 'Verification', description: 'Pass tests' },
  ];

  const currentStep = session?.status === 'VERIFIED' ? 3 : 2;

  return (
    <div className="space-y-6 pb-8">
      {/* Back button */}
      <button
        onClick={() => navigate('/labs')}
        className="inline-flex items-center gap-2 text-xs font-semibold text-text-secondary hover:text-text-primary transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Catalog
      </button>

      {/* Main Header Banner */}
      <div className="bg-bg-surface p-6 rounded-xl border border-border-default space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <DifficultyBadge difficulty={lab.difficulty} />
              {session && <LabStatusBadge status={session.status} />}
            </div>
            <h1 className="text-2xl font-bold text-text-primary">{lab.title}</h1>
            <p className="text-sm text-text-secondary mt-1">{lab.description}</p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="primary"
              size="lg"
              isLoading={isVerifying}
              onClick={handleRunVerification}
            >
              <ShieldCheck className="w-5 h-5 mr-2" />
              Run Verification Tests
            </Button>
          </div>
        </div>

        {/* Progress Stepper */}
        <ProgressStepper steps={steps} currentStep={currentStep} />
      </div>

      {/* Grid: Instructions & Interactive Terminal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Objectives & Setup Instructions */}
        <div className="space-y-6">
          <Card title="Lab Scenario Objectives">
            <ul className="space-y-2 mt-3">
              {lab.objectives.map((obj, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-text-secondary">
                  <CheckCircle2 className="w-4 h-4 text-brand-primary mt-0.5 flex-shrink-0" />
                  <span>{obj}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card title="Suggested Troubleshooting Commands">
            <p className="text-xs text-text-muted mb-3">
              Use these terminal commands to inspect logs and diagnose root cause:
            </p>
            <CodeBlock
              language="bash"
              title="Docker Container Inspection"
              code={`# Check container health and environment
docker compose ps
docker compose logs -f --tail=50 backend

# Test internal connection
docker exec -it deployfix-backend nc -zv postgres 5432`}
            />
          </Card>
        </div>

        {/* Interactive Verification Results Panel */}
        <div className="space-y-6">
          <Card title="Automated Test Suite Results">
            {verificationResults.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-border-default rounded-lg">
                <TerminalIcon className="w-8 h-8 text-text-muted mx-auto mb-2" />
                <p className="text-sm text-text-secondary font-medium">
                  No verification run executed yet.
                </p>
                <p className="text-xs text-text-muted mt-1 max-w-xs mx-auto">
                  Execute your recovery fixes in the terminal, then click &quot;Run Verification Tests&quot;.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {verificationResults.map((result, idx) => (
                  <VerificationResultCard key={idx} result={result} />
                ))}
              </div>
            )}
          </Card>

          {session?.status === 'VERIFIED' && (
            <div className="p-6 rounded-xl bg-status-success-dim/50 border border-status-success text-center space-y-3">
              <h3 className="text-lg font-bold text-status-success">Scenario Completed!</h3>
              <p className="text-xs text-text-secondary">
                You successfully diagnosed and recovered the production failure. Your score: 100%.
              </p>
              <Button variant="ghost" onClick={() => navigate('/labs')}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Return to Catalog
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
