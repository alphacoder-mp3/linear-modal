'use server';

import { TaskForm } from '@/components/task-form';
import { Icons } from '@/components/icons';

export default async function TaskCreationModal() {
  return (
    <div className="p-6 rounded-lg shadow-lg max-w-2xl mx-auto font-sans w-full sm:w-[550px] md:w-[650px] lg:w-[800px] xl:[950px]">
      <div className="flex items-center text-sm text-[#6C6F75] gap-4 mb-8 font-medium">
        <Icons.topics />
        <div> Frontend </div>
        <Icons.greaterIcon />
        <div> New Task </div>
      </div>

      <TaskForm />
    </div>
  );
}
