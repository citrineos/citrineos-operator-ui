// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { Typography } from 'antd';
import moment from 'moment';

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

  return <Typography.Text>{formattedTimestamp}</Typography.Text>;
};

export const formatDate = (
  isoTimestamp: string | Date | undefined,
  format = defaultDateFormat,
) => {
  if (!isoTimestamp) {
    return 'N/A';
  }
  return moment(isoTimestamp).format(format);
};
