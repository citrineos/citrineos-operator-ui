// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { Card, Flex, Select, Tabs, TabsProps, Table } from 'antd';
import { useMemo, useState } from 'react';
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
import {
  PowerOverTime,
  StateOfCharge,
  EnergyOverTime,
  VoltageOverTime,
  CurrentOverTime,
} from '../chart';
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
import { ReadingContextEnumType } from '@OCPP2_0_1';
import { TransactionDetailCard } from './transaction.detail.card';
import { renderEnumSelectOptions } from '@util/renderUtil';
import { BaseDtoProps } from '@citrineos/base';
import { ITransactionDto } from '@citrineos/base';
import { IMeterValueDto, MeterValueDtoProps } from '@citrineos/base';

enum ChartType {
  POWER = 'Power Over Time',
  ENERGY = 'Energy Over Time',
  SOC = 'State of Charge Over Time',
  VOLTAGE = 'Voltage Over Time',
  CURRENT = 'Current Over Time',
}

export const TransactionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { push } = useNavigation();
  const [selectedChartLeft, setSelectedChartLeft] = useState<ChartType>(
    ChartType.POWER,
  );
  const [selectedChartRight, setSelectedChartRight] = useState<ChartType>(
    ChartType.ENERGY,
  );

  const [validContexts, setValidContexts] = useState<ReadingContextEnumType[]>([
    ReadingContextEnumType.Transaction_Begin,
    ReadingContextEnumType.Sample_Periodic,
    ReadingContextEnumType.Transaction_End,
  ]);

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

  const renderChartSelect = (
    selectedChart: ChartType,
    onChange: (value: ChartType) => void,
  ) => (
    <Select
      className="full-width"
      value={selectedChart}
      onChange={(value) => onChange(value as ChartType)}
    >
      {(Object.values(ChartType) as ChartType[]).map((chart) => (
        <Select.Option key={chart} value={chart}>
          {chart}
        </Select.Option>
      ))}
    </Select>
  );

  const renderChartContent = (selectedChart: ChartType) => (
    <Flex style={{ aspectRatio: '1 / 1', maxHeight: 400 }}>
      {(() => {
        switch (selectedChart) {
          case ChartType.POWER:
            return (
              <PowerOverTime
                meterValues={meterValues}
                validContexts={validContexts}
              />
            );
          case ChartType.ENERGY:
            return (
              <EnergyOverTime
                meterValues={meterValues}
                validContexts={validContexts}
              />
            );
          case ChartType.SOC:
            return (
              <StateOfCharge
                meterValues={meterValues}
                validContexts={validContexts}
              />
            );
          case ChartType.VOLTAGE:
            return (
              <VoltageOverTime
                meterValues={meterValues}
                validContexts={validContexts}
              />
            );
          case ChartType.CURRENT:
            return (
              <CurrentOverTime
                meterValues={meterValues}
                validContexts={validContexts}
              />
            );
          default:
            return <div>No data available for selected chart</div>;
        }
      })()}
    </Flex>
  );

  if (isLoading) return <p>Loading...</p>;
  if (!transaction) return <p>No Data Found</p>;

  const tabItems: TabsProps['items'] = [
    {
      key: '1',
      label: 'Authorizations',
      children: (
        <CanAccess
          resource={ResourceType.AUTHORIZATIONS}
          action={ActionType.LIST}
          fallback={<AccessDeniedFallback />}
        >
          <Table rowKey="id" {...tableProps}>
            {authColumns}
          </Table>
        </CanAccess>
      ),
    },
    {
      key: '2',
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
          <Flex vertical gap={32} style={{ paddingTop: 32 }}>
            <Select
              mode="multiple"
              className="full-width"
              style={{ width: '100%' }}
              value={validContexts}
              onChange={(vals) =>
                setValidContexts(vals as ReadingContextEnumType[])
              }
            >
              {renderEnumSelectOptions(ReadingContextEnumType)}
            </Select>

            <Flex gap={32}>
              <Flex vertical flex={1} gap={16}>
                {renderChartSelect(selectedChartLeft, setSelectedChartLeft)}
                {renderChartContent(selectedChartLeft)}
              </Flex>

              <Flex vertical flex={1} gap={16}>
                {renderChartSelect(selectedChartRight, setSelectedChartRight)}
                {renderChartContent(selectedChartRight)}
              </Flex>
            </Flex>
          </Flex>
        </CanAccess>
      ),
    },
    {
      key: '3',
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
      <div style={{ padding: '16px' }}>
        <Card className="transaction-details">
          <TransactionDetailCard transaction={transaction} />
        </Card>
        <Card>
          <Tabs defaultActiveKey="1" items={tabItems} />
        </Card>
      </div>
    </CanAccess>
  );
};
