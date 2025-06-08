// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

export class FieldPath {
  private readonly _keyPath: (string | number)[];
  private readonly _namePath: (string | number)[];

  private constructor(
    namePath: string | number | (string | number)[],
    keyPath: string | number | (string | number)[],
  ) {
    this._keyPath = Array.isArray(keyPath) ? [...keyPath] : [keyPath];
    this._namePath = Array.isArray(namePath) ? [...namePath] : [namePath];
  }

  get key(): string {
    return this._keyPath.join('-');
  }

  get keyPath(): (string | number)[] {
    return [...this._keyPath];
  }

  get name(): string {
    return this._namePath.join('-');
  }

  get namePath(): (string | number)[] {
    return [...this._namePath];
  }

  with(keyName: string | number) {
    return new FieldPath(
      [...this._namePath, keyName],
      [...this._keyPath, keyName],
    );
  }

  withName(name: string | number): FieldPath {
    return new FieldPath([...this._namePath, name], [...this._keyPath]);
  }

  withKey(key: string | number): FieldPath {
    return new FieldPath([...this._namePath], [...this._keyPath, key]);
  }

  clearNamePath(): FieldPath {
    return new FieldPath([], [...this._keyPath]);
  }

  popName(): FieldPath {
    return new FieldPath(
      [...this._namePath.slice(0, this.namePath.length - 1)],
      [...this._keyPath],
    );
  }

  pop(): FieldPath {
    return new FieldPath(
      [...this._namePath.slice(0, this.namePath.length - 1)],
      [...this._keyPath.slice(0, this._keyPath.length - 1)],
    );
  }

  static empty(): FieldPath {
    return new FieldPath([], []);
  }
}
