'use client';
import { useState, useRef, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { SelectIcon } from '@/common';
import { SearchableSelectProps } from '@/types';

export function SearchableSelect({
  value,
  onChange,
  options,
  placeholder,
}: SearchableSelectProps) {
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [forceUpdate, setForceUpdate] = useState(0);

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(search.toLowerCase())
  );

  const selectedOption = options.find(option => option.value === value);

  useEffect(() => {
    if (isOpen) {
      const focusInput = () => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      };
      focusInput();
      setTimeout(focusInput, 0);
    }
  }, [isOpen, forceUpdate]);

  const handleSelectOpen = () => {
    setIsOpen(true);
    setForceUpdate(prev => prev + 1);
  };

  const handleSelectClose = () => {
    setIsOpen(false);
    setSearch('');
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setForceUpdate(prev => prev + 1);
  };

  const handleOptionSelect = (optionValue: string) => {
    onChange(optionValue);
    handleSelectClose();
  };

  return (
    <Select
      onValueChange={handleOptionSelect}
      value={value}
      open={isOpen}
      onOpenChange={open => {
        if (open) handleSelectOpen();
        else handleSelectClose();
      }}
    >
      <SelectTrigger className="text-md font-medium border-none focus:ring-transparent shadow-none focus:outline-none flex items-center gap-2">
        {placeholder && SelectIcon(placeholder)}
        <SelectValue placeholder={placeholder}>
          {selectedOption ? selectedOption.label : placeholder}
        </SelectValue>
      </SelectTrigger>
      <SelectContent
        onPointerDownOutside={handleSelectClose}
        className="transition-all duration-300 ease-in-out"
      >
        <div className="p-2" onMouseDown={e => e.preventDefault()}>
          <Input
            ref={inputRef}
            placeholder="Search..."
            value={search}
            onChange={handleSearchChange}
            className="border p-2 mb-2 w-full"
            onKeyDown={e => {
              e.stopPropagation();
              if (e.key === 'Escape') {
                handleSelectClose();
              }
            }}
            onBlur={() => setTimeout(() => inputRef.current?.focus(), 0)}
          />
        </div>
        <div className="max-h-[200px] overflow-y-auto">
          {filteredOptions.length > 0 ? (
            filteredOptions.map(option => (
              <SelectItem
                key={option.value}
                value={option.value}
                onMouseDown={e => {
                  e.preventDefault();
                  handleOptionSelect(option.value);
                }}
                className="transition-colors duration-150 ease-in-out"
              >
                {option.label}
              </SelectItem>
            ))
          ) : (
            <div className="p-2 text-gray-500">No options found</div>
          )}
        </div>
      </SelectContent>
    </Select>
  );
}
