// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0
'use client';

import { Table } from '@lib/client/components/table';
import { getAuthorizationColumns } from '@lib/client/pages/authorizations/columns';
import { AuthorizationClass } from '@lib/cls/authorization.dto';
import { AUTHORIZATIONS_LIST_QUERY } from '@lib/queries/authorizations';
import { ResourceType } from '@lib/utils/access.types';
import { getPlainToInstanceOptions } from '@lib/utils/tables';
import { useRouter } from 'next/navigation';
import React, { useMemo } from 'react';

interface PartnerAuthorizationsProps {
  partnerId: number;
}

export const PartnerAuthorizations: React.FC<PartnerAuthorizationsProps> = ({
  partnerId,
}) => {
  const { push } = useRouter();

  const columns = useMemo(() => getAuthorizationColumns(push), [push]);

  return (
    <Table
      refineCoreProps={{
        resource: ResourceType.AUTHORIZATIONS,
        meta: {
          gqlQuery: AUTHORIZATIONS_LIST_QUERY,
        },
        filters: {
          permanent: [
            {
              field: 'tenantPartnerId',
              operator: 'eq',
              value: partnerId,
            },
          ],
        },
        queryOptions: getPlainToInstanceOptions(AuthorizationClass),
      }}
      enableSorting
      enableFilters
      showHeader
    >
      {columns}
    </Table>
  );
};
