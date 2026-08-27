import { z } from 'zod';

export const listUsersQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().optional(),
  role: z.enum(['STUDENT', 'INSTRUCTOR', 'ADMIN']).optional(),
});

export const updateRoleSchema = z.object({
  role: z.enum(['STUDENT', 'INSTRUCTOR', 'ADMIN'], {
    required_error: 'Role is required and must be STUDENT, INSTRUCTOR, or ADMIN',
  }),
});

export type ListUsersQueryInput = z.infer<typeof listUsersQuerySchema>;
export type UpdateRoleInput = z.infer<typeof updateRoleSchema>;
