'use client';

import * as React from 'react';
import { Calendar as CalendarIcon, X } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@lib/client/components/ui/popover';
import {
  CalendarWithTime,
  type CalendarWithTimeProps,
} from '@lib/client/components/ui/calendar';
import { buttonIconSize } from '@lib/client/styles/icon';
import { formatDate } from '@lib/client/components/timestamp-display';

export const dateTimePickerDateFormat = 'yyyy-MM-DD HH:mm:ss';

export const DateTimePicker = ({
  date,
  onSelectDateAction,
  placeholder = 'Pick a date and time',
}: CalendarWithTimeProps & {
  placeholder?: string;
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <div
          data-empty={!date}
          className="cursor-default data-[empty=true]:text-muted-foreground flex items-center justify-between text-sm px-3 py-1 text-sm shadow-sm font-normal h-9 w-full rounded-md border border-input bg-transparent"
        >
          <div className="flex items-center gap-1">
            <CalendarIcon className={buttonIconSize} />
            {date ? (
              formatDate(date, dateTimePickerDateFormat)
            ) : (
              <span>{placeholder}</span>
            )}
          </div>

          {date && (
            <X
              className={`${buttonIconSize} text-destructive hover:text-destructive/80 cursor-pointer`}
              onClick={() => onSelectDateAction(undefined)}
            />
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-6">
        <CalendarWithTime
          date={date ?? undefined}
          onSelectDateAction={onSelectDateAction}
        />
      </PopoverContent>
    </Popover>
  );
};
