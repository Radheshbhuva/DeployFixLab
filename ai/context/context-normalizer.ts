import { ProjectContext } from './context-types';

export function normalizeProjectContext(rawContext: Partial<ProjectContext>): ProjectContext {
  return {
    id: rawContext.id || 'ctx_default',
    name: rawContext.name || 'Untitled Project',
    source: rawContext.source || {},
    topology: rawContext.topology || { containers: false, cicd: false },
    environmentVars: rawContext.environmentVars || {},
    createdAt: rawContext.createdAt || new Date().toISOString(),
  };
}
