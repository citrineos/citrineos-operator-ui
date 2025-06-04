// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

export const CLASS_GQL_DELETE_MUTATION = 'classGqlDeleteMutation';

export const ClassGqlDeleteMutation = (mutation: any): ClassDecorator => {
  return (target: Function) => {
    Reflect.defineMetadata(
      CLASS_GQL_DELETE_MUTATION,
      mutation,
      target.prototype,
    );
  };
};
