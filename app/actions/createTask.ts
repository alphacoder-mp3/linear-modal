// app/actions/createTask.ts
'use server';

import { taskSchema } from '@/types/zod-schema';
import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function createTask(formData: FormData) {
  // console.log({ formData: formData });
  const validatedData = taskSchema.parse({
    title: formData.get('title'),
    description: formData.get('description') || undefined,
    status: formData.get('status') || undefined,
    assigneeIds: formData.getAll('assigneeIds[]'),
    priority: formData.get('priority') || undefined,
    tagIds: formData.getAll('tagIds[]'),
    projectId: formData.get('projectId') || null,
    dueDate: formData.get('dueDate') || null,
  });

  try {
    let projectConnect;
    if (validatedData.projectId) {
      const project = await prisma.project.findUnique({
        where: { id: validatedData.projectId },
      });
      if (project) {
        projectConnect = { connect: { id: project.id } };
      } else {
        console.warn(
          `Project with ID ${validatedData.projectId} not found. Creating task without project.`
        );
      }
    }
    const task = await prisma.task.create({
      data: {
        title: validatedData.title,
        description: validatedData.description || '',
        status: validatedData.status || 'TODO',
        priority: validatedData.priority || 'NO_PRIORITY',
        dueDate: validatedData.dueDate ? new Date(validatedData.dueDate) : null,
        assignees: validatedData.assigneeIds?.length
          ? { connect: validatedData.assigneeIds.map(id => ({ id })) }
          : undefined,
        tags: validatedData.tagIds?.length
          ? { connect: validatedData.tagIds.map(id => ({ id })) }
          : undefined,
        project: projectConnect,
      },
    });

    revalidatePath('/');
    return task;
  } catch (error) {
    console.error('Error creating task:', error);
    throw new Error('Failed to create task');
  }
}
