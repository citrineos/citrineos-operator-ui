// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0
'use client';

import { MenuSection } from '@lib/client/components/main-menu/main.menu';
import { Table } from '@lib/client/components/table';
import { Button } from '@lib/client/components/ui/button';
import {
  getAuthorizationColumns,
  getAuthorizationFilters,
} from '@lib/client/pages/authorizations/columns';
import { AuthorizationClass } from '@lib/cls/authorization.dto';
import { AUTHORIZATIONS_LIST_QUERY } from '@lib/queries/authorizations';
import { ActionType, ResourceType } from '@lib/utils/access.types';
import { AccessDeniedFallback } from '@lib/utils/AccessDeniedFallback';
import { DEFAULT_SORTERS, EMPTY_FILTER } from '@lib/utils/consts';
import { getPlainToInstanceOptions } from '@lib/utils/tables';
import { CanAccess } from '@refinedev/core';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { heading2Style, pageMargin } from '@lib/client/styles/page';
import {
  tableHeaderWrapperFlex,
  tableSearchFlex,
  tableWrapperStyle,
} from '@lib/client/styles/table';
import { buttonIconSize } from '@lib/client/styles/icon';
import type { AuthorizationDto } from '@citrineos/base';
import { DebounceSearch } from '@lib/client/components/debounce-search';

export const AuthorizationsList = () => {
  const { push } = useRouter();
  const [filters, setFilters] = useState<any>(EMPTY_FILTER);

  const columns = useMemo(() => getAuthorizationColumns(push), [push]);

  const onSearch = (value: string) => {
    setFilters(value ? getAuthorizationFilters(value) : EMPTY_FILTER);
  };

  return (
    <div className={`${pageMargin} ${tableWrapperStyle}`}>
      <div className={tableHeaderWrapperFlex}>
        <h2 className={heading2Style}>Authorizations</h2>
        <div className={tableSearchFlex}>
          <CanAccess
            resource={ResourceType.AUTHORIZATIONS}
            action={ActionType.CREATE}
          >
            <Button
              variant="success"
              onClick={() => push(`/${MenuSection.AUTHORIZATIONS}/new`)}
            >
              <Plus className={buttonIconSize} />
              Add Authorization
            </Button>
          </CanAccess>
          <DebounceSearch
            onSearch={onSearch}
            placeholder="Search Authorizations"
          />
        </div>
      </div>
      <CanAccess
        resource={ResourceType.AUTHORIZATIONS}
        action={ActionType.LIST}
        fallback={<AccessDeniedFallback />}
      >
        <Table<AuthorizationDto>
          refineCoreProps={{
            resource: ResourceType.AUTHORIZATIONS,
            sorters: DEFAULT_SORTERS,
            filters: {
              permanent: filters,
            },
            meta: {
              gqlQuery: AUTHORIZATIONS_LIST_QUERY,
            },
            queryOptions: {
              ...getPlainToInstanceOptions(AuthorizationClass),
              select: (data: any) => {
                return data;
              },
            },
          }}
          enableSorting
          enableFilters
          showHeader
        >
          {columns}
        </Table>
      </CanAccess>
    </div>
  );
};
