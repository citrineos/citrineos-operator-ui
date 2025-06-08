// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { isNullOrUndefined } from '@util/assertion';
import { FieldPath } from './fieldpath';

export type SupportedUnknownType = 'string' | 'number' | 'boolean';

export type UnknownEntry = {
  name?: string;
  type?: SupportedUnknownType;
};

export class Unknowns {
  private readonly entries: { [key: string]: UnknownEntry[] };

  private constructor(entries: { [key: string]: UnknownEntry[] }) {
    this.entries = entries;
  }

  findAll(path: FieldPath): UnknownEntry[] {
    return [...(this.entries[path.key] || [])];
  }

  findFirst(path: FieldPath): UnknownEntry | undefined {
    return this.find(path, 0);
  }

  find(path: FieldPath, index: number): UnknownEntry | undefined {
    if (isNullOrUndefined(this.entries[path.key])) {
      return undefined;
    }
    return {
      ...this.entries[path.key][index],
    };
  }

  registerFirst(path: FieldPath) {
    const key = path.key;

    return new Unknowns({
      ...this.entries,
      [key]: [{} as UnknownEntry],
    });
  }

  registerLast(path: FieldPath) {
    const key = path.key;

    return new Unknowns({
      ...this.entries,
      [key]: [...(this.entries[key] || []), {} as UnknownEntry],
    });
  }

  updateFirst(path: FieldPath, values: Partial<UnknownEntry>) {
    return this.update(path, 0, values);
  }

  update(path: FieldPath, index: number, values: Partial<UnknownEntry>) {
    const key = path.key;

    return new Unknowns({
      ...this.entries,
      [key]: this.entries[key].map((entry, i) =>
        i === index ? { ...entry, ...values } : entry,
      ),
    });
  }

  remove(path: FieldPath, index: number) {
    const key = path.key;

    return new Unknowns({
      ...this.entries,
      [key]: this.entries[key].filter((_, i) => i !== index),
    });
  }

  override(entries: { [key: string]: UnknownEntry[] }): Unknowns {
    return new Unknowns({
      ...this.entries,
      ...entries,
    });
  }

  static empty() {
    return new Unknowns({});
  }
}

export type UnknownsActions = {
  [K in keyof Unknowns]: ReturnType<Unknowns[K]> extends Unknowns ? K : never;
}[keyof Unknowns];
