// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { Popover, Tag } from 'antd';
import { IDDisplayProps } from '@interfaces';
import { DefaultColors } from '@enums';

export const TruncateDisplay: React.FC<IDDisplayProps> = ({
  id,
  startLength = 4,
  endLength = 4,
  color = DefaultColors.CYAN, // Default color
}) => {
  const truncatedID = getTruncatedId(id, startLength, endLength);

  return (
    <Popover content={id}>
      <Tag color={color} style={{ cursor: 'pointer' }}>
        {truncatedID}
      </Tag>
    </Popover>
  );
};

function getTruncatedId(id: string, startLength: number, endLength: number) {
  if (id === undefined || id === null) {
    return '';
  }
  if (startLength + endLength >= id.length) {
    return id;
  }
  return `${id.substring(0, startLength)}...${id.substring(id.length - endLength)}`;
}
