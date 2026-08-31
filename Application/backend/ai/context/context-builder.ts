import { ProjectContext, ProjectContextSource } from './context-types';

export async function buildProjectContext(
  id: string,
  name: string,
  source: ProjectContextSource
): Promise<ProjectContext> {
  return {
    id,
    name,
    source,
    topology: {
      frontend: { framework: 'React 18', buildTool: 'Vite', port: 80 },
      backend: { runtime: 'Node.js 20 LTS', framework: 'Express.js', port: 5000 },
      database: { engine: 'PostgreSQL 16', provider: 'Supabase / Docker', port: 5432 },
      proxy: { type: 'Nginx 1.25', ssl: true },
      containers: true,
      cicd: true,
    },
    environmentVars: {},
    createdAt: new Date().toISOString(),
  };
}
