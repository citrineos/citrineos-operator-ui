import React from 'react';
import dayjs from 'dayjs';
import { Typography } from 'antd';

interface TimestampDisplayProps {
  isoTimestamp: string | Date;
  format?: string; // Date format to display (default: 'YYYY-MM-DD HH:mm:ss')
}

export const TimestampDisplay: React.FC<TimestampDisplayProps> = ({
  isoTimestamp,
  format = 'YYYY-MM-DD HH:mm:ss',
}) => {
  const formattedTimestamp = dayjs(isoTimestamp).format(format);

  return <Typography.Text>{formattedTimestamp}</Typography.Text>;
};
