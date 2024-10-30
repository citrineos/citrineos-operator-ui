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
  prefix = null,
  suffix = null,
  color = DefaultColors.LIME,
}) => {
  if (!value) {
    return <></>;
  }
  // Round the value to the specified precision
  const roundedValue = value.toFixed(precision);
  const renderedPrefix = prefix ? `${prefix} ` : '';
  const renderedSuffix = suffix ? ` ${suffix}` : '';

  return (
    <Popover content={value}>
      <Tag color={color} style={{ cursor: 'pointer' }}>
        <pre style={{ margin: 0 }}>
          {renderedPrefix}{roundedValue}{renderedSuffix}
        </pre>
      </Tag>
    </Popover>
  );
};
