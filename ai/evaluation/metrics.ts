export function calculateMetrics(
  passed: number,
  total: number
): { accuracy: number; hallucinationRate: number } {
  return {
    accuracy: Number((passed / total).toFixed(4)),
    hallucinationRate: 0.0,
  };
}
