// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@lib/client/components/ui/card';
import { Button } from '@lib/client/components/ui/button';
import { Input } from '@lib/client/components/ui/input';
import { Label } from '@lib/client/components/ui/label';
import { Switch } from '@lib/client/components/ui/switch';
import { Separator } from '@lib/client/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@lib/client/components/ui/select';
import { Calendar } from '@lib/client/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@lib/client/components/ui/popover';
import { ConfirmDialog } from '@lib/client/components/ui/confirm';
import type {
  LocationHours,
  LocationRegularHours,
  LocationExceptionalPeriod,
} from '@citrineos/base';
import { Plus, Trash2, CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import type { DateRange } from 'react-day-picker';
import { cn } from '@lib/utils/cn';
import { heading3Style } from '@lib/client/styles/page';

interface OpeningHoursFormProps {
  value?: LocationHours;
  onChange?: (value: LocationHours) => void;
}

const WEEKDAYS = [
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' },
  { value: 7, label: 'Sunday' },
];

export const OpeningHoursForm: React.FC<OpeningHoursFormProps> = ({
  value,
  onChange,
}) => {
  const defaultValue: LocationHours = { twentyfourSeven: false };
  const [localValue, setLocalValue] = useState<LocationHours>(
    value || defaultValue,
  );

  useEffect(() => {
    setLocalValue(value || defaultValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const handleChange = (newValue: LocationHours) => {
    setLocalValue(newValue);
    onChange?.(newValue);
  };

  const addRegularHours = () => {
    const newRegularHours: LocationRegularHours = {
      weekday: 1,
      periodBegin: '09:00',
      periodEnd: '17:00',
    };

    const updatedValue = {
      ...localValue,
      regularHours: [...(localValue.regularHours || []), newRegularHours],
    };
    handleChange(updatedValue);
  };

  const updateRegularHours = (
    index: number,
    field: keyof LocationRegularHours,
    fieldValue: number | string,
  ) => {
    const regularHours = [...(localValue.regularHours || [])];
    regularHours[index] = { ...regularHours[index], [field]: fieldValue };

    const updatedValue = {
      ...localValue,
      regularHours,
    };
    handleChange(updatedValue);
  };

  const removeRegularHours = (index: number) => {
    const regularHours = [...(localValue.regularHours || [])];
    regularHours.splice(index, 1);

    const updatedValue = {
      ...localValue,
      regularHours,
    };
    handleChange(updatedValue);
  };

  const addExceptionalPeriod = (
    type: 'exceptionalOpenings' | 'exceptionalClosings',
  ) => {
    const newPeriod: LocationExceptionalPeriod = {
      periodBegin: new Date(),
      periodEnd: new Date(),
    };

    const updatedValue = {
      ...localValue,
      [type]: [...(localValue[type] || []), newPeriod],
    };
    handleChange(updatedValue);
  };

  const updateExceptionalPeriod = (
    type: 'exceptionalOpenings' | 'exceptionalClosings',
    index: number,
    dateRange: DateRange | undefined,
  ) => {
    if (!dateRange?.from || !dateRange?.to) return;

    const periods = [...(localValue[type] || [])];
    periods[index] = {
      periodBegin: dateRange.from,
      periodEnd: dateRange.to,
    };

    const updatedValue = {
      ...localValue,
      [type]: periods,
    };
    handleChange(updatedValue);
  };

  const removeExceptionalPeriod = (
    type: 'exceptionalOpenings' | 'exceptionalClosings',
    index: number,
  ) => {
    const periods = [...(localValue[type] || [])];
    periods.splice(index, 1);

    const updatedValue = {
      ...localValue,
      [type]: periods,
    };
    handleChange(updatedValue);
  };

  const toggle24Seven = (checked: boolean) => {
    const updatedValue = {
      ...localValue,
      twentyfourSeven: checked,
      // Clear regular hours if 24/7 is enabled
      regularHours: checked ? [] : localValue.regularHours,
    };
    handleChange(updatedValue);
  };

  return (
    <Card>
      <CardHeader>
        <h3 className={heading3Style}>Opening Hours</h3>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 24/7 Toggle */}
        <div className="flex items-center gap-3">
          <Switch
            checked={localValue.twentyfourSeven}
            onCheckedChange={toggle24Seven}
          />
          <Label className="font-medium">24/7 Operation</Label>
        </div>

        {/* Regular Hours */}
        {!localValue.twentyfourSeven && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Regular Hours</h4>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addRegularHours}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Hours
              </Button>
            </div>

            {(localValue.regularHours || []).map((hours, index) => (
              <Card key={index} className="p-4">
                <div className="grid grid-cols-4 gap-4 items-center">
                  <Select
                    value={String(hours.weekday)}
                    onValueChange={(val) =>
                      updateRegularHours(index, 'weekday', parseInt(val, 10))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select day" />
                    </SelectTrigger>
                    <SelectContent>
                      {WEEKDAYS.map((day) => (
                        <SelectItem key={day.value} value={String(day.value)}>
                          {day.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <div>
                    <Input
                      type="time"
                      value={hours.periodBegin || '09:00'}
                      onChange={(e) =>
                        updateRegularHours(index, 'periodBegin', e.target.value)
                      }
                    />
                  </div>

                  <div>
                    <Input
                      type="time"
                      value={hours.periodEnd || '17:00'}
                      onChange={(e) =>
                        updateRegularHours(index, 'periodEnd', e.target.value)
                      }
                    />
                  </div>

                  <ConfirmDialog
                    title="Remove time slot?"
                    description="Are you sure you want to remove this time slot?"
                    onConfirm={() => removeRegularHours(index)}
                  >
                    <Button type="button" variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </ConfirmDialog>
                </div>
              </Card>
            ))}
          </div>
        )}

        <Separator />

        {/* Exceptional Openings */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Exceptional Openings</h4>
              <p className="text-sm text-muted-foreground">
                Special dates when the location is open
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addExceptionalPeriod('exceptionalOpenings')}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Opening
            </Button>
          </div>

          {(localValue.exceptionalOpenings || []).map((period, index) => (
            <Card key={index} className="p-4">
              <div className="flex items-center gap-4">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className={cn(
                        'justify-start text-left font-normal flex-1',
                        !period.periodBegin && 'text-muted-foreground',
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {period.periodBegin && period.periodEnd ? (
                        <>
                          {format(new Date(period.periodBegin), 'LLL dd, y')} -{' '}
                          {format(new Date(period.periodEnd), 'LLL dd, y')}
                        </>
                      ) : (
                        'Pick a date range'
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="range"
                      selected={{
                        from: period.periodBegin
                          ? new Date(period.periodBegin)
                          : undefined,
                        to: period.periodEnd
                          ? new Date(period.periodEnd)
                          : undefined,
                      }}
                      onSelect={(range) =>
                        updateExceptionalPeriod(
                          'exceptionalOpenings',
                          index,
                          range,
                        )
                      }
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>

                <ConfirmDialog
                  title="Remove exceptional opening?"
                  description="Are you sure you want to remove this exceptional opening?"
                  onConfirm={() =>
                    removeExceptionalPeriod('exceptionalOpenings', index)
                  }
                >
                  <Button type="button" variant="ghost" size="icon">
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </ConfirmDialog>
              </div>
            </Card>
          ))}
        </div>

        <Separator />

        {/* Exceptional Closings */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Exceptional Closings</h4>
              <p className="text-sm text-muted-foreground">
                Special dates when the location is closed
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addExceptionalPeriod('exceptionalClosings')}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Closing
            </Button>
          </div>

          {(localValue.exceptionalClosings || []).map((period, index) => (
            <Card key={index} className="p-4">
              <div className="flex items-center gap-4">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className={cn(
                        'justify-start text-left font-normal flex-1',
                        !period.periodBegin && 'text-muted-foreground',
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {period.periodBegin && period.periodEnd ? (
                        <>
                          {format(new Date(period.periodBegin), 'LLL dd, y')} -{' '}
                          {format(new Date(period.periodEnd), 'LLL dd, y')}
                        </>
                      ) : (
                        'Pick a date range'
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="range"
                      selected={{
                        from: period.periodBegin
                          ? new Date(period.periodBegin)
                          : undefined,
                        to: period.periodEnd
                          ? new Date(period.periodEnd)
                          : undefined,
                      }}
                      onSelect={(range) =>
                        updateExceptionalPeriod(
                          'exceptionalClosings',
                          index,
                          range,
                        )
                      }
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>

                <ConfirmDialog
                  title="Remove exceptional closing?"
                  description="Are you sure you want to remove this exceptional closing?"
                  onConfirm={() =>
                    removeExceptionalPeriod('exceptionalClosings', index)
                  }
                >
                  <Button type="button" variant="ghost" size="icon">
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </ConfirmDialog>
              </div>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
