// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import React, { useMemo } from 'react';
import { Table } from 'antd';
import { useTable } from '@refinedev/antd';
import { useNavigation } from '@refinedev/core';
import { ResourceType } from '@util/auth';
import { getPlainToInstanceOptions } from '@util/tables';
import { AUTHORIZATIONS_LIST_QUERY } from '../../authorizations/queries';
import { AuthorizationDto } from '../../../dtos/authorization.dto';
import { getAuthorizationColumns } from '../../authorizations/columns';

interface PartnerAuthorizationsProps {
  partnerId: number;
}

export const PartnerAuthorizations: React.FC<PartnerAuthorizationsProps> = ({
  partnerId,
}) => {
  const { push } = useNavigation();

  const { tableProps } = useTable<AuthorizationDto>({
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
    queryOptions: getPlainToInstanceOptions(AuthorizationDto),
  });

  const columns = useMemo(() => getAuthorizationColumns(push), [push]);

  return (
    <Table rowKey="id" {...tableProps}>
      {columns}
    </Table>
  );
};
