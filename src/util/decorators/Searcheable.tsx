// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

export const SEARCHABLE = 'searchable';

export const Searchable = () => {
  return (target: any, key: string) => {
    const existingSearchableKeys: Set<string> =
      Reflect.getMetadata(SEARCHABLE, target.constructor) || new Set<string>();
    existingSearchableKeys.add(key);
    Reflect.defineMetadata(
      SEARCHABLE,
      existingSearchableKeys,
      target.constructor,
    );
  };
};

export const isSearchable = (target: any, key: string): boolean => {
  if (!target || !key) return false;
  const searchableKeys = getSearchableKeys(target);
  return searchableKeys.has(key);
};

export const getSearchableKeys = (target: any): Set<string> => {
  if (!target) return new Set<string>();
  return Reflect.getMetadata(SEARCHABLE, target) || new Set<string>();
};
