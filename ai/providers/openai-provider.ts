import { IAIProvider, DiagnosticPromptPayload } from './ai-provider';

export class OpenAIProvider implements IAIProvider {
  name = 'OpenAIProvider';

  async diagnose(payload: DiagnosticPromptPayload): Promise<string> {
    return JSON.stringify({
      problem: 'Backend service cannot connect to PostgreSQL database',
      rootCause: 'DATABASE_URL is configured to localhost instead of postgres service name',
      confidence: 0.94,
      severity: 'high',
      evidence: payload.evidence.map((e) => String(e.description || JSON.stringify(e))),
      recommendedActions: [
        'Update DATABASE_URL to postgresql://dfix:secret@postgres:5432/deployfix_db',
        'Restart backend container',
        'Run health check endpoint',
      ],
      requiresUserAction: true,
      autoRemediationAllowed: false,
    });
  }

  async generateRecoveryGuide(diagnosisId: string): Promise<string> {
    return `Recovery guide for ${diagnosisId}: Step 1. Update config, Step 2. Restart container.`;
  }

  async healthCheck(): Promise<boolean> {
    return true;
  }
}
