// components/ui/prosemirror.tsx
'use client';

import React, { useEffect, useRef } from 'react';
import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { Schema, DOMParser } from 'prosemirror-model';
import { schema } from 'prosemirror-schema-basic';
import { addListNodes } from 'prosemirror-schema-list';
import { keymap } from 'prosemirror-keymap';
import { baseKeymap } from 'prosemirror-commands';
import { history } from 'prosemirror-history';

const mySchema = new Schema({
  nodes: addListNodes(schema.spec.nodes, 'paragraph block*', 'block'),
  marks: schema.spec.marks,
});

interface ProseMirrorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function ProseMirror({
  value,
  onChange,
  placeholder,
}: ProseMirrorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);

  useEffect(() => {
    if (editorRef.current && !viewRef.current) {
      const state = EditorState.create({
        schema: mySchema,
        doc: DOMParser.fromSchema(mySchema).parse(
          document.createElement('div')
        ),
        plugins: [history(), keymap(baseKeymap)],
      });

      viewRef.current = new EditorView(editorRef.current, {
        state,
        dispatchTransaction(transaction) {
          const newState = viewRef.current!.state.apply(transaction);
          viewRef.current!.updateState(newState);
          onChange(viewRef.current!.dom.innerHTML);
        },
      });
    }

    return () => {
      if (viewRef.current) {
        viewRef.current.destroy();
      }
    };
  }, [onChange]);

  useEffect(() => {
    if (viewRef.current) {
      const newDoc = DOMParser.fromSchema(mySchema).parse(
        document.createElement('div')
      );
      newDoc.textContent = value;
      const newState = EditorState.create({
        schema: mySchema,
        doc: newDoc,
        plugins: viewRef.current.state.plugins,
      });
      viewRef.current.updateState(newState);
    }
  }, [value]);

  return (
    <div
      ref={editorRef}
      className="prosemirror-editor border rounded-md p-2"
      data-placeholder={placeholder}
    />
  );
}
