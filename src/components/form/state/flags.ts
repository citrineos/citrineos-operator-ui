export class Flags {
  private readonly _flags: {
    [key: string]: boolean;
  };

  private constructor(flags: { [key: string]: boolean } = {}) {
    this._flags = { ...flags };
  }

  toggle(key: string): Flags {
    return new Flags({
      ...this._flags,
      [key]: !this._flags[key],
    });
  }

  isEnabled(key: string): boolean {
    return this._flags[key];
  }

  enable(key: string): Flags {
    return new Flags({
      ...this._flags,
      [key]: true,
    });
  }

  static empty() {
    return new Flags({});
  }
}
