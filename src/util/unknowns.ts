// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

export function Unknown(value: unknown): unknown {
  return value;
}
export function UnknownType(target: object, propertyKey: string | symbol) {
  Reflect.metadata('design:type', Unknown)(target, propertyKey);
}

export function UnknownProperty(value: unknown): unknown {
  return value;
}
export function UnknownPropertyType(
  target: object,
  propertyKey: string | symbol,
) {
  Reflect.metadata('design:type', UnknownProperty)(target, propertyKey);
}

export function UnknownProperties(properties: { [k: string]: unknown }): {
  [k: string]: unknown;
} {
  return properties;
}
export function UnknownPropertiesType(
  target: object,
  propertyKey: string | symbol,
) {
  Reflect.metadata('design:type', UnknownProperties)(target, propertyKey);
}
