import { ProjectContext } from './context-types';

export function validateProjectContext(context: ProjectContext): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  if (
    !context.source.githubUrl &&
    !context.source.websiteUrl &&
    (!context.source.deploymentFiles || context.source.deploymentFiles.length === 0)
  ) {
    errors.push(
      'Project context must contain at least one valid source: GitHub Repository, Website URL, or Deployment Files.'
    );
  }
  return { valid: errors.length === 0, errors };
}
