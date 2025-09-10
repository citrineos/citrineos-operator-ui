// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { Button, Flex, Table } from 'antd';
import React, { useMemo } from 'react';
import { PARTNERS_LIST_QUERY } from '../queries';
import { useTable } from '@refinedev/antd';
import { DEFAULT_SORTERS } from '../../../components/defaults';
import { PlusIcon } from '../../../components/icons/plus.icon';
import { CanAccess, useNavigation } from '@refinedev/core';
import { getPlainToInstanceOptions } from '@util/tables';
import { getPartnersColumns } from '../columns';
import { MenuSection } from '../../../components/main-menu/main.menu';
import { AccessDeniedFallback, ActionType, ResourceType } from '@util/auth';
import { ITenantPartnerDto } from '@citrineos/base';
import { TenantPartnerDto } from '../../../dtos/tenant.partner.dto';

export const PartnersList = () => {
  const { push } = useNavigation();

  const { tableProps } = useTable<ITenantPartnerDto>({
    resource: ResourceType.PARTNERS,
    sorters: DEFAULT_SORTERS,
    meta: {
      gqlQuery: PARTNERS_LIST_QUERY,
    },
    queryOptions: {
      ...getPlainToInstanceOptions(TenantPartnerDto),
      select: (data: any) => {
        return data;
      },
    },
  });

  const columns = useMemo(() => getPartnersColumns(push), []);

  return (
    <Flex vertical>
      <Flex justify="space-between" align="middle" className="header-row">
        <h2>Partners</h2>
        <Flex>
          <CanAccess
            resource={ResourceType.PARTNERS}
            action={ActionType.CREATE}
          >
            <Button
              type="primary"
              style={{ marginRight: '20px' }}
              onClick={() => push(`/${MenuSection.PARTNERS}/new`)}
            >
              Add New Partner
              <PlusIcon />
            </Button>
          </CanAccess>
        </Flex>
      </Flex>
      <CanAccess
        resource={ResourceType.PARTNERS}
        action={ActionType.LIST}
        fallback={<AccessDeniedFallback />}
      >
        <Table rowKey="id" {...tableProps} showHeader={true}>
          {columns}
        </Table>
      </CanAccess>
    </Flex>
  );
};
