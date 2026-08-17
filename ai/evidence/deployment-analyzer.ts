export function analyzeDeployment(
  websiteUrl: string,
  status: number,
  _headers: Record<string, string>
): { websiteUrl: string; reachable: boolean; tlsValid: boolean } {
  return {
    websiteUrl,
    reachable: status >= 200 && status < 400,
    tlsValid: websiteUrl.startsWith('https://'),
  };
}
