// ─────────────────────────────────────────────────────────────────────────────
// docker-compose.parser.ts
// Parses docker-compose.yml using the `yaml` package to extract service
// topology: ports, environment keys, and dependency graph.
// ─────────────────────────────────────────────────────────────────────────────

import yaml from 'yaml';
import { ParsedDockerComposeService } from '../../github-context.types';

function parsePortString(portStr: string | number | undefined): { host: number; container: number } | null {
  if (portStr == null) return null;
  const parts = String(portStr).split(':');
  if (parts.length === 2) {
    const host = parseInt(parts[0] ?? '0', 10);
    const container = parseInt(parts[1] ?? '0', 10);
    if (!isNaN(host) && !isNaN(container)) return { host, container };
  } else if (parts.length === 1) {
    const port = parseInt(parts[0] ?? '0', 10);
    if (!isNaN(port)) return { host: port, container: port };
  }
  return null;
}

export function parseDockerCompose(content: string): ParsedDockerComposeService[] {
  try {
    const doc = yaml.parse(content) as Record<string, unknown>;
    const services = (doc.services as Record<string, unknown>) ?? {};

    return Object.entries(services).map(([name, svcRaw]) => {
      const svc = (svcRaw as Record<string, unknown>) ?? {};

      const rawPorts = (svc.ports as Array<string | number | undefined>) ?? [];
      const ports = rawPorts
        .map((p) => parsePortString(p))
        .filter((x): x is { host: number; container: number } => x !== null);

      // Environment keys (only keys, never values)
      const rawEnv = svc.environment ?? {};
      let envKeys: string[] = [];
      if (Array.isArray(rawEnv)) {
        envKeys = (rawEnv as string[]).map((e) => e.split('=')[0] ?? '');
      } else if (typeof rawEnv === 'object' && rawEnv !== null) {
        envKeys = Object.keys(rawEnv as Record<string, unknown>);
      }

      // depends_on — can be a list or an object
      const rawDeps = svc.depends_on ?? [];
      let dependsOn: string[] = [];
      if (Array.isArray(rawDeps)) {
        dependsOn = rawDeps as string[];
      } else if (typeof rawDeps === 'object' && rawDeps !== null) {
        dependsOn = Object.keys(rawDeps as Record<string, unknown>);
      }

      // Build context
      const build = svc.build;
      const buildContext = typeof build === 'string' ? build : typeof build === 'object' && build !== null ? (build as Record<string, string>).context : undefined;

      return {
        name,
        image: svc.image as string | undefined,
        buildContext,
        ports,
        environmentKeys: envKeys,
        dependsOn,
      };
    });
  } catch {
    return [];
  }
}
