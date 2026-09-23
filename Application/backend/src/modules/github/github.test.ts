// ─────────────────────────────────────────────────────────────────────────────
// github.test.ts
// Unit tests for GitHub integration parsers, sanitization, and diagnostic rules.
// ─────────────────────────────────────────────────────────────────────────────

import { describe, it, expect } from 'vitest';
import { SanitizationService } from './services/sanitization.service';
import { parsePackageJson } from './services/parsers/package-json.parser';
import { parseDockerfile } from './services/parsers/dockerfile.parser';
import { parseDockerCompose } from './services/parsers/docker-compose.parser';
import { parseNginxConfig } from './services/parsers/nginx.parser';
import { parseEnvExample } from './services/parsers/env-example.parser';
import { parsePrismaSchema } from './services/parsers/prisma-schema.parser';
import { parseWorkflowFile } from './services/parsers/workflow.parser';
import { checkDiagnosticRules } from './services/project-context.service';

describe('GitHub Module: SanitizationService', () => {
  it('blocks sensitive files and secrets from ingestion', () => {
    expect(SanitizationService.isBlacklisted('.env')).toBe(true);
    expect(SanitizationService.isBlacklisted('.env.production')).toBe(true);
    expect(SanitizationService.isBlacklisted('id_rsa')).toBe(true);
    expect(SanitizationService.isBlacklisted('id_ed25519')).toBe(true);
    expect(SanitizationService.isBlacklisted('server.pem')).toBe(true);
    expect(SanitizationService.isBlacklisted('secrets.key')).toBe(true);
    expect(SanitizationService.isBlacklisted('node_modules/express/index.js')).toBe(true);
    expect(SanitizationService.isBlacklisted('.git/config')).toBe(true);
  });

  it('permits safe deployment configuration artifacts', () => {
    expect(SanitizationService.isBlacklisted('package.json')).toBe(false);
    expect(SanitizationService.isBlacklisted('Dockerfile')).toBe(false);
    expect(SanitizationService.isBlacklisted('docker-compose.yml')).toBe(false);
    expect(SanitizationService.isBlacklisted('nginx.conf')).toBe(false);
    expect(SanitizationService.isBlacklisted('.env.example')).toBe(false);
    expect(SanitizationService.isBlacklisted('prisma/schema.prisma')).toBe(false);
    expect(SanitizationService.isBlacklisted('.github/workflows/ci.yml')).toBe(false);
  });
});

describe('GitHub Module: Parsers', () => {
  it('parsePackageJson correctly detects frameworks and dependencies', () => {
    const raw = JSON.stringify({
      dependencies: {
        express: '^4.18.2',
        '@prisma/client': '^5.0.0',
      },
      devDependencies: {
        typescript: '^5.0.0',
        vite: '^5.0.0',
      },
      engines: {
        node: '>=20.0.0',
      },
    });

    const parsed = parsePackageJson(raw);
    expect(parsed.detectedFrameworks).toContain('Express');
    expect(parsed.detectedFrameworks).toContain('Prisma');
    expect(parsed.detectedFrameworks).toContain('Vite');
    expect(parsed.nodeVersion).toBe('>=20.0.0');
    expect(parsed.dependencies).toContain('express');
  });

  it('parseDockerfile extracts exposed ports, base image, and workdir', () => {
    const dockerfile = `FROM node:20-alpine
WORKDIR /app
COPY . .
EXPOSE 3000
EXPOSE 8080
CMD ["npm", "start"]`;

    const parsed = parseDockerfile(dockerfile);
    expect(parsed.baseImage).toBe('node:20-alpine');
    expect(parsed.workDir).toBe('/app');
    expect(parsed.exposedPorts).toEqual([3000, 8080]);
  });

  it('parseDockerCompose extracts services and port bindings', () => {
    const compose = `
version: '3.8'
services:
  web:
    image: nginx:alpine
    ports:
      - "80:80"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=secret_should_not_be_saved
`;

    const parsed = parseDockerCompose(compose);
    expect(parsed.length).toBe(1);
    expect(parsed[0]?.name).toBe('web');
    expect(parsed[0]?.ports).toEqual([{ host: 80, container: 80 }]);
    // Environment keys must be retained, but values discarded
    expect(parsed[0]?.environmentKeys).toEqual(['NODE_ENV', 'DATABASE_URL']);
  });

  it('parseNginxConfig detects listen ports and proxy_pass targets', () => {
    const nginxConf = `
server {
  listen 80;
  server_name localhost example.com;

  location /api {
    proxy_pass http://backend:5000;
  }
}
`;

    const parsed = parseNginxConfig(nginxConf);
    expect(parsed.listenPorts).toEqual([80]);
    expect(parsed.serverNames).toContain('localhost');
    expect(parsed.serverNames).toContain('example.com');
    expect(parsed.proxyPassTargets).toContain('http://backend:5000');
  });

  it('parseEnvExample extracts required environment keys', () => {
    const envExample = `
PORT=3000
DATABASE_URL=postgres://user:pass@localhost:5432/db
# Optional comment
JWT_SECRET=supersecret
`;

    const parsed = parseEnvExample(envExample);
    expect(parsed).toEqual(['PORT', 'DATABASE_URL', 'JWT_SECRET']);
  });

  it('parsePrismaSchema identifies provider and models', () => {
    const prismaSchema = `
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id    String @id
  email String @unique
}

model Lab {
  id    String @id
  name  String
}
`;

    const parsed = parsePrismaSchema(prismaSchema);
    expect(parsed.provider).toBe('postgresql');
    expect(parsed.models).toEqual(['User', 'Lab']);
  });

  it('parseWorkflowFile extracts CI jobs and tools', () => {
    const workflowYaml = `
name: CI
on: [push]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm test
`;

    const parsed = parseWorkflowFile('ci.yml', workflowYaml);
    expect(parsed.ciTools).toContain('actions/checkout');
    expect(parsed.ciTools).toContain('actions/setup-node');
    expect(parsed.nodeVersions).toContain('20');
    expect(parsed.testCommands).toContain('npm test');
  });
});

describe('GitHub Module: Diagnostic Rules Engine', () => {
  it('triggers RULE_PORT_MISMATCH when Dockerfile and Nginx proxy_pass disagree', () => {
    const findings = checkDiagnosticRules({
      parsedArtifacts: {
        dockerfile: {
          baseImage: 'node:20',
          exposedPorts: [3000],
          workDir: '/app',
          isMultiStage: false,
        },
        nginx: {
          listenPorts: [80],
          serverNames: ['localhost'],
          proxyPassTargets: ['http://backend:5000'],
          hasSsl: false,
        },
      },
    });

    const mismatch = findings.find((f) => f.ruleId === 'RULE_PORT_MISMATCH');
    expect(mismatch).toBeDefined();
    expect(mismatch?.severity).toBe('CRITICAL');
    expect(mismatch?.fileAffected).toBe('nginx.conf');
  });

  it('triggers RULE_MISSING_ENV_DOCS when docker-compose uses undocumented variables', () => {
    const findings = checkDiagnosticRules({
      parsedArtifacts: {
        envExampleKeys: ['DATABASE_URL'],
        dockerComposeServices: [
          {
            name: 'backend',
            image: 'node:20',
            ports: [{ host: 3000, container: 3000 }],
            environmentKeys: ['DATABASE_URL', 'SECRET_KEY'],
            dependsOn: [],
          },
        ],
      },
    });

    const missing = findings.find((f) => f.ruleId === 'RULE_MISSING_ENV_DOCS');
    expect(missing).toBeDefined();
    expect(missing?.severity).toBe('MEDIUM');
    expect(missing?.fileAffected).toBe('docker-compose.yml');
  });
});
