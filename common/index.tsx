import { PlaceHolder } from '@/types';

import { Icons } from '@/components/icons';

export const SelectIcon = (placeholder: PlaceHolder, className?: string) => {
  switch (placeholder) {
    case 'Assignee':
      return <Icons.assignee />;
    case 'Tags':
      return <Icons.tags />;
    case 'Status':
      return <Icons.status />;
    case 'Project':
      return <Icons.project />;
    case 'Due Date':
      return <Icons.duedate />;
    case 'Priority':
      return <Icons.priority />;
    case 'bold':
      return <Icons.bold className={className} />;
    case 'italic':
      return <Icons.italic className={className} />;
    case 'orderList':
      return <Icons.orderList className={className} />;
    case 'bulletList':
      return <Icons.bulletList className={className} />;
    case 'url':
      return <Icons.url className={className} />;
    case 'code':
      return <Icons.code className={className} />;
    case 'heading':
      return <Icons.heading className={className} />;
    case 'unOrderList':
      return <Icons.unOrderList className={className} />;
    case 'mention':
      return <Icons.mention className={className} />;
  }
};
