import { Card, Flex, Select, Tabs, TabsProps, Table } from 'antd';
import { useMemo, useState, useCallback } from 'react';
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
import { BaseDtoProps } from '../../../dtos/base.dto';
import { PowerOverTime } from '../chart/power.over.time';
import { StateOfCharge } from '../chart/state.of.charge';
import { TransactionEventsList } from '../../transaction-events/list/transaction.events.list';
import { GET_METER_VALUES_FOR_TRANSACTION } from '../../meter-values/queries';
import {
  MeterValueDto,
  MeterValueDtoProps,
} from '../../../dtos/meter.value.dto';
import { AuthorizationDto } from '../../../dtos/authoriation.dto';
import { getAuthorizationColumns } from '../../../pages/authorizations/columns';
import { MeasurandEnumType } from '@OCPP2_0_1';
import { findOverallValue } from '../../../dtos/meter.value.dto';
import {
  ResourceType,
  ActionType,
  AccessDeniedFallback,
  TransactionAccessType,
} from '@util/auth';
import { TransactionDetailCard } from './transaction.detail.card';

enum ChartType {
  POWER = 'power',
  SOC = 'soc',
}

export const TransactionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { push } = useNavigation();
  const [selectedChartLeft, setSelectedChartLeft] = useState<ChartType>(
    ChartType.POWER,
  );
  const [selectedChartRight, setSelectedChartRight] = useState<ChartType>(
    ChartType.SOC,
  );

  const { data: transactionData, isLoading } = useOne<TransactionDto>({
    resource: ResourceType.TRANSACTIONS,
    id,
    meta: { gqlQuery: TRANSACTION_GET_QUERY },
    queryOptions: getPlainToInstanceOptions(TransactionDto, true),
  });
  const transaction = transactionData?.data;

  const { data: meterValuesData } = useList<MeterValueDto>({
    resource: ResourceType.METER_VALUES,
    meta: {
      gqlQuery: GET_METER_VALUES_FOR_TRANSACTION,
      gqlVariables: { limit: 10000, transactionDatabaseId: Number(id) },
    },
    sorters: [{ field: MeterValueDtoProps.timestamp, order: 'asc' }],
    queryOptions: getPlainToInstanceOptions(MeterValueDto),
  });
  const meterValues = meterValuesData?.data ?? [];

  let idTokenDatabaseId =
    transaction?.transactionEvents && transaction.transactionEvents.length > 0
      ? transaction.transactionEvents[0].idTokenId
      : transaction?.startTransaction?.idTokenDatabaseId;
  idTokenDatabaseId = Number(idTokenDatabaseId) || null;

  const { tableProps } = useTable<AuthorizationDto>({
    resource: ResourceType.AUTHORIZATIONS,
    sorters: { permanent: [{ field: BaseDtoProps.updatedAt, order: 'desc' }] },
    filters: {
      permanent: [
        {
          field: 'IdToken.id',
          operator: 'eq',
          value: idTokenDatabaseId,
        },
      ],
    },
    meta: {
      gqlQuery: GET_TRANSACTIONS_BY_AUTHORIZATION,
      gqlVariables: { limit: 10000 },
    },
    queryOptions: getPlainToInstanceOptions(AuthorizationDto, true),
  });

  const authColumns = useMemo(() => getAuthorizationColumns(push), [push]);

  const handleChartChangeLeft = useCallback(
    (value: ChartType) => setSelectedChartLeft(value),
    [],
  );
  const handleChartChangeRight = useCallback(
    (value: ChartType) => setSelectedChartRight(value),
    [],
  );

  if (isLoading) return <p>Loading...</p>;
  if (!transaction) return <p>No Data Found</p>;

  const hasSOCData = meterValues.some((mv) =>
    findOverallValue(mv.sampledValue, MeasurandEnumType.SoC),
  );
  const hasPowerData = meterValues.some((mv) =>
    findOverallValue(mv.sampledValue, MeasurandEnumType.Power_Active_Import),
  );

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
          <Flex gap={32} style={{ paddingTop: 32 }}>
            <Flex vertical flex={1} gap={16}>
              <Select
                className={'full-width'}
                value={selectedChartLeft}
                onChange={(value) => setSelectedChartLeft(value as ChartType)}
              >
                {hasPowerData && (
                  <Select.Option value={ChartType.POWER}>
                    Power Over Time
                  </Select.Option>
                )}
                {hasSOCData && (
                  <Select.Option value={ChartType.SOC}>
                    State of Charge
                  </Select.Option>
                )}
              </Select>
              <Flex style={{ aspectRatio: '1 / 1', maxHeight: 400 }}>
                {selectedChartLeft === ChartType.POWER && hasPowerData ? (
                  <PowerOverTime meterValues={meterValues} />
                ) : selectedChartLeft === ChartType.SOC && hasSOCData ? (
                  <StateOfCharge meterValues={meterValues} />
                ) : (
                  <div>No data available for selected chart</div>
                )}
              </Flex>
            </Flex>
            <Flex
              vertical
              flex={1}
              gap={16}
              style={{ aspectRatio: '1 / 1', maxHeight: 400 }}
            >
              <Select
                className={'full-width'}
                value={selectedChartRight}
                onChange={(value) => setSelectedChartRight(value as ChartType)}
              >
                {hasPowerData && (
                  <Select.Option value={ChartType.POWER}>
                    Power Over Time
                  </Select.Option>
                )}
                {hasSOCData && (
                  <Select.Option value={ChartType.SOC}>
                    State of Charge
                  </Select.Option>
                )}
              </Select>
              <Flex style={{ aspectRatio: '1 / 1', maxHeight: 400 }}>
                {selectedChartRight === ChartType.POWER && hasPowerData ? (
                  <PowerOverTime meterValues={meterValues} />
                ) : selectedChartRight === ChartType.SOC && hasSOCData ? (
                  <StateOfCharge meterValues={meterValues} />
                ) : (
                  <div>No data available for selected chart</div>
                )}
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
