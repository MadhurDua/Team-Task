import { z } from 'zod';

export const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(8, 'Password must be 8 or more characters'),
  role: z.enum(['admin', 'member']).optional()
});

export const loginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required')
});

export const projectSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  dueDate: z.string().optional(),
  color: z.string().optional(),
  members: z.array(z.object({ user: z.string(), role: z.string().optional() })).optional()
});

export const taskSchema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  status: z.enum(['todo', 'in-progress', 'completed']).optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  dueDate: z.string().optional(),
  project: z.string(),
  assignee: z.string().optional(),
  labels: z.array(z.string()).optional(),
  order: z.number().optional()
});

export const commentSchema = z.object({
  body: z.string().min(1).max(2000)
});
