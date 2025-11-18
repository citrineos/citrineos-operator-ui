// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { Badge } from '@lib/client/components/ui/badge';
import { cn } from '@lib/utils/cn';
import { DefaultColors } from '@lib/utils/enums';
import React from 'react';

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
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
};

// Map Ant Design colors to Tailwind classes
const colorClassMap: Record<string, string> = {
  cyan: 'bg-cyan-100 text-cyan-800 border-cyan-200',
  purple: 'bg-purple-100 text-purple-800 border-purple-200',
  blue: 'bg-blue-100 text-blue-800 border-blue-200',
  green: 'bg-green-100 text-green-800 border-green-200',
  red: 'bg-red-100 text-red-800 border-red-200',
  orange: 'bg-orange-100 text-orange-800 border-orange-200',
  yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  pink: 'bg-pink-100 text-pink-800 border-pink-200',
  magenta: 'bg-fuchsia-100 text-fuchsia-800 border-fuchsia-200',
  volcano: 'bg-orange-100 text-orange-800 border-orange-200',
  gold: 'bg-amber-100 text-amber-800 border-amber-200',
  lime: 'bg-lime-100 text-lime-800 border-lime-200',
  geekblue: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  default: 'bg-gray-100 text-gray-800 border-gray-200',
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

  const colorClass = colorClassMap[color] || colorClassMap.default;

  return (
    <Badge variant="outline" className={cn(colorClass)}>
      {displayValue}
      {icon && <span className="ml-1.5">{icon}</span>}
    </Badge>
  );
};

export default GenericTag;
