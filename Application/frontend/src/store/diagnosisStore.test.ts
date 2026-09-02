import { describe, it, expect, beforeEach } from 'vitest';
import { useDiagnosisStore, computeCompleteness } from './diagnosisStore';

describe('useDiagnosisStore & computeCompleteness', () => {
  beforeEach(() => {
    useDiagnosisStore.getState().clearAllSources();
  });

  it('disallows running diagnosis when 0 of 3 sources are connected', () => {
    const completeness = computeCompleteness({
      website: { connected: false },
      uploads: { connected: false, files: [], totalEvidenceCount: 0 },
      github: { connected: false },
    });

    expect(completeness.canRunDiagnosis).toBe(false);
    expect(completeness.score).toBe(0);
    expect(completeness.maxConfidence).toBe(0);
  });

  it('allows running diagnosis when ONLY Website URL is connected (Option 1 of 3)', () => {
    const completeness = computeCompleteness({
      website: { connected: true, url: 'https://example.com' },
      uploads: { connected: false, files: [], totalEvidenceCount: 0 },
      github: { connected: false },
    });

    expect(completeness.canRunDiagnosis).toBe(true);
    expect(completeness.sourceContributions.website).toBe(30);
    expect(completeness.score).toBe(30);
  });

  it('allows running diagnosis when Website URL is DISCONNECTED and ONLY File Upload is connected (Option 2 of 3)', () => {
    const completeness = computeCompleteness({
      website: { connected: false },
      uploads: {
        connected: true,
        files: [{ id: 'f-1', name: 'Dockerfile', type: 'dockerfile', sizeBytes: 500, status: 'complete', evidenceCount: 2 }],
        totalEvidenceCount: 2,
      },
      github: { connected: false },
    });

    expect(completeness.canRunDiagnosis).toBe(true);
    expect(completeness.sourceContributions.website).toBe(0);
    expect(completeness.sourceContributions.uploads).toBeGreaterThan(0);
    expect(completeness.score).toBeGreaterThanOrEqual(15);
  });

  it('allows running diagnosis when ONLY GitHub Repository is connected (Option 3 of 3)', () => {
    const completeness = computeCompleteness({
      website: { connected: false },
      uploads: { connected: false, files: [], totalEvidenceCount: 0 },
      github: { connected: true, repoOwner: 'org', repoName: 'app', branch: 'main' },
    });

    expect(completeness.canRunDiagnosis).toBe(true);
    expect(completeness.sourceContributions.github).toBe(35);
    expect(completeness.score).toBe(35);
  });

  it('supports connecting and disconnecting Website URL in store', () => {
    const store = useDiagnosisStore.getState();
    store.connectWebsite('https://staging-api.deployfix.io');

    expect(useDiagnosisStore.getState().projectContext.sources.website.connected).toBe(true);
    expect(useDiagnosisStore.getState().projectContext.sources.website.url).toBe('https://staging-api.deployfix.io');
    expect(useDiagnosisStore.getState().projectContext.completeness.canRunDiagnosis).toBe(true);

    // Disconnect website
    useDiagnosisStore.getState().disconnectWebsite();
    expect(useDiagnosisStore.getState().projectContext.sources.website.connected).toBe(false);
    expect(useDiagnosisStore.getState().projectContext.sources.website.url).toBeUndefined();
    expect(useDiagnosisStore.getState().projectContext.completeness.canRunDiagnosis).toBe(false);
  });

  it('guards runFullDiagnosis when 0 sources are connected', () => {
    useDiagnosisStore.getState().clearAllSources();
    useDiagnosisStore.getState().runFullDiagnosis();

    const state = useDiagnosisStore.getState();
    expect(state.isAnalyzing).toBe(false);
    expect(state.error).toContain('Please select or connect at least 1 of the 3 context sources');
  });
});
