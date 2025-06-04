// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

export const CLASS_GQL_EDIT_MUTATION = 'classGqlEditMutation';

export const ClassGqlEditMutation = (mutation: any): ClassDecorator => {
  return (target: Function) => {
    Reflect.defineMetadata(CLASS_GQL_EDIT_MUTATION, mutation, target.prototype);
  };
};
