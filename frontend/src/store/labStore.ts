import { create } from 'zustand';
import { Lab, LabSession, VerificationResult } from '@/types/lab.types';

interface LabState {
  activeLab: Lab | null;
  activeSession: LabSession | null;
  verificationResults: VerificationResult[];
  isInjecting: boolean;
  isVerifying: boolean;
  setActiveLab: (lab: Lab | null) => void;
  setActiveSession: (session: LabSession | null) => void;
  setVerificationResults: (results: VerificationResult[]) => void;
  setInjecting: (isInjecting: boolean) => void;
  setVerifying: (isVerifying: boolean) => void;
  clearLab: () => void;
}

export const useLabStore = create<LabState>((set) => ({
  activeLab: null,
  activeSession: null,
  verificationResults: [],
  isInjecting: false,
  isVerifying: false,
  setActiveLab: (activeLab) => set({ activeLab }),
  setActiveSession: (activeSession) => set({ activeSession }),
  setVerificationResults: (verificationResults) => set({ verificationResults }),
  setInjecting: (isInjecting) => set({ isInjecting }),
  setVerifying: (isVerifying) => set({ isVerifying }),
  clearLab: () =>
    set({
      activeLab: null,
      activeSession: null,
      verificationResults: [],
      isInjecting: false,
      isVerifying: false,
    }),
}));
