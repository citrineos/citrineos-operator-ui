// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback, useMemo } from 'react';
import { Button, Col, GetProps, Input, Row, Table } from 'antd';
import { useTable } from '@refinedev/antd';
import { CanAccess, useNavigation } from '@refinedev/core';
import { AccessDeniedFallback, ActionType, ResourceType } from '@util/auth';
import { DebounceSearch } from '../../../components/debounce-search';
import { EMPTY_FILTER } from '@util/consts';
import { getPlainToInstanceOptions } from '@util/tables';
import { AUTHORIZATIONS_LIST_QUERY } from '../queries';
import { AuthorizationDto } from '../../../dtos/authoriation.dto';
import { getAuthorizationFilters, getAuthorizationColumns } from '../columns';
import './style.scss';
import { DEFAULT_SORTERS } from '../../../components/defaults';
import { MenuSection } from '../../../components/main-menu/main.menu';
import { PlusIcon } from '../../../components/icons/plus.icon';

type SearchProps = GetProps<typeof Input.Search>;

export const AuthorizationsList: React.FC = () => {
  const { push } = useNavigation();

  const { tableProps, setFilters } = useTable<AuthorizationDto>({
    resource: ResourceType.AUTHORIZATIONS,
    sorters: DEFAULT_SORTERS,
    meta: { gqlQuery: AUTHORIZATIONS_LIST_QUERY },
    queryOptions: getPlainToInstanceOptions(AuthorizationDto),
  });

  const onSearch: SearchProps['onSearch'] = useCallback(
    (value: string) => {
      if (!value) setFilters(EMPTY_FILTER);
      else setFilters(getAuthorizationFilters(value));
    },
    [setFilters],
  );

  const columns = useMemo(() => getAuthorizationColumns(push), [push]);

  return (
    <CanAccess
      resource={ResourceType.AUTHORIZATIONS}
      action={ActionType.LIST}
      fallback={<AccessDeniedFallback />}
    >
      <Col className="authorizations-list">
        <Row justify="space-between" align="middle" className="header-row">
          <h2>Authorizations</h2>
          <Row>
            <Button
              type="primary"
              style={{ marginRight: '20px' }}
              onClick={() => push(`/${MenuSection.AUTHORIZATIONS}/new`)}
            >
              Add New Authorization
              <PlusIcon />
            </Button>
            <DebounceSearch
              onSearch={onSearch}
              placeholder="Search Authorizations"
            />
          </Row>
        </Row>
        <Table rowKey="id" {...tableProps}>
          {columns}
        </Table>
      </Col>
    </CanAccess>
  );
};
