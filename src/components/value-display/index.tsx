// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { Popover, Tag } from 'antd';
import { DefaultColors } from '@enums';
import { ValueDisplayProps } from '@interfaces';

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
          {renderedPrefix}
          {roundedValue}
          {renderedSuffix}
        </pre>
      </Tag>
    </Popover>
  );
};
