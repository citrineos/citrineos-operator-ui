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
import { Check, ChevronsUpDown } from 'lucide-react';
import type { JSX } from 'react';

export type MultiSelectProps<T> = {
  options: T[];
  selectedValues: T[];
  setSelectedValues: (values: T[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
};

export function MultiSelect<T extends string>({
  options,
  selectedValues,
  setSelectedValues,
  placeholder,
  searchPlaceholder,
}: MultiSelectProps<T>): JSX.Element {
  // Handle null, undefined and single value
  const selectedArray = Array.isArray(selectedValues)
    ? selectedValues : selectedValues ? [selectedValues as unknown as T] : [];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          {selectedArray.length > 0
            ? `${selectedArray.length} selected`
            : placeholder || 'Select options...'}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder={searchPlaceholder ?? 'Search Items'} />
          <CommandList>
            <CommandEmpty>No context found.</CommandEmpty>
            <CommandGroup>
              {options.map((context) => (
                <CommandItem
                  key={context}
                  onSelect={() => {
                    const updatedValues = selectedValues.includes(context)
                      ? selectedValues.filter((c) => c !== context)
                      : [...selectedValues, context];

                    setSelectedValues(updatedValues);
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      selectedArray.includes(context)
                        ? 'opacity-100'
                        : 'opacity-0',
                    )}
                  />
                  {context}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
