export type Option = {
  value: string;
  label: string;
};

export type PlaceHolder =
  | 'Assignee'
  | 'Tags'
  | 'Select items...'
  | 'Status'
  | 'Priority'
  | 'Project'
  | 'Due Date'
  | 'bold'
  | 'italic'
  | 'strikethrough'
  | 'code'
  | 'highlighter'
  | 'heading1'
  | 'heading2'
  | 'paragraph'
  | 'list'
  | 'listOrdered'
  | 'listTodo'
  | 'codeBlock'
  | 'quote'
  | 'horizontalRule'
  | 'hardBreak'
  | 'formatClear'
  | 'undo'
  | 'redo'
  | 'heading'
  | 'orderList'
  | 'unOrderList'
  | 'bulletList'
  | 'url'
  | 'mention'
  | 'attachment';

export type MultiSelectProps = {
  options: Option[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: PlaceHolder;
};

export type SearchableSelectProps = {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: PlaceHolder;
};
