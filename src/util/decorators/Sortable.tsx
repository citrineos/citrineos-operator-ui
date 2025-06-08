// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

export const SORTABLE = 'sortable';

export const Sortable = () => {
  return (target: any, key: string) => {
    const existingSortableKeys: Set<string> =
      Reflect.getMetadata(SORTABLE, target.constructor) || new Set<string>();
    existingSortableKeys.add(key);
    Reflect.defineMetadata(SORTABLE, existingSortableKeys, target.constructor);
  };
};

export const isSortable = (target: any, key: string): boolean => {
  if (!target || !key) return false;
  const sortableKeys = getSortableKeys(target);
  return sortableKeys.has(key);
};

export const getSortableKeys = (target: any): Set<string> => {
  if (!target) return new Set<string>();
  return Reflect.getMetadata(SORTABLE, target) || new Set<string>();
};
