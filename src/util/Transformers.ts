// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { Transform } from 'class-transformer';

export function ToClass<T>(transformer: (value: T) => any) {
  return Transform(({ value }) => transformer(value), {
    toClassOnly: true,
  });
}

export function ToPlain<T>(transformer: (value: T) => any) {
  return Transform(({ value }) => transformer(value), {
    toPlainOnly: true,
  });
}
