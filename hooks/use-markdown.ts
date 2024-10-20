'use client';
import { Editor } from '@tiptap/react';
import { useState } from 'react';
import { toast } from 'sonner';

export const useMarkDown = () => {
  const [activeEditor, setActiveEditor] = useState<
    'title' | 'description' | null
  >(null);
  const [titleEditor, setTitleEditor] = useState<Editor | null>(null);
  const [descriptionEditor, setDescriptionEditor] = useState<Editor | null>(
    null
  );

  const editor = activeEditor === 'title' ? titleEditor : descriptionEditor;

  const formatText = (format: string) => {
    if (editor) {
      switch (format) {
        case 'attachment':
          toast('Attachment will be added soon.');
          break;
        case 'emoji':
          toast('Emojis pro feature will be added soon.');
          break;
        case 'mention':
          toast('This mention pro feature will be added soon.');
          break;
        case 'bold':
          editor.chain().focus().toggleBold().run();
          break;
        case 'italic':
          editor.chain().focus().toggleItalic().run();
          break;
        case 'heading1':
          editor.chain().focus().toggleHeading({ level: 1 }).run();
          break;
        case 'code':
          editor.chain().focus().toggleCode().run();
          break;
        case 'codeBlock':
          editor.chain().focus().toggleCodeBlock().run();
          break;
        case 'url':
          const url = window.prompt('Enter the URL:');
          if (url) {
            editor.chain().focus().setLink({ href: url }).run();
          }
          break;
        case 'orderList':
          editor.chain().focus().toggleOrderedList().run();
          break;
        case 'bulletList':
          editor.chain().focus().toggleBulletList().run();
          break;
        case 'unOrderList':
          toast('Un order list will be added soon.');
          break;
        // Add more cases for other formatting options as needed
      }
    }
  };

  const items = [
    {
      icon: 'attachment',
      title: 'Attachment',
      action: () => formatText('attachment'),
      isActive: () => editor?.isActive('attachment'),
    },
    {
      icon: 'emoji',
      title: 'Emoji',
      action: () => formatText('emoji'),
      isActive: () => editor?.isActive('emoji'),
    },
    {
      icon: 'mention',
      title: 'Mention',
      action: () => formatText('mention'),
      isActive: () => editor?.isActive('mention'),
    },
    {
      icon: 'heading',
      title: 'Heading 1',
      action: () => formatText('heading1'),
      isActive: () => editor?.isActive('heading', { level: 1 }),
    },
    {
      icon: 'bold',
      title: 'Bold',
      action: () => formatText('bold'),
      isActive: () => editor?.isActive('bold'),
    },
    {
      icon: 'italic',
      title: 'Italic',
      action: () => formatText('italic'),
      isActive: () => editor?.isActive('italic'),
    },
    {
      icon: 'code',
      title: 'Inline Code',
      action: () => formatText('code'),
      isActive: () => editor?.isActive('code'),
    },
    {
      icon: 'url',
      title: 'URL',
      action: () => formatText('url'),
      isActive: () => editor?.isActive('link'),
    },
    {
      icon: 'orderList',
      title: 'Ordered List',
      action: () => formatText('orderList'),
      isActive: () => editor?.isActive('orderedList'),
    },
    {
      icon: 'bulletList',
      title: 'Bullet List',
      action: () => formatText('bulletList'),
      isActive: () => editor?.isActive('bulletList'),
    },
    {
      icon: 'unOrderList',
      title: 'unOrder List',
      action: () => formatText('unOrderList'),
      isActive: () => editor?.isActive('unOrderList'),
    },
  ];

  return {
    activeEditor,
    setActiveEditor,
    titleEditor,
    setTitleEditor,
    descriptionEditor,
    setDescriptionEditor,
    items,
  };
};
