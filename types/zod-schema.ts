import { z } from 'zod';

export const taskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  status: z
    .enum(['BACKLOG', 'TODO', 'IN_PROGRESS', 'DONE', 'CANCELLED', 'DUPLICATE'])
    .optional(),
  assigneeIds: z.array(z.string()).optional(),
  priority: z
    .enum(['NO_PRIORITY', 'LOW', 'MEDIUM', 'HIGH', 'URGENT'])
    .optional(),
  tagIds: z.array(z.string()).optional(),
  projectId: z.string().optional().nullable(),
  dueDate: z.string().optional().nullable(),
});

export type FormValues = z.infer<typeof taskSchema>;
