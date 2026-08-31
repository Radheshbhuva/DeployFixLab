export function analyzeContainerStatus(
  containerName: string,
  state: string,
  exitCode: number
): { containerName: string; healthy: boolean; issue?: string } {
  const healthy = state === 'running' && exitCode === 0;
  return {
    containerName,
    healthy,
    issue: healthy ? undefined : `Container in state '${state}' with exit code ${exitCode}`,
  };
}
