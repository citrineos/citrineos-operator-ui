// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

export const CLASS_CUSTOM_CONSTRUCTOR = 'classCustomConstructor';

export const ClassCustomConstructor = (
  constructorFunction: Function,
): ClassDecorator => {
  return (target: Function) => {
    Reflect.defineMetadata(
      CLASS_CUSTOM_CONSTRUCTOR,
      constructorFunction,
      target.prototype,
    );
  };
};
