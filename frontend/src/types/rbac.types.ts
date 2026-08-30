/**
 * DeployFix Lab - Frontend Role-Based Access Control (RBAC) Types
 */

export type UserRole = 'STUDENT' | 'INSTRUCTOR' | 'ADMIN';

export type Permission =
  // Labs
  | 'labs:view_catalog'
  | 'labs:start_sandbox'
  | 'labs:submit_solution'
  | 'labs:verify_progress'
  | 'labs:author_scenario'
  | 'labs:delete_scenario'
  // Chaos
  | 'chaos:verify'
  | 'chaos:inject_sandbox'
  | 'chaos:fleet_override'
  // Diagnosis
  | 'diagnosis:query_basic'
  | 'diagnosis:advanced_llm'
  // Tasks
  | 'tasks:read_own'
  | 'tasks:write_own'
  | 'tasks:manage_cohort'
  // Telemetry
  | 'telemetry:view_own'
  | 'telemetry:view_cohort'
  | 'telemetry:view_fleet'
  // Audit
  | 'audit:view_personal'
  | 'audit:view_global'
  | 'audit:export_compliance'
  // Users
  | 'users:view_profile'
  | 'users:list_all'
  | 'users:change_role'
  | 'users:deactivate';

const STUDENT_PERMISSIONS: readonly Permission[] = [
  'labs:view_catalog',
  'labs:start_sandbox',
  'labs:submit_solution',
  'labs:verify_progress',
  'chaos:verify',
  'diagnosis:query_basic',
  'tasks:read_own',
  'tasks:write_own',
  'telemetry:view_own',
  'audit:view_personal',
  'users:view_profile',
] as const;

const INSTRUCTOR_PERMISSIONS: readonly Permission[] = [
  ...STUDENT_PERMISSIONS,
  'labs:author_scenario',
  'chaos:inject_sandbox',
  'diagnosis:advanced_llm',
  'tasks:manage_cohort',
  'telemetry:view_cohort',
  'audit:view_global',
] as const;

const ADMIN_PERMISSIONS: readonly Permission[] = [
  ...INSTRUCTOR_PERMISSIONS,
  'labs:delete_scenario',
  'chaos:fleet_override',
  'telemetry:view_fleet',
  'audit:export_compliance',
  'users:list_all',
  'users:change_role',
  'users:deactivate',
] as const;

export const ROLE_PERMISSIONS: Record<UserRole, readonly Permission[]> = {
  STUDENT: STUDENT_PERMISSIONS,
  INSTRUCTOR: INSTRUCTOR_PERMISSIONS,
  ADMIN: ADMIN_PERMISSIONS,
};

export const hasPermission = (role: UserRole, permission: Permission): boolean => {
  const permissions = ROLE_PERMISSIONS[role];
  return Boolean(permissions && permissions.includes(permission));
};

export const hasAllPermissions = (role: UserRole, permissions: Permission[]): boolean => {
  return permissions.every((perm) => hasPermission(role, perm));
};

export const hasAnyPermission = (role: UserRole, permissions: Permission[]): boolean => {
  return permissions.some((perm) => hasPermission(role, perm));
};

export interface RoleMetadata {
  label: string;
  description: string;
  badgeClass: string;
  accentColor: string;
}

export const ROLE_METADATA: Record<UserRole, RoleMetadata> = {
  STUDENT: {
    label: 'Student',
    description: 'Practices incident diagnosis and runs sandboxed failure fixing',
    badgeClass: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30',
    accentColor: '#06b6d4',
  },
  INSTRUCTOR: {
    label: 'DevOps/SRE Engineer',
    description: 'Simulates chaos failures, runs advanced SRE diagnostics and monitors service mesh',
    badgeClass: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30',
    accentColor: '#f59e0b',
  },
  ADMIN: {
    label: 'Platform Admin',
    description: 'Full governance over users, chaos containment, audit trails, and infrastructure',
    badgeClass: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30',
    accentColor: '#f43f5e',
  },
};
