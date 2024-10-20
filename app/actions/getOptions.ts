'use server';
import prisma from '@/lib/db';

export async function getAssignees() {
  return prisma.user.findMany();
}

export async function getTags() {
  return prisma.tag.findMany();
}

export async function getProjects() {
  return prisma.project.findMany();
}
