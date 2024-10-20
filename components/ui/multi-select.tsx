// components/ui/multi-select.tsx
'use client';

import { useState } from 'react';
import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { SelectIcon } from '@/common';
import { MultiSelectProps, Option } from '@/types';
import { truncate } from '@/common/truncate';
import { Input } from '@/components/ui/input';

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = 'Select items...',
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleToggleOption = (value: string) => {
    const updatedSelected = selected.includes(value)
      ? selected.filter(item => item !== value)
      : [...selected, value];
    onChange(updatedSelected);
  };

  const handleRemoveOption = (value: string) => {
    onChange(selected.filter(item => item !== value));
  };

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedOptions = selected
    .map(value => options.find(opt => opt.value === value))
    .filter((opt): opt is Option => opt !== undefined);

  const displaySelectedOptions = () => {
    if (selectedOptions.length === 0) {
      return <span>{placeholder}</span>;
    } else if (selectedOptions.length === 1) {
      return (
        <span className="bg-gray-200 dark:bg-neutral-700 rounded-full px-2 py-1 text-sm flex items-center flex-shrink-0">
          {truncate(selectedOptions[0].label, 4)}
          <X
            size={14}
            className="ml-1 cursor-pointer"
            onClick={e => {
              e.stopPropagation();
              handleRemoveOption(selectedOptions[0].value);
            }}
          />
        </span>
      );
    } else {
      return (
        <span className="bg-gray-200 dark:bg-neutral-700 rounded-full px-2 py-1 text-sm flex flex-shrink-0">
          {truncate(`${selectedOptions.length} selected`, 1)}
        </span>
      );
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div className="text-md font-medium border-none focus:ring-transparent shadow-none focus:outline-none flex items-center gap-2 h-9 px-3 py-2">
          {SelectIcon(placeholder)}
          {displaySelectedOptions()}
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <div className="p-2">
          <Input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="border p-2 mb-2 w-full"
          />
          <div className="max-h-[200px] overflow-y-auto">
            {filteredOptions.map(option => (
              <div
                key={option.value}
                className={cn(
                  'flex items-center p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-neutral-700',
                  selected.includes(option.value) &&
                    'bg-gray-100 dark:bg-neutral-700'
                )}
                onClick={() => handleToggleOption(option.value)}
              >
                <Check
                  size={16}
                  className={cn(
                    'mr-2',
                    selected.includes(option.value)
                      ? 'opacity-100'
                      : 'opacity-0'
                  )}
                />
                {option.label}
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
