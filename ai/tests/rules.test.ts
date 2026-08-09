import { evaluateConnectionRefused } from '../rules/database/connection-refused.rule';

describe('RulesEngine', () => {
  it('should match ECONNREFUSED rule when backend logs contain connection error', () => {
    const res = evaluateConnectionRefused('Prisma ECONNREFUSED 127.0.0.1:5432', 'healthy');
    expect(res.matched).toBe(true);
    expect(res.ruleId).toBe('RULE-DB-001');
  });
});
