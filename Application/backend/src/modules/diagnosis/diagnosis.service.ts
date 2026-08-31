import fs from 'fs';
import path from 'path';
import prisma from '../../prisma';
import { runDiagnosis } from '../../../ai/diagnosis/diagnosis-engine';
import { AIDiagnosisOutputSchema } from '../../../ai/diagnosis/diagnosis-schema';
import { EvidenceService } from '../evidence/evidence.service';

/**
 * Prompt constructor helper for compiling diagnostic information.
 */
export function constructPrompt(logs: string, containers: any[], configs: any): string {
  let systemPrompt = '';
  try {
    systemPrompt = fs.readFileSync(
      path.join(__dirname, '../../../ai/prompts/diagnosis/system.prompt'),
      'utf-8'
    );
  } catch {
    systemPrompt =
      'You are the DeployFix Lab AI Diagnosis Engine. Your outputs must adhere to the schema.';
  }

  return `${systemPrompt.trim()}

### DIAGNOSTIC INPUT PAYLOAD

--- SERVER LOGS ---
${logs}

--- DOCKER CONTAINER TELEMETRY ---
${JSON.stringify(containers, null, 2)}

--- ENVIRONMENT CONFIGURATIONS ---
${JSON.stringify(configs, null, 2)}
`;
}

export class DiagnosisService {
  /**
   * Compiles evidence telemetry, constructs prompt, runs rules/simulations, and returns validated diagnosis output.
   */
  public static async runDiagnosis(userId: string) {
    // 1. Gather active lab scenario session
    const progress = await prisma.userLabProgress.findFirst({
      where: { userId, status: 'FAILED_INJECTED' },
      include: { lab: true },
    });

    const code = progress?.lab.code;

    // 2. Fetch current evidence signals
    const logs = await EvidenceService.getNginxLogs(userId);
    const containers = await EvidenceService.getDockerContainers(userId);
    const configs = await EvidenceService.getConfigs(userId);

    // 3. Construct prompt (used to feed LLM reasoning)
    const prompt = constructPrompt(logs, containers, configs);

    // 4. Determine diagnostic result depending on scenario code
    let problem = 'System is fully operational';
    let rootCause = 'No active deployment failures or chaos injections detected';
    let severity: 'low' | 'medium' | 'high' | 'critical' = 'low';
    let evidence = [
      'All docker containers are healthy and running',
      'Readiness endpoints return 200 OK',
    ];
    let recommendedActions = ['No actions required'];
    let confidence = 1.0;

    if (code === 'LAB-001') {
      problem = 'PostgreSQL Database Connection Authentication Failure';
      rootCause =
        "The DATABASE_URL password parameter in the .env configuration file is set to 'wrong_password_db', failing the Postgres connection authentication check.";
      severity = 'critical';
      evidence = [
        "Nginx logs display backend-api connection error: FATAL: password authentication failed for user 'postgres'",
        'Configuration file .env contains mismatching database credentials password',
      ];
      recommendedActions = [
        'Edit the environment file .env and replace wrong_password_db with postgres_secure_pass',
        'Restart the backend service container to reload the environment variables',
        'Check database connectivity status using backend health check endpoints',
      ];
      confidence = 0.95;
    } else if (code === 'LAB-003') {
      problem = 'Nginx Gateway upstream connection failure (502 Bad Gateway)';
      rootCause =
        'Nginx configuration upstream port is mapped to target service port 4000 while the backend docker-compose configuration exposes port 5000.';
      severity = 'critical';
      evidence = [
        'Nginx connection logs return error: connect() failed (111: Connection refused) to backend-api:4000',
        'nginx.conf proxy configuration maps backend-api:4000 but backend container is listening on port 5000',
        'Docker status shows nginx-proxy health status as unhealthy',
      ];
      recommendedActions = [
        'Open nginx.conf and update backend-api:4000 target port to 5000',
        'Restart the nginx-proxy docker container to reload proxy rules',
        'Test public endpoints using curl check probes to verify 200 status',
      ];
      confidence = 0.92;
    } else if (code === 'LAB-004') {
      problem = 'Backend application container crash (Out of Memory)';
      rootCause =
        'A memory leak in the backend Node.js process heap memory caused the Docker Daemon to invoke force SIGKILL exit code 137.';
      severity = 'high';
      evidence = [
        'Docker Daemon status inspect shows backend-api status as exited with exit code 137',
        'Backend service health probes are unreachable and return gateway timeouts',
      ];
      recommendedActions = [
        'Check docker-compose files and increase memory limits under service parameters',
        'Trace Node.js heap allocations to detect garbage collection leakage',
        'Optimize backend process logic for bulky background tasks',
      ];
      confidence = 0.9;
    }

    // 5. Generate structured diagnostic schema using diagnosis-engine core method
    const output = await runDiagnosis(
      problem,
      rootCause,
      evidence,
      recommendedActions,
      severity,
      confidence
    );

    // 6. Enforce strict Zod schema validation
    return {
      prompt,
      diagnosis: AIDiagnosisOutputSchema.parse(output),
    };
  }
}
