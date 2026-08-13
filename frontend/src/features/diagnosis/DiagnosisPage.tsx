import React from 'react';
import { ProjectContextPanel } from './ProjectContextPanel';
import { DiagnosisOutputCard } from './DiagnosisOutputCard';
import { useDiagnosisStore } from '@/store/diagnosisStore';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/Button';
import { Brain, RotateCcw } from 'lucide-react';

export const DiagnosisPage: React.FC = () => {
  const isAnalyzing = useDiagnosisStore((s) => s.isAnalyzing);
  const currentDiagnosis = useDiagnosisStore((s) => s.currentDiagnosis);
  const clearDiagnosis = useDiagnosisStore((s) => s.clearDiagnosis);

  return (
    <div className="space-y-6 pb-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gradient-to-r from-blue-950/40 via-bg-surface to-bg-raised p-6 rounded-2xl border border-border-default">
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

        {currentDiagnosis && (
          <Button variant="ghost" onClick={clearDiagnosis}>
            <RotateCcw className="w-4 h-4 mr-2" />
            New Diagnosis Session
          </Button>
        )}
      </div>

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
