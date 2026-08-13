import { create } from 'zustand';
import { EvidenceSource, DiagnosisOutput } from '@/types/diagnosis.types';

interface DiagnosisState {
  sources: EvidenceSource[];
  isAnalyzing: boolean;
  currentDiagnosis: DiagnosisOutput | null;
  diagnosisHistory: DiagnosisOutput[];
  error: string | null;
  addSource: (source: EvidenceSource) => void;
  removeSource: (id: string) => void;
  updateSource: (id: string, value: string) => void;
  setAnalyzing: (isAnalyzing: boolean) => void;
  setDiagnosis: (output: DiagnosisOutput | null) => void;
  clearDiagnosis: () => void;
  setError: (msg: string | null) => void;
}

export const useDiagnosisStore = create<DiagnosisState>((set) => ({
  sources: [],
  isAnalyzing: false,
  currentDiagnosis: null,
  diagnosisHistory: [],
  error: null,
  addSource: (source) =>
    set((state) => ({ sources: [...state.sources, source] })),
  removeSource: (id) =>
    set((state) => ({ sources: state.sources.filter((s) => s.id !== id) })),
  updateSource: (id, value) =>
    set((state) => ({
      sources: state.sources.map((s) => (s.id === id ? { ...s, value } : s)),
    })),
  setAnalyzing: (isAnalyzing) => set({ isAnalyzing }),
  setDiagnosis: (currentDiagnosis) => set({ currentDiagnosis, isAnalyzing: false }),
  clearDiagnosis: () => set({ currentDiagnosis: null, error: null }),
  setError: (error) => set({ error, isAnalyzing: false }),
}));
