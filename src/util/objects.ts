// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

export function getProperty(object: any, path: (string | number)[]): any {
  return path.reduce((acc, key) => acc && acc[key], object);
}

export function setProperty(
  object: any,
  path: (string | number)[],
  value: any,
): void {
  path.reduce((acc, key, index) => {
    if (index === path.length - 1) {
      acc[key] = value;
    }
    if (typeof acc[key] !== 'object' || acc[key] === null) {
      acc[key] = typeof path[index + 1] === 'number' ? [] : {};
    }
    return acc[key];
  }, object);
}

export function omitProperties<T extends object>(
  object: T,
  propertiesToFilter: (keyof T)[],
): Partial<T> {
  return (Object.keys(object) as (keyof T)[])
    .filter((key) => !propertiesToFilter.includes(key))
    .reduce((result, key) => {
      result[key] = object[key];
      return result;
    }, {} as Partial<T>);
}
