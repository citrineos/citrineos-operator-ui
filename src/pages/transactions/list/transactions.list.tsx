// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { Col, GetProps, Input, Row, Table } from 'antd';
import React, { useMemo } from 'react';
import { TRANSACTION_LIST_QUERY } from '../queries';
import { useTable } from '@refinedev/antd';
import { AccessDeniedFallback, ActionType, ResourceType } from '@util/auth';
import { getPlainToInstanceOptions } from '@util/tables';
import { TransactionDto } from '../../../dtos/transaction.dto';
import { DEFAULT_SORTERS } from '../../../components/defaults';
import { CanAccess, useNavigation } from '@refinedev/core';
import { DebounceSearch } from '../../../components/debounce-search';
import { EMPTY_FILTER } from '@util/consts';
import { getTransactionsFilters, getTransactionColumns } from '../columns';

type SearchProps = GetProps<typeof Input.Search>;

export const TransactionsList = () => {
  const { push } = useNavigation();

  const { tableProps, setFilters } = useTable<TransactionDto>({
    resource: ResourceType.TRANSACTIONS,
    sorters: DEFAULT_SORTERS,
    meta: {
      gqlQuery: TRANSACTION_LIST_QUERY,
    },
    queryOptions: getPlainToInstanceOptions(TransactionDto),
  });

  const onSearch: SearchProps['onSearch'] = (value, _e?, _info?) => {
    if (!value || value === '') {
      setFilters(EMPTY_FILTER);
    } else {
      setFilters(getTransactionsFilters(value));
    }
  };

  const columns = useMemo(() => getTransactionColumns(push), [push]);

  return (
    <CanAccess
      resource={ResourceType.TRANSACTIONS}
      action={ActionType.LIST}
      fallback={<AccessDeniedFallback />}
    >
      <Col className="transactions-list">
        <Row justify="space-between" align="middle" className="header-row">
          <h2>Transactions</h2>
          <Row>
            <DebounceSearch
              onSearch={onSearch}
              placeholder="Search Transactions"
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
