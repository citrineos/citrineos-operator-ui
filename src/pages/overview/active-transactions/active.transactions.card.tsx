// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { AutoComplete, Flex } from 'antd';
import { CanAccess, useList, useNavigation } from '@refinedev/core';
import {
  TransactionDto,
  TransactionDtoProps,
} from '../../../dtos/transaction.dto';
import { TRANSACTION_LIST_QUERY } from '../../transactions/queries';
import { BaseDtoProps } from '../../../dtos/base.dto';
import { getPlainToInstanceOptions } from '@util/tables';
import { useSelect } from '@refinedev/antd';
import React from 'react';
import { ArrowRightIcon } from '../../../components/icons/arrow.right.icon';
import { MenuSection } from '../../../components/main-menu/main.menu';
import { ActionType, ResourceType } from '@util/auth';

export const ActiveTransactionsCard = () => {
  const { push } = useNavigation();

  const { data, isLoading, isError } = useList<TransactionDto>({
    resource: ResourceType.TRANSACTIONS,
    meta: {
      gqlQuery: TRANSACTION_LIST_QUERY,
      gqlVariables: {
        offset: 0,
        limit: 3,
        where: { isActive: { _eq: true } },
      },
    },
    queryOptions: getPlainToInstanceOptions(TransactionDto),
    sorters: [{ field: BaseDtoProps.updatedAt, order: 'desc' }],
    pagination: {
      mode: 'off',
    },
  });

  const { selectProps: activeTransactionSelectProps } =
    useSelect<TransactionDto>({
      resource: ResourceType.TRANSACTIONS,
      optionLabel: (transaction) => transaction.transactionId,
      optionValue: (transaction) => `${transaction.id}`,
      meta: {
        gqlQuery: TRANSACTION_LIST_QUERY,
        gqlVariables: {
          offset: 0,
          limit: 5,
          where: { isActive: { _eq: true } },
        },
      },
      sorters: [{ field: BaseDtoProps.updatedAt, order: 'desc' }],
      pagination: { mode: 'off' },
      onSearch: (value) => [
        {
          operator: 'and',
          value: [
            {
              field: TransactionDtoProps.transactionId,
              operator: 'contains',
              value,
            },
          ],
        },
      ],
    });

  const transactions = data?.data ?? [];
  const total = data?.total ?? 0;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Something went wrong!</div>;
  }

  return (
    <CanAccess resource={ResourceType.TRANSACTIONS} action={ActionType.LIST}>
      <Flex vertical>
        <Flex justify="space-between">
          <h4>Active Transactions ({total})</h4>
          <Flex
            className="link"
            onClick={() => push(`/${MenuSection.TRANSACTIONS}`)}
          >
            View all <ArrowRightIcon />
          </Flex>
        </Flex>
        <Flex style={{ padding: '24px 0' }}>
          <Flex flex={7}>
            <AutoComplete
              className="full-width"
              onSelect={(id) => push(`/${MenuSection.TRANSACTIONS}/${id}`)}
              filterOption={false}
              placeholder="Search Transaction"
              {...activeTransactionSelectProps}
            />
          </Flex>
          <Flex flex={3}>
            <span></span>
          </Flex>
        </Flex>
        <Flex vertical>
          {transactions.map((transaction) => (
            <Flex
              vertical
              style={{ marginBottom: '16px' }}
              key={transaction.id}
            >
              <Flex
                justify="space-between"
                onClick={() =>
                  push(`/${MenuSection.TRANSACTIONS}/${transaction.id}`)
                }
              >
                <span className="link">{transaction.transactionId}</span>
              </Flex>
              <Flex>Station ID: {transaction.stationId}</Flex>
              <Flex>Total kWh: {transaction.totalKwh}</Flex>
              <Flex>Total Time: {transaction.timeSpentCharging}</Flex>
              <Flex>Status: {transaction.chargingState}</Flex>
            </Flex>
          ))}
        </Flex>
      </Flex>
    </CanAccess>
  );
};
