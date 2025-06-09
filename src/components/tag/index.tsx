// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { Tag } from 'antd';
import { DefaultColors } from '@enums';

const getColorForIndex = (index: number, customColors?: string[]) => {
  const colors =
    customColors && customColors.length
      ? customColors
      : Object.values(DefaultColors);
  return colors[index % colors.length];
};

const hashStringToColorIndex = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash); // Simple hash function
  }
  return Math.abs(hash);
};

interface GenericTagProps<T extends Record<string, string | number>> {
  enumValue?: T[keyof T];
  stringValue?: string;
  enumType?: T;
  colorMap?: { [key in keyof T]?: string };
  customColors?: string[];
  icon?: React.ReactNode;
}

const GenericTag = <T extends Record<string, string | number>>({
  enumValue,
  stringValue,
  enumType,
  colorMap = {},
  customColors,
  icon,
}: GenericTagProps<T>) => {
  let displayValue: string;
  let color: string;

  if (enumType && enumValue !== undefined) {
    const valueKey = Object.keys(enumType).find(
      (key) => enumType[key] === enumValue,
    ) as keyof T;

    const enumKeys = Object.keys(enumType);
    const enumIndex = enumKeys.indexOf(valueKey as string);
    color = colorMap[valueKey] || getColorForIndex(enumIndex, customColors);
    displayValue = String(valueKey);
  } else if (stringValue) {
    const colorIndex = hashStringToColorIndex(stringValue);
    color = getColorForIndex(colorIndex, customColors);
    displayValue = stringValue;
  } else {
    return null;
  }

  return (
    <Tag color={color}>
      {displayValue}
      {icon && <span style={{ marginLeft: 5 }}>{icon}</span>}
    </Tag>
  );
};

export default GenericTag;
