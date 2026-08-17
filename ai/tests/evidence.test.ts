import { describe, it, expect } from 'vitest';
import { parseLogs } from '../evidence/log-parser';

describe('EvidenceEngine', () => {
  it('should parse ECONNREFUSED error logs into structured evidence', () => {
    const evidence = parseLogs('Error: ECONNREFUSED 127.0.0.1:5432', 'backend');
    expect(evidence.length).toBe(1);
    expect(evidence[0]?.errorCode).toBe('ECONNREFUSED');
  });
});
