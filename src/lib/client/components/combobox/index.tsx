// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0
'use client';

import { Button } from '@lib/client/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@lib/client/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@lib/client/components/ui/popover';
import { cn } from '@lib/utils/cn';
import { CheckIcon, ChevronsUpDownIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

export interface ComboboxProps<T> {
  options: Array<{ label: string; value: T }>;
  value?: T;
  onSelect?: (value: T, label: string) => void;
  onSearch?: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  isLoading?: boolean;
  skipValue?: boolean;
  disabled?: boolean;
}

export function Combobox<T>({
  options,
  value,
  onSelect,
  onSearch,
  placeholder = 'Select an option',
  searchPlaceholder = 'Search',
  emptyMessage = 'No results found.',
  isLoading = false,
  skipValue = false,
  disabled = false,
}: ComboboxProps<T>) {
  const [open, setOpen] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<
    { label: string; value: T } | undefined
  >(undefined);

  useEffect(() => {
    if (value) {
      const matchingOption = options.find((option) => option.value === value);
      setSelectedOption(matchingOption ? { ...matchingOption } : undefined);
    } else {
      setSelectedOption(undefined);
    }
  }, [value, options]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={isLoading || disabled}
        >
          {isLoading ? 'Loading...' : selectedOption?.label || placeholder}
          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-(--radix-popover-trigger-width) p-0"
        align="start"
      >
        <Command shouldFilter={!onSearch}>
          <CommandInput
            placeholder={searchPlaceholder ?? 'Search'}
            onValueChange={(val) => onSearch?.(val)}
          />
          <CommandList>
            <CommandEmpty>
              {isLoading ? 'Loading...' : emptyMessage}
            </CommandEmpty>
            <CommandGroup>
              {options.map((option, index) => (
                <CommandItem
                  key={index}
                  value={String(option.value)}
                  onSelect={() => {
                    if (!skipValue) {
                      setSelectedOption(option);
                    }
                    onSelect?.(option.value, option.label);
                    setOpen(false);
                  }}
                >
                  <CheckIcon
                    className={cn(
                      'mr-2 size-4',
                      selectedOption?.label === option.label
                        ? 'opacity-100'
                        : 'opacity-0',
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
