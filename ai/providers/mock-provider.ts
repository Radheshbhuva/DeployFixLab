import { IAIProvider, DiagnosticPromptPayload } from './ai-provider';

export class MockProvider implements IAIProvider {
  name = 'MockProvider';

  async diagnose(_payload: DiagnosticPromptPayload): Promise<string> {
    return JSON.stringify({
      problem: 'Mock Diagnosis Problem',
      rootCause: 'Mock Root Cause',
      confidence: 0.99,
      severity: 'high',
      evidence: ['Mock evidence item 1', 'Mock evidence item 2'],
      recommendedActions: ['Action 1', 'Action 2'],
      requiresUserAction: true,
      autoRemediationAllowed: false,
    });
  }

  async generateRecoveryGuide(_diagnosisId: string): Promise<string> {
    return 'Mock Recovery Guide';
  }

  async healthCheck(): Promise<boolean> {
    return true;
  }
}
