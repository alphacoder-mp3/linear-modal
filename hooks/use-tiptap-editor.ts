import { useEditor, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';

interface UseTiptapEditorProps {
  content: string;
  placeholder: string;
  onUpdate: (html: string) => void;
  onFocus: () => void;
  onCreate: (editor: Editor) => void;
  onDestroy: () => void;
}

export const useTiptapEditor = ({
  content,
  placeholder,
  onUpdate,
  onFocus,
  onCreate,
  onDestroy,
}: UseTiptapEditorProps) => {
  return useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder,
      }),
      Link.configure({
        openOnClick: false,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onUpdate(html);
    },
    onFocus,
    onCreate: ({ editor }) => onCreate(editor),
    onDestroy,
    immediatelyRender: false,
  });
};
