// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { useSelect } from '@refinedev/core';
import { VARIABLE_LIST_BY_COMPONENT_QUERY } from '@lib/queries/variables';
import { ResourceType } from '@lib/utils/access.types';

export const useComponentVariables = (
  componentId: number | null,
  mutability?: string,
) => {
  const { options, onSearch, query } = useSelect({
    resource: ResourceType.VARIABLES,
    optionLabel: 'name',
    optionValue: 'name',
    meta: {
      gqlQuery: VARIABLE_LIST_BY_COMPONENT_QUERY,
      gqlVariables: componentId
        ? {
            componentId,
            offset: 0,
            limit: 100,
            mutability: mutability || '',
          }
        : undefined,
    },
    pagination: { mode: 'off' },
    queryOptions: {
      enabled: !!componentId && componentId > 0,
    },
  });

  return {
    options: componentId ? options : [],
    onSearch,
    query,
    isLoading: query.isLoading,
  };
};
