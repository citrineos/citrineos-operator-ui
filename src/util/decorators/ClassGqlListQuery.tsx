// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

export const CLASS_GQL_LIST_QUERY = 'classGqlListQuery';

export const ClassGqlListQuery = (gqlQuery: any): ClassDecorator => {
  return (target: Function) => {
    Reflect.defineMetadata(CLASS_GQL_LIST_QUERY, gqlQuery, target.prototype);
  };
};
