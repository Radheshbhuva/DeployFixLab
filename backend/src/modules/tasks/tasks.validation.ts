import { z } from 'zod';
import { TaskStatus, Priority } from '@prisma/client';

export const CreateTaskSchema = z.object({
  title: z
    .string({ required_error: 'Title is required' })
    .min(1, 'Title must not be empty')
    .max(200, 'Title must not exceed 200 characters'),
  description: z.string().optional().nullable(),
  status: z.nativeEnum(TaskStatus).optional(),
  priority: z.nativeEnum(Priority).optional(),
  dueDate: z
    .string()
    .datetime({ message: 'Due date must be a valid ISO 8601 datetime string' })
    .optional()
    .nullable(),
});

export const UpdateTaskSchema = CreateTaskSchema.partial();

export const TaskListQuerySchema = z.object({
  page: z
    .preprocess((val) => (val ? parseInt(val as string, 10) : 1), z.number().int().min(1))
    .default(1),
  limit: z
    .preprocess((val) => (val ? parseInt(val as string, 10) : 10), z.number().int().min(1).max(100))
    .default(10),
  status: z.nativeEnum(TaskStatus).optional(),
  priority: z.nativeEnum(Priority).optional(),
  search: z.string().optional(),
  sortBy: z.enum(['createdAt', 'dueDate', 'title', 'priority', 'status']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  userId: z.string().uuid().optional(),
});

export type CreateTaskInput = z.infer<typeof CreateTaskSchema>;
export type UpdateTaskInput = z.infer<typeof UpdateTaskSchema>;
export type TaskListQueryInput = z.infer<typeof TaskListQuerySchema>;
