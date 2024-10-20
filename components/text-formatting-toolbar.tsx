import React from 'react';
import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { Separator } from '@/components/ui/separator';
import { SelectIcon } from '@/common';
import { PlaceHolder } from '@/types';

interface TextFormattingToolbarProps {
  editor: Editor | null;
}

const TextFormattingToolbar: React.FC<TextFormattingToolbarProps> = ({
  editor,
}) => {
  if (!editor) {
    return null;
  }

  const items = [
    {
      icon: 'bold',
      title: 'Bold',
      action: () => editor.chain().focus().toggleBold().run(),
      isActive: () => editor.isActive('bold'),
    },
    {
      icon: 'italic',
      title: 'Italic',
      action: () => editor.chain().focus().toggleItalic().run(),
      isActive: () => editor.isActive('italic'),
    },
    {
      icon: 'strikethrough',
      title: 'Strike',
      action: () => editor.chain().focus().toggleStrike().run(),
      isActive: () => editor.isActive('strike'),
    },
    {
      icon: 'code',
      title: 'Code',
      action: () => editor.chain().focus().toggleCode().run(),
      isActive: () => editor.isActive('code'),
    },
    // {
    //   icon: 'highlighter',
    //   title: 'Highlight',
    //   action: () => editor.chain().focus().toggleHighlight().run(),
    //   isActive: () => editor.isActive('highlight'),
    // },
    { type: 'divider' },
    {
      icon: 'heading1',
      title: 'Heading 1',
      action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      isActive: () => editor.isActive('heading', { level: 1 }),
    },
    {
      icon: 'heading2',
      title: 'Heading 2',
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: () => editor.isActive('heading', { level: 2 }),
    },
    {
      icon: 'paragraph',
      title: 'Paragraph',
      action: () => editor.chain().focus().setParagraph().run(),
      isActive: () => editor.isActive('paragraph'),
    },
    {
      icon: 'list',
      title: 'Bullet List',
      action: () => editor.chain().focus().toggleBulletList().run(),
      isActive: () => editor.isActive('bulletList'),
    },
    {
      icon: 'listOrdered',
      title: 'Ordered List',
      action: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: () => editor.isActive('orderedList'),
    },
    // {
    //   icon: 'listTodo',
    //   title: 'Task List',
    //   action: () => editor.chain().focus().toggleTaskList().run(),
    //   isActive: () => editor.isActive('taskList'),
    // },
    {
      icon: 'codeBlock',
      title: 'Code Block',
      action: () => editor.chain().focus().toggleCodeBlock().run(),
      isActive: () => editor.isActive('codeBlock'),
    },
    { type: 'divider' },
    {
      icon: 'quote',
      title: 'Blockquote',
      action: () => editor.chain().focus().toggleBlockquote().run(),
      isActive: () => editor.isActive('blockquote'),
    },
    {
      icon: 'horizontalRule',
      title: 'Horizontal Rule',
      action: () => editor.chain().focus().setHorizontalRule().run(),
    },
    { type: 'divider' },
    {
      icon: 'hardBreak',
      title: 'Hard Break',
      action: () => editor.chain().focus().setHardBreak().run(),
    },
    {
      icon: 'formatClear',
      title: 'Clear Format',
      action: () => editor.chain().focus().clearNodes().unsetAllMarks().run(),
    },
    { type: 'divider' },
    {
      icon: 'undo',
      title: 'Undo',
      action: () => editor.chain().focus().undo().run(),
    },
    {
      icon: 'redo',
      title: 'Redo',
      action: () => editor.chain().focus().redo().run(),
    },
  ];

  return (
    <div className="flex flex-wrap items-center space-x-1 border rounded-md p-1">
      {items.map((item, index) =>
        item.type === 'divider' ? (
          <Separator key={index} orientation="vertical" className="mx-1 h-4" />
        ) : (
          <Button
            key={index}
            onClick={item.action}
            variant="ghost"
            size="sm"
            className={`p-1 ${
              item.isActive && item.isActive() ? 'bg-muted' : ''
            }`}
          >
            {/* <Icons name={item.icon} className="h-4 w-4" /> */}
            {SelectIcon(item.icon as PlaceHolder, 'h-4 w-4')}
          </Button>
        )
      )}
    </div>
  );
};

export default TextFormattingToolbar;
