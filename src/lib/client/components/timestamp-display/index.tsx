// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { Badge } from '@lib/client/components/ui/badge';
import { format as dateFnsFormat } from 'date-fns';
import React from 'react';

interface TimestampDisplayProps {
  isoTimestamp: string | Date;
  format?: string; // Date format to display (default: 'yyyy-MM-dd HH:mm:ss')
}

const defaultDateFormat = 'yyyy-MM-dd HH:mm:ss';

export const TimestampDisplay: React.FC<TimestampDisplayProps> = ({
  isoTimestamp,
  format = defaultDateFormat,
}) => {
  const formattedTimestamp = formatDate(isoTimestamp, format);

  return <Badge variant="muted">{formattedTimestamp}</Badge>;
};

export const formatDate = (
  isoTimestamp: string | Date | undefined,
  format = defaultDateFormat,
) => {
  if (!isoTimestamp) {
    return 'N/A';
  }
  return dateFnsFormat(new Date(isoTimestamp), format);
};
