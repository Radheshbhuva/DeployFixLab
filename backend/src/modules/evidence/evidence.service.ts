import prisma from '../../prisma';

export class EvidenceService {
  /**
   * Retrieves simulated Nginx logs. Logs change if there is an active failure scenario.
   */
  public static async getNginxLogs(userId: string): Promise<string> {
    const progress = await prisma.userLabProgress.findFirst({
      where: { userId, status: 'FAILED_INJECTED' },
      include: { lab: true },
    });

    const code = progress?.lab.code;

    if (code === 'LAB-003') {
      return `2026/08/18 02:00:00 [error] 31#31: *12 connect() failed (111: Connection refused) while connecting to upstream, client: 127.0.0.1, server: localhost, request: "GET /api/v1/tasks HTTP/1.1", upstream: "http://backend-api:4000/api/v1/tasks"`;
    }

    if (code === 'LAB-001') {
      return `2026/08/18 02:00:00 [error] backend-api: database connection error: FATAL: password authentication failed for user "postgres"`;
    }

    return `127.0.0.1 - - [18/Aug/2026:02:00:00 +0000] "GET /live HTTP/1.1" 200 15 "-" "curl/7.81.0"
127.0.0.1 - - [18/Aug/2026:02:01:30 +0000] "GET /api/v1/tasks HTTP/1.1" 200 128 "-" "Mozilla/5.0"`;
  }

  /**
   * Retrieves Docker container states. If LAB-004 is active, the backend is exited with OOM.
   */
  public static async getDockerContainers(userId: string) {
    const progress = await prisma.userLabProgress.findFirst({
      where: { userId, status: 'FAILED_INJECTED' },
      include: { lab: true },
    });

    const code = progress?.lab.code;

    const containers = [
      { name: 'nginx-proxy', status: 'running', exitCode: 0, health: 'healthy', restarts: 0 },
      { name: 'backend-api', status: 'running', exitCode: 0, health: 'healthy', restarts: 0 },
      { name: 'database-pg', status: 'running', exitCode: 0, health: 'healthy', restarts: 0 },
      { name: 'frontend-ui', status: 'running', exitCode: 0, health: 'healthy', restarts: 0 },
    ];

    if (code === 'LAB-004') {
      const backend = containers.find((c) => c.name === 'backend-api');
      if (backend) {
        backend.status = 'exited';
        backend.exitCode = 137; // OOM Killed
        backend.health = 'unhealthy';
        backend.restarts = 4;
      }
    } else if (code === 'LAB-003') {
      const nginx = containers.find((c) => c.name === 'nginx-proxy');
      if (nginx) {
        nginx.health = 'unhealthy';
        nginx.status = 'running';
      }
    }

    return containers;
  }

  /**
   * Retrieves environment configuration files, displaying broken keys depending on the active scenario.
   */
  public static async getConfigs(userId: string) {
    const progress = await prisma.userLabProgress.findFirst({
      where: { userId, status: 'FAILED_INJECTED' },
      include: { lab: true },
    });

    const code = progress?.lab.code;

    const configs = {
      'docker-compose.yml': `version: '3.8'
services:
  backend-api:
    image: deployfix-backend
    ports:
      - "5000:5000"`,
      '.env': `PORT=5000
DATABASE_URL="postgresql://postgres:postgres_secure_pass@localhost:5432/deployfix"`,
      'nginx.conf': `server {
  listen 80;
  location /api/ {
    proxy_pass http://backend-api:5000;
  }
}`,
    };

    if (code === 'LAB-001') {
      configs['.env'] = `PORT=5000
DATABASE_URL="postgresql://postgres:wrong_password_db@localhost:5432/deployfix"`;
    } else if (code === 'LAB-003') {
      configs['nginx.conf'] = `server {
  listen 80;
  location /api/ {
    proxy_pass http://backend-api:4000;
  }
}`;
    }

    return configs;
  }
}
