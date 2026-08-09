export function calculateConfidence(evidenceCount: number, ruleMatches: number): number {
  if (evidenceCount === 0) return 0.2;
  const base = Math.min(0.5 + (ruleMatches * 0.25) + (evidenceCount * 0.05), 0.98);
  return Number(base.toFixed(2));
}
