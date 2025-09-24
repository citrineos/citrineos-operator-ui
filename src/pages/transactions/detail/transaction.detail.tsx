// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import React, { useMemo } from 'react';
import { Card, Tabs, TabsProps, Table } from 'antd';
import { useTable } from '@refinedev/antd';
import { useParams } from 'react-router-dom';
import { CanAccess, useList, useNavigation, useOne } from '@refinedev/core';
import { getPlainToInstanceOptions } from '@util/tables';
import {
  TRANSACTION_GET_QUERY,
  GET_TRANSACTIONS_BY_AUTHORIZATION,
} from '../queries';
import { TransactionDto } from '../../../dtos/transaction.dto';
import './style.scss';
import { TransactionEventsList } from '../../transaction-events/list/transaction.events.list';
import { GET_METER_VALUES_FOR_TRANSACTION } from '../../meter-values/queries';
import { MeterValueDto } from '../../../dtos/meter.value.dto';
import { AuthorizationDto } from '../../../dtos/authorization.dto';
import { getAuthorizationColumns } from '../../authorizations/columns';
import {
  ResourceType,
  ActionType,
  AccessDeniedFallback,
  TransactionAccessType,
} from '@util/auth';
import { TransactionDetailCard } from './transaction.detail.card';
import { BaseDtoProps } from '@citrineos/base';
import { ITransactionDto } from '@citrineos/base';
import { IMeterValueDto, MeterValueDtoProps } from '@citrineos/base';
import { ChartsWrapper } from '../chart/charts.wrapper';

export const TransactionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { push } = useNavigation();

  const { data: transactionData, isLoading } = useOne<ITransactionDto>({
    resource: ResourceType.TRANSACTIONS,
    id,
    meta: { gqlQuery: TRANSACTION_GET_QUERY },
    queryOptions: getPlainToInstanceOptions(TransactionDto, true),
  });
  const transaction = transactionData?.data;

  const { data: meterValuesData } = useList<IMeterValueDto>({
    resource: ResourceType.METER_VALUES,
    meta: {
      gqlQuery: GET_METER_VALUES_FOR_TRANSACTION,
      gqlVariables: { limit: 10000, transactionDatabaseId: Number(id) },
    },
    sorters: [{ field: MeterValueDtoProps.timestamp, order: 'asc' }],
    queryOptions: getPlainToInstanceOptions(MeterValueDto),
  });
  const meterValues = meterValuesData?.data ?? [];

  const authorization = transaction?.authorization;

  const { tableProps } = useTable<AuthorizationDto>({
    resource: ResourceType.AUTHORIZATIONS,
    sorters: { permanent: [{ field: BaseDtoProps.updatedAt, order: 'desc' }] },
    meta: {
      gqlQuery: GET_TRANSACTIONS_BY_AUTHORIZATION,
      gqlVariables: { id: authorization?.id, limit: 10000 },
    },
    queryOptions: getPlainToInstanceOptions(),
  });

  const authColumns = useMemo(() => getAuthorizationColumns(push), [push]);

  if (isLoading) return <p>Loading...</p>;
  if (!transaction) return <p>No Data Found</p>;

  const tabItems: TabsProps['items'] = [
    {
      key: '1',
      label: 'Meter Value Data',
      children: (
        <CanAccess
          resource={ResourceType.TRANSACTIONS}
          action={ActionType.ACCESS}
          fallback={<AccessDeniedFallback />}
          params={{
            id: transaction.id,
            accessType: TransactionAccessType.EVENTS,
          }}
        >
          <ChartsWrapper meterValues={meterValues} />
        </CanAccess>
      ),
    },
    {
      key: '2',
      label: 'Events',
      children: (
        <CanAccess
          resource={ResourceType.TRANSACTIONS}
          action={ActionType.ACCESS}
          fallback={<AccessDeniedFallback />}
          params={{
            id: transaction.id,
            accessType: TransactionAccessType.EVENTS,
          }}
        >
          <TransactionEventsList transactionDatabaseId={transaction.id} />{' '}
        </CanAccess>
      ),
    },
  ];

  return (
    <CanAccess
      resource={ResourceType.TRANSACTIONS}
      action={ActionType.SHOW}
      fallback={<AccessDeniedFallback />}
      params={{ id: transaction.id }}
    >
      <div>
        <Card>
          <TransactionDetailCard transaction={transaction} />
        </Card>
        <Card>
          <Tabs defaultActiveKey="1" items={tabItems} />
        </Card>
      </div>
    </CanAccess>
  );
};
