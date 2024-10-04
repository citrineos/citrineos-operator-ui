import React from 'react';
import { Popover, Tag } from 'antd';
import { DefaultColors } from '../tag';

interface ValueDisplayProps {
  value: number | null | undefined;
  precision?: number; // Number of decimal places to round to
  prefix?: string; // Text to display before the value
  suffix?: string; // Text to display after the value
  color?: DefaultColors; // Color of the Tag
}

export const ValueDisplay: React.FC<ValueDisplayProps> = ({
  value,
  precision = 2,
  prefix = '',
  suffix = '',
  color = DefaultColors.LIME,
}) => {
  if (!value) {
    return <span>N/A</span>;
  }
  // Round the value to the specified precision
  const roundedValue = value.toFixed(precision);

  return (
    <Popover content={value}>
      <Tag color={color} style={{ cursor: 'pointer' }}>
        <pre style={{ margin: 0 }}>
          {prefix} {roundedValue} {suffix}
        </pre>
      </Tag>
    </Popover>
  );
};
