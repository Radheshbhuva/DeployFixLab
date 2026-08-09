import { runDiagnosis } from '../diagnosis/diagnosis-engine';

describe('DiagnosisEngine', () => {
  it('should generate structured diagnosis output with confidence score', async () => {
    const output = await runDiagnosis(
      'Database connection failure',
      'DATABASE_URL points to localhost',
      ['Prisma ECONNREFUSED'],
      ['Update DATABASE_URL to postgres']
    );
    expect(output.severity).toBe('high');
    expect(output.autoRemediationAllowed).toBe(false);
  });
});
