// ─────────────────────────────────────────────────────────────────────────────
// nginx.parser.ts
// Extracts listen ports, server names, and proxy_pass targets from nginx.conf.
// Uses a lightweight block-level regex approach (no external nginx parser dep).
// ─────────────────────────────────────────────────────────────────────────────

import { ParsedNginxConfig } from '../../github-context.types';

export function parseNginxConfig(content: string): ParsedNginxConfig {
  try {
    const listenPorts: number[] = [];
    const serverNames: string[] = [];
    const proxyPassTargets: string[] = [];

    // listen directives: "listen 80;" "listen 443 ssl;" "listen [::]:443 ssl;"
    const listenMatches = content.matchAll(/\blisten\s+([\d.[\]:]+)(?:\s+ssl)?/g);
    for (const m of listenMatches) {
      const portPart = m[1]?.split(':').pop() ?? '';
      const port = parseInt(portPart.replace(/[^\d]/g, ''), 10);
      if (!isNaN(port) && !listenPorts.includes(port)) listenPorts.push(port);
    }

    // server_name directives
    const snMatches = content.matchAll(/\bserver_name\s+([^;]+);/g);
    for (const m of snMatches) {
      const names = (m[1] ?? '').trim().split(/\s+/).filter(Boolean);
      serverNames.push(...names);
    }

    // proxy_pass targets
    const ppMatches = content.matchAll(/\bproxy_pass\s+(https?:\/\/[^;]+);/g);
    for (const m of ppMatches) {
      const target = (m[1] ?? '').trim();
      if (!proxyPassTargets.includes(target)) proxyPassTargets.push(target);
    }

    const hasSsl = /\bssl\b/.test(content) || /\blisten\s+443/i.test(content);

    return { listenPorts, serverNames, proxyPassTargets, hasSsl };
  } catch {
    return { listenPorts: [], serverNames: [], proxyPassTargets: [], hasSsl: false };
  }
}
