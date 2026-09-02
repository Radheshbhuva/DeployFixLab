import { ProjectContext } from './context-types';

export function validateProjectContext(context: ProjectContext): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  const hasFiles =
    (context.source.uploadedFiles && context.source.uploadedFiles.length > 0) ||
    (context.source.deploymentFiles && context.source.deploymentFiles.length > 0);

  if (
    !context.source.githubUrl &&
    !context.source.websiteUrl &&
    !hasFiles
  ) {
    errors.push(
      'Project context must contain at least one valid source: GitHub Repository, Website URL, or Uploaded Files.'
    );
  }
  return { valid: errors.length === 0, errors };
}
