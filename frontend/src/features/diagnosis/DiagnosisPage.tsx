import React, { useState } from 'react';
import { SourceCard } from './SourceCard';
import { DiagnosisOutputCard } from './DiagnosisOutputCard';
import { useDiagnosisStore } from '@/store/diagnosisStore';
import { diagnosisService } from '@/services/diagnosisService';
import { EvidenceSource, EvidenceSourceType } from '@/types/diagnosis.types';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useToast } from '@/hooks/useToast';
import { Brain, Plus, Sparkles, RotateCcw } from 'lucide-react';

const DEFAULT_SOURCES: EvidenceSource[] = [
  { id: '1', type: 'DEPLOYMENT_LOG', label: 'Deployment & Runtime Logs', value: '2026-08-13 10:14:02 [ERROR] connect ECONNREFUSED 127.0.0.1:5432 at TCPConnectWrap.afterConnect\n2026-08-13 10:14:02 [FATAL] Failed to initialize Prisma database client', isRequired: true },
  { id: '2', type: 'DOCKER_COMPOSE', label: 'docker-compose.yml', value: 'version: "3.8"\nservices:\n  backend:\n    build: .\n    environment:\n      - DATABASE_URL=postgresql://user:pass@localhost:5432/mydb\n  postgres:\n    image: postgres:15\n    ports:\n      - "5432:5432"', isRequired: false },
];

export const DiagnosisPage: React.FC = () => {
  const sources = useDiagnosisStore((s) => s.sources.length > 0 ? s.sources : DEFAULT_SOURCES);
  const isAnalyzing = useDiagnosisStore((s) => s.isAnalyzing);
  const currentDiagnosis = useDiagnosisStore((s) => s.currentDiagnosis);
  const addSource = useDiagnosisStore((s) => s.addSource);
  const removeSource = useDiagnosisStore((s) => s.removeSource);
  const updateSource = useDiagnosisStore((s) => s.updateSource);
  const setAnalyzing = useDiagnosisStore((s) => s.setAnalyzing);
  const setDiagnosis = useDiagnosisStore((s) => s.setDiagnosis);
  const clearDiagnosis = useDiagnosisStore((s) => s.clearDiagnosis);

  const [selectedSourceType, setSelectedSourceType] = useState<EvidenceSourceType>('GITHUB_URL');
  const toast = useToast();

  const handleAddSource = () => {
    const labels: Record<EvidenceSourceType, string> = {
      GITHUB_URL: 'GitHub Repository URL',
      PRODUCTION_URL: 'Production Web App URL',
      DOCKERFILE: 'Dockerfile Content',
      DOCKER_COMPOSE: 'docker-compose.yml',
      ENV_FILE: '.env Configuration',
      LOG_TEXT: 'Raw Log Output',
      CONFIG_FILE: 'Nginx / Service Config',
      DEPLOYMENT_LOG: 'CI/CD Deployment Log',
      FREE_TEXT: 'Free-text Description',
    };

    addSource({
      id: Date.now().toString(),
      type: selectedSourceType,
      label: labels[selectedSourceType] || selectedSourceType,
      value: '',
      isRequired: false,
    });
  };

  const handleRunDiagnosis = async () => {
    const hasValue = sources.some((s) => s.value.trim().length > 0);
    if (!hasValue) {
      toast.error('Please paste content into at least one evidence source.');
      return;
    }

    setAnalyzing(true);
    try {
      const result = await diagnosisService.submitDiagnosis({ sources });
      setDiagnosis(result);
      toast.success('AI Diagnosis Report generated successfully!');
    } catch {
      toast.error('Failed to generate AI diagnosis report.');
      setAnalyzing(false);
    }
  };

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
            Supply deployment logs, Docker configs, or repository links to synthesize root cause analysis and step-by-step recovery plans.
          </p>
        </div>

        {currentDiagnosis && (
          <Button variant="ghost" onClick={clearDiagnosis}>
            <RotateCcw className="w-4 h-4 mr-2" />
            New Diagnosis
          </Button>
        )}
      </div>

      {isAnalyzing ? (
        <LoadingSpinner fullScreen label="AI Engine analyzing telemetry sources & synthesizing root cause..." />
      ) : currentDiagnosis ? (
        <DiagnosisOutputCard diagnosis={currentDiagnosis} />
      ) : (
        <div className="space-y-6">
          {/* Sources Header & Controls */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <h2 className="text-lg font-bold text-text-primary">
              Evidence Sources ({sources.length})
            </h2>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <select
                value={selectedSourceType}
                aria-label="Select evidence source type to add"
                onChange={(e) => setSelectedSourceType(e.target.value as EvidenceSourceType)}
                className="bg-bg-primary border border-border-default rounded-md px-3 py-2 text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary"
              >
                <option value="GITHUB_URL">GitHub Repository URL</option>
                <option value="PRODUCTION_URL">Production URL</option>
                <option value="DOCKERFILE">Dockerfile</option>
                <option value="DOCKER_COMPOSE">docker-compose.yml</option>
                <option value="ENV_FILE">Environment (.env)</option>
                <option value="LOG_TEXT">Raw Log Output</option>
                <option value="CONFIG_FILE">Nginx / Service Config</option>
              </select>

              <Button variant="ghost" size="sm" onClick={handleAddSource}>
                <Plus className="w-4 h-4 mr-1" />
                Add Source
              </Button>
            </div>
          </div>

          {/* Sources List Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sources.map((source) => (
              <SourceCard
                key={source.id}
                source={source}
                onUpdate={updateSource}
                onRemove={removeSource}
              />
            ))}
          </div>

          {/* Submit Action Bar */}
          <div className="pt-4 flex justify-end">
            <Button
              variant="primary"
              size="lg"
              onClick={handleRunDiagnosis}
              className="px-8 shadow-lg shadow-blue-900/30"
            >
              <Sparkles className="w-5 h-5 mr-2 text-yellow-300" />
              Synthesize AI Root Cause Analysis
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
