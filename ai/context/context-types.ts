export interface ProjectContextSource {
  githubUrl?: string;
  websiteUrl?: string;
  deploymentFiles?: string[];
}

export interface ComponentTopology {
  frontend?: { framework: string; buildTool: string; port: number };
  backend?: { runtime: string; framework: string; port: number };
  database?: { engine: string; provider: string; port: number };
  proxy?: { type: string; ssl: boolean };
  containers: boolean;
  cicd: boolean;
}

export interface ProjectContext {
  id: string;
  name: string;
  source: ProjectContextSource;
  topology: ComponentTopology;
  environmentVars: Record<string, string>;
  createdAt: string;
}
