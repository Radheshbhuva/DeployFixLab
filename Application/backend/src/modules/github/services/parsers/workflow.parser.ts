// ─────────────────────────────────────────────────────────────────────────────
// workflow.parser.ts
// Parses GitHub Actions workflow YAML files to extract CI tools, Node versions,
// and test commands.
// ─────────────────────────────────────────────────────────────────────────────

import yaml from 'yaml';
import { ParsedWorkflow } from '../../github-context.types';

export function parseWorkflowFile(fileName: string, content: string): ParsedWorkflow {
  try {
    const doc = yaml.parse(content) as Record<string, unknown>;
    const ciTools: string[] = [];
    const nodeVersions: string[] = [];
    const testCommands: string[] = [];

    const jobs = (doc.jobs as Record<string, unknown>) ?? {};

    for (const job of Object.values(jobs)) {
      const steps = ((job as Record<string, unknown>).steps as Array<Record<string, unknown>>) ?? [];
      for (const step of steps) {
        // uses field: e.g. "actions/setup-node@v4"
        const uses = step.uses as string | undefined;
        if (uses) {
          const toolBase = uses.split('@')[0] ?? uses;
          if (!ciTools.includes(toolBase)) ciTools.push(toolBase);
        }

        // Extract node-version from with block
        const withBlock = (step.with as Record<string, unknown>) ?? {};
        const nodeVersion = withBlock['node-version'] ?? withBlock['node_version'];
        if (nodeVersion) {
          const vStr = String(nodeVersion);
          if (!nodeVersions.includes(vStr)) nodeVersions.push(vStr);
        }

        // run field: look for test commands
        const run = step.run as string | undefined;
        if (run) {
          const lines = run.split('\n').map((l) => l.trim()).filter(Boolean);
          for (const line of lines) {
            if (/\b(npm|pnpm|yarn)\s+(run\s+)?test/i.test(line) || /\bvitest\b/.test(line) || /\bjest\b/.test(line)) {
              if (!testCommands.includes(line)) testCommands.push(line);
            }
          }
        }
      }
    }

    return { fileName, ciTools, nodeVersions, testCommands };
  } catch {
    return { fileName, ciTools: [], nodeVersions: [], testCommands: [] };
  }
}
