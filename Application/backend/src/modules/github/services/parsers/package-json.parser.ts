// ─────────────────────────────────────────────────────────────────────────────
// package-json.parser.ts
// Extracts runtime, framework, and build-tool metadata from package.json
// ─────────────────────────────────────────────────────────────────────────────

import { ParsedPackageJson } from '../../github-context.types';

const FRAMEWORK_SIGNALS: Record<string, string[]> = {
  React:      ['react', 'react-dom'],
  'Next.js':  ['next'],
  Vue:        ['vue'],
  Svelte:     ['svelte', '@sveltejs/kit'],
  Angular:    ['@angular/core'],
  Express:    ['express'],
  NestJS:     ['@nestjs/core'],
  Fastify:    ['fastify'],
  Hono:       ['hono'],
  Vite:       ['vite'],
  Webpack:    ['webpack'],
  Prisma:     ['@prisma/client'],
  Drizzle:    ['drizzle-orm'],
  TailwindCSS:['tailwindcss'],
  Zustand:    ['zustand'],
};

export function parsePackageJson(content: string): ParsedPackageJson {
  try {
    const pkg = JSON.parse(content);
    const allDeps = {
      ...((pkg.dependencies as Record<string, string>) ?? {}),
      ...((pkg.devDependencies as Record<string, string>) ?? {}),
    };
    const depNames = Object.keys(allDeps);

    const detectedFrameworks: string[] = [];
    for (const [framework, signals] of Object.entries(FRAMEWORK_SIGNALS)) {
      if (signals.some((s) => depNames.includes(s))) {
        detectedFrameworks.push(framework);
      }
    }

    const engines = pkg.engines as Record<string, string> | undefined;

    return {
      name: pkg.name as string | undefined,
      scripts: pkg.scripts as Record<string, string> | undefined,
      dependencies: Object.keys((pkg.dependencies as Record<string, string> | undefined) ?? {}),
      devDependencies: Object.keys((pkg.devDependencies as Record<string, string> | undefined) ?? {}),
      nodeVersion: engines?.node,
      detectedFrameworks,
    };
  } catch {
    return { detectedFrameworks: [] };
  }
}
