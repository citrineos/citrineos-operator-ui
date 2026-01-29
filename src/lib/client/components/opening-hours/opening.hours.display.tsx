// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0
'use client';

import { Card, CardContent, CardHeader } from '@lib/client/components/ui/card';
import { Badge } from '@lib/client/components/ui/badge';
import { Separator } from '@lib/client/components/ui/separator';
import type { LocationHours } from '@citrineos/base';
import { Clock, Calendar } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { NOT_APPLICABLE } from '@lib/utils/consts';

interface OpeningHoursDisplayProps {
  openingHours?: LocationHours | null;
}

const WEEKDAY_NAMES = [
  '', // 0 index unused
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

export const OpeningHoursDisplay: React.FC<OpeningHoursDisplayProps> = ({
  openingHours,
}) => {
  if (!openingHours) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center gap-2 py-3">
          <Clock className="h-4 w-4" />
          <span className="font-medium">Opening Hours</span>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{NOT_APPLICABLE}</p>
        </CardContent>
      </Card>
    );
  }

  const {
    twentyfourSeven,
    regularHours,
    exceptionalOpenings,
    exceptionalClosings,
  } = openingHours;

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const date = new Date();
    date.setHours(parseInt(hours, 10), parseInt(minutes, 10));
    return format(date, 'h:mm a');
  };

  const formatDateRange = (start: Date | string, end: Date | string) => {
    const startDate = typeof start === 'string' ? parseISO(start) : start;
    const endDate = typeof end === 'string' ? parseISO(end) : end;

    if (format(startDate, 'yyyy-MM-dd') === format(endDate, 'yyyy-MM-dd')) {
      return format(startDate, 'MMM d, yyyy');
    }

    return `${format(startDate, 'MMM d, yyyy')} - ${format(endDate, 'MMM d, yyyy')}`;
  };

  // Group regular hours by weekday and sort
  const sortedRegularHours = (regularHours || [])
    .slice()
    .sort((a, b) => a.weekday - b.weekday);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2 py-3">
        <Clock className="h-4 w-4" />
        <span className="font-medium">Opening Hours</span>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 24/7 Status */}
        {twentyfourSeven ? (
          <div className="space-y-2">
            <Badge variant="success" className="text-sm px-3 py-1">
              24/7 Operation
            </Badge>
            <p className="text-sm text-muted-foreground">
              This location is open 24 hours a day, 7 days a week
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Regular Hours */}
            <div>
              <h4 className="font-medium mb-3">Regular Hours</h4>
              {sortedRegularHours.length > 0 ? (
                <div className="space-y-2">
                  {sortedRegularHours.map((hours, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center py-1"
                    >
                      <span className="font-medium">
                        {WEEKDAY_NAMES[hours.weekday]}
                      </span>
                      <span className="text-muted-foreground">
                        {formatTime(hours.periodBegin)} -{' '}
                        {formatTime(hours.periodEnd)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">
                  No regular hours specified
                </p>
              )}
            </div>
          </div>
        )}

        {/* Exceptional Openings */}
        {(exceptionalOpenings?.length || 0) > 0 && (
          <>
            <Separator />
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="h-4 w-4" />
                <h4 className="font-medium">Exceptional Openings</h4>
              </div>
              <div className="space-y-2">
                {exceptionalOpenings?.map((period, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Badge variant="default">Special Opening</Badge>
                    <span className="text-sm">
                      {formatDateRange(period.periodBegin, period.periodEnd)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Exceptional Closings */}
        {(exceptionalClosings?.length || 0) > 0 && (
          <>
            <Separator />
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="h-4 w-4" />
                <h4 className="font-medium">Exceptional Closings</h4>
              </div>
              <div className="space-y-2">
                {exceptionalClosings?.map((period, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Badge variant="destructive">Closed</Badge>
                    <span className="text-sm">
                      {formatDateRange(period.periodBegin, period.periodEnd)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
