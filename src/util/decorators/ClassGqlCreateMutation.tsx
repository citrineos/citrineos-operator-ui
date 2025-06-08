// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { DocumentNode } from 'graphql';

export const CLASS_GQL_CREATE_MUTATION = 'classGqlCreateMutation';

export interface MutationAndGetVariables {
  mutation: DocumentNode;
  getVariables?: (record: any) => any;
}

export const ClassGqlCreateMutation = (
  mutation: DocumentNode | MutationAndGetVariables,
): ClassDecorator => {
  const isGqlType =
    mutation && typeof mutation === 'object' && 'loc' in mutation;
  let mutationAndGetVariables;
  if (isGqlType) {
    mutationAndGetVariables = {
      mutation,
    };
  } else {
    mutationAndGetVariables = mutation;
  }
  return (target: Function) => {
    Reflect.defineMetadata(
      CLASS_GQL_CREATE_MUTATION,
      mutationAndGetVariables,
      target.prototype,
    );
  };
};
