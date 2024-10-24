import { BaseRecord, useCustom } from '@refinedev/core';
import { DocumentNode, OperationDefinitionNode } from 'graphql';

interface UseGqlCustomProps {
  gqlQuery: DocumentNode;
  variables?: Record<string, any>;
}

const getOperationNameFromQuery = (
  gqlQuery: DocumentNode,
): string | undefined => {
  const operationDef = gqlQuery.definitions.find(
    (def) => def.kind === 'OperationDefinition',
  ) as OperationDefinitionNode | undefined;
  return operationDef?.name?.value;
};

export const useGqlCustom = <T extends BaseRecord>({
  gqlQuery,
  variables,
}: UseGqlCustomProps) => {
  const operation = getOperationNameFromQuery(gqlQuery);

  if (!operation) {
    throw new Error(
      'Operation name could not be inferred from the GraphQL query.',
    );
  }

  return useCustom<T>({
    url: import.meta.env.VITE_API_URL,
    method: 'post',
    config: {
      headers: {
        'Content-Type': 'application/json',
      },
    },
    meta: {
      operation,
      gqlQuery,
      variables,
    },
  });
};
