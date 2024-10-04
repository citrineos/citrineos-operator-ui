export function isNullOrUndefined(object: any): object is null | undefined {
    return object === undefined || object === null;
}

export function isDefined<T>(object: T | undefined | null): object is T {
  return object !== undefined && object !== null;
}
