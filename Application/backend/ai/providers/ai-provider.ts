export interface DiagnosticPromptPayload {
  systemPrompt: string;
  contextSummary: string;
  evidence: Array<Record<string, unknown>>;
  ruleOutputs: Array<Record<string, unknown>>;
}

export interface IAIProvider {
  name: string;
  diagnose(payload: DiagnosticPromptPayload): Promise<string>;
  generateRecoveryGuide(diagnosisId: string): Promise<string>;
  healthCheck(): Promise<boolean>;
}
