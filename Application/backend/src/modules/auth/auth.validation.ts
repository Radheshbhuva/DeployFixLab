import { z } from 'zod';

export const RegisterSchema = z
  .object({
    name: z
      .string()
      .min(2, 'Name must be at least 2 characters long')
      .max(100, 'Name must not exceed 100 characters')
      .optional(),
    fullName: z
      .string()
      .min(2, 'Full name must be at least 2 characters long')
      .max(100, 'Full name must not exceed 100 characters')
      .optional(),
    email: z
      .string({ required_error: 'Email is required' })
      .email('Invalid email address')
      .max(255, 'Email must not exceed 255 characters'),
    password: z
      .string({ required_error: 'Password is required' })
      .min(6, 'Password must be at least 6 characters long'),
    role: z
      .enum(['STUDENT', 'INSTRUCTOR', 'ADMIN'])
      .optional()
      .default('STUDENT'),
  })
  .refine((data) => Boolean(data.name || data.fullName), {
    message: 'Name is required',
    path: ['fullName'],
  });

export const LoginSchema = z.object({
  email: z.string({ required_error: 'Email is required' }).email('Invalid email address'),
  password: z.string({ required_error: 'Password is required' }).min(1, 'Password is required'),
});

export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;

