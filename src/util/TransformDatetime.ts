// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import dayjs, { Dayjs, isDayjs } from 'dayjs';
import { ToClass, ToPlain } from './Transformers';
import { isNullOrUndefined } from './assertion';

export default function TransformDatetime() {
  return function (target: any, key: string) {
    ToPlain<Date | null>(dateToPlain)(target, key);
    ToClass<Date | Dayjs | null>(parseDate)(target, key);
  };
}

export function dateToPlain(value: Date | null) {
  if (isNullOrUndefined(value)) {
    return null;
  }
  return value.toISOString();
}

/**
 * Parses the given value into a Dayjs object.
 *
 * Handles various types of inputs:
 * - If the input is `null`, it returns `null`
 * - If the input is already a `Dayjs` object (typically coming from Antd forms), it returns that object
 * - If the input is a `Date` object (typically coming from API responses), it converts it into a Dayjs object using dayjs()
 */
export function parseDate(value: Date | Dayjs | null): Dayjs | null {
  if (isNullOrUndefined(value)) {
    return null;
  }
  if (isDayjs(value)) {
    return value;
  }
  return dayjs(value);
}
