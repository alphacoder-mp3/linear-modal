// components/task-form.tsx
'use client';

import { FormEvent, useRef } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { MultiSelect } from '@/components/ui/multi-select';
import { createTask } from '@/app/actions/createTask';
import { Icons } from '@/components/icons';
import { Separator } from '@/components/ui/separator';
import { SearchableSelect } from '@/components/searchable-select';
import {
  assigneesData,
  tagsData,
  projectsData,
  priorityData,
  statusData,
} from '@/common/data';
import { EditorContent } from '@tiptap/react';
import { SelectIcon } from '@/common';
import { PlaceHolder } from '@/types';
import { useMarkDown } from '@/hooks/use-markdown';
import { toast } from 'sonner';
import { taskSchema, FormValues } from '@/types/zod-schema';
import { useGeminiSuggestions } from '@/hooks/use-gemini-suggestions';
import { useTiptapEditor } from '@/hooks/use-tiptap-editor';
import { Input } from './ui/input';

const TaskForm = () => {
  const formRef = useRef<HTMLFormElement>(null);

  const {
    setActiveEditor,
    titleEditor,
    setTitleEditor,
    descriptionEditor,
    setDescriptionEditor,
    items,
  } = useMarkDown();

  const form = useForm<FormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      description: '',
      status: 'TODO',
      assigneeIds: [],
      priority: 'NO_PRIORITY',
      tagIds: [],
      projectId: '',
      dueDate: '',
    },
  });

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    formData.set('title', titleEditor?.getHTML() || '');
    formData.set('description', descriptionEditor?.getHTML() || '');
    formData.set('status', form.getValues('status') || '');
    formData.set('priority', form.getValues('priority') || '');
    formData.set('projectId', form.getValues('projectId') || '');
    // formData.set('dueDate', form.getValues('dueDate') || new Date());

    // Handle multi-select fields
    const assigneeIds = form.getValues('assigneeIds') || [];
    assigneeIds.forEach((id, index) => {
      formData.append(`assigneeIds[${index}]`, id);
    });

    const tagIds = form.getValues('tagIds') || [];
    tagIds.forEach((id, index) => {
      formData.append(`tagIds[${index}]`, id);
    });

    try {
      await createTask(formData);
      form.reset();
      titleEditor?.commands.setContent('');
      descriptionEditor?.commands.setContent('');
      toast('task created successfully');
    } catch (error) {
      console.error('Error creating task:', error);
      toast('task creation failed');
    }
  }

  const {
    tagSuggestions,
    projectSuggestions,
    isLoading,
    setTitle,
    setDescription,
  } = useGeminiSuggestions();

  const handleSuggestionClick = (
    field: 'tagIds' | 'projectId',
    value: string
  ) => {
    console.log({ value, forms: form.getValues('tagIds') });
    if (field === 'tagIds') {
      const currentTags = form.getValues('tagIds') || [];
      if (!currentTags.includes(value)) {
        form.setValue('tagIds', [...currentTags, value]);
      }
    } else {
      form.setValue('projectId', value);
    }
  };

  const titleEditorInstance = useTiptapEditor({
    content: form.watch('title') || '<p></p>',
    placeholder: 'Task title',
    onUpdate: html => {
      form.setValue('title', html);
      setTitle(titleEditorInstance?.getText() || '');
    },
    onFocus: () => setActiveEditor('title'),
    onCreate: editor => setTitleEditor(editor),
    onDestroy: () => setTitleEditor(null),
  });

  const descriptionEditorInstance = useTiptapEditor({
    content: form.watch('description') || '<p></p>',
    placeholder: 'Describe this',
    onUpdate: html => {
      form.setValue('description', html);
      setDescription(descriptionEditorInstance?.getText() || '');
    },
    onFocus: () => setActiveEditor('description'),
    onCreate: editor => setDescriptionEditor(editor),
    onDestroy: () => setDescriptionEditor(null),
  });

  return (
    <Form {...form}>
      <form
        onSubmit={onSubmit}
        ref={formRef}
        className="space-y-2 text-[#6C6F75] dark:text-neutral-300"
      >
        <FormField
          control={form.control}
          name="title"
          render={() => (
            <FormItem>
              <FormLabel className="sr-only">Task Title</FormLabel>
              <FormControl>
                <EditorContent
                  editor={titleEditorInstance}
                  className="title-editor p-2 text-lg font-medium border-none focus-visible:ring-transparent shadow-none focus:outline-none"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={() => (
            <FormItem>
              <FormLabel className="sr-only">Description</FormLabel>
              <FormControl>
                <EditorContent
                  editor={descriptionEditorInstance}
                  className="description-editor p-2 text-lg font-medium border-none focus-visible:ring-transparent shadow-none focus:outline-none"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* AI Suggestions */}
        {isLoading ? (
          <div className="text-sm text-gray-500 flex items-center gap-2">
            <Icons.ai />
            Loading suggestions...
          </div>
        ) : (
          <>
            {tagSuggestions?.length > 0 && (
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-sm font-medium flex items-center gap-2">
                  <Icons.ai />
                  Suggested tag:
                </span>
                {tagSuggestions?.map((tag, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleSuggestionClick('tagIds', tag)}
                    type="button"
                    className="border border-dashed border-[#DFE1E4] dark:border-neutral-600"
                  >
                    {tag}
                  </Button>
                ))}
              </div>
            )}
            {projectSuggestions?.length > 0 && (
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-sm font-medium flex items-center gap-2">
                  {' '}
                  <Icons.ai />
                  Suggested project:
                </span>
                {projectSuggestions?.map((project, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleSuggestionClick('projectId', project)}
                    type="button"
                    className="border border-dashed border-[#DFE1E4] dark:border-neutral-600"
                  >
                    {project}
                  </Button>
                ))}
              </div>
            )}
          </>
        )}

        <div className="flex items-center pt-4 gap-4 flex-wrap">
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem className="w-fit">
                <div className="border border-[#DFE1E4] dark:border-neutral-600 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700">
                  <FormLabel className="sr-only">Status</FormLabel>
                  <SearchableSelect
                    value={field.value || ''}
                    onChange={field.onChange}
                    options={statusData}
                    placeholder="Status"
                  />
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="assigneeIds"
            render={({ field }) => {
              return (
                <FormItem className="w-fit">
                  <div className="border border-[#DFE1E4] dark:border-neutral-600 rounded-lg flex items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-neutral-700">
                    <FormLabel className="sr-only">Assignees</FormLabel>
                    <FormControl>
                      <MultiSelect
                        options={assigneesData}
                        selected={field.value || []}
                        onChange={field.onChange}
                        placeholder="Assignee"
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <div className="border border-[#DFE1E4] dark:border-neutral-600 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700">
                  <FormLabel className="sr-only">Priority</FormLabel>
                  <SearchableSelect
                    value={field.value || 'NO_PRIORITY'}
                    onChange={field.onChange}
                    options={priorityData}
                    placeholder="Priority"
                  />
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tagIds"
            render={({ field }) => (
              <FormItem>
                <div className="border border-[#DFE1E4] dark:border-neutral-600 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-neutral-700">
                  <FormLabel className="sr-only">Tags</FormLabel>
                  <FormControl>
                    <MultiSelect
                      options={tagsData}
                      selected={field.value || []}
                      onChange={field.onChange}
                      placeholder="Tags"
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="projectId"
            render={({ field }) => (
              <FormItem>
                <div className="border border-[#DFE1E4] dark:border-neutral-600 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700">
                  <FormLabel className="sr-only">Project</FormLabel>
                  <SearchableSelect
                    value={field.value || ''}
                    onChange={field.onChange}
                    options={projectsData}
                    placeholder="Project"
                  />
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem>
                <div className="border border-[#DFE1E4] dark:border-neutral-600 rounded-lg flex items-center cursor-pointer">
                  <div className="pl-2">
                    <Icons.duedate />
                  </div>
                  <FormLabel className="sr-only">Due Date</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      {...field}
                      className="border-none focus-visible:ring-transparent focus:outline-none"
                      placeholder="Due Date"
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          /> */}
          <FormField
            control={form.control}
            name="dueDate"
            render={() => (
              <FormItem
                onClick={() => toast('Due date feature will be added soon')}
              >
                <div className="border border-[#DFE1E4] dark:border-neutral-600 rounded-lg flex items-center justify-between cursor-pointer px-3 py-1.5 dark:hover:bg-neutral-700 hover:bg-gray-100 transition-all">
                  <div className="flex items-center">
                    <Icons.duedate />
                    <span className="font-medium ml-2 mr-[-25px]">
                      Due Date
                    </span>
                  </div>

                  <FormLabel className="sr-only">Due Date</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      className="border-none focus-visible:ring-transparent focus:outline-none text-transparent pointer-events-none w-0 h-0"
                      placeholder="Due Date"
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div>
          <Separator className="mt-4 dark:text-neutral-300" />
        </div>

        <div className="flex justify-between pt-4">
          <div className="flex flex-wrap items-center space-x-1 rounded-md p-1">
            {items.map((item, index) => (
              <Button
                type="button"
                key={index}
                onClick={item.action}
                variant="ghost"
                size="sm"
                className={`p-1 ${
                  item.isActive && item.isActive() ? 'bg-muted' : ''
                }`}
              >
                {SelectIcon(item.icon as PlaceHolder, 'h-5 w-5')}
              </Button>
            ))}
          </div>
          <Button
            type="submit"
            className="flex gap-4 bg-[#3F2ABD] dark:text-neutral-300"
          >
            Create Task
            <Icons.enter />
          </Button>
        </div>
      </form>
    </Form>
  );
};

export { TaskForm };

// import BulletList from '@tiptap/extension-bullet-list';
// import Document from '@tiptap/extension-document';
// import ListItem from '@tiptap/extension-list-item';
// import Paragraph from '@tiptap/extension-paragraph';
// import Text from '@tiptap/extension-text';
// import Highlight from '@tiptap/extension-highlight';
// import TaskList from '@tiptap/extension-task-list';
// import TaskItem from '@tiptap/extension-task-item';
