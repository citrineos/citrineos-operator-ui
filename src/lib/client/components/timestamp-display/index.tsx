// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { Badge } from '@lib/client/components/ui/badge';
import moment from 'moment';
import React from 'react';

interface TimestampDisplayProps {
  isoTimestamp: string | Date;
  format?: string; // Date format to display (default: 'YYYY-MM-DD HH:mm:ss')
}

const defaultDateFormat = 'YYYY-MM-DD HH:mm:ss';

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
  return moment(isoTimestamp).local().format(format);
};
