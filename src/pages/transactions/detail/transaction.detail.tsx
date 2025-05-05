import { Card, Flex, Select, Tabs, TabsProps, Table } from 'antd';
import { useMemo, useState, useCallback } from 'react';
import { useTable } from '@refinedev/antd';
import { useParams } from 'react-router-dom';
import { useList, useNavigation, useOne } from '@refinedev/core';
import { ResourceType } from '../../../resource-type';
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
import { MeasurandEnumType, ReadingContextEnumType } from '@OCPP2_0_1';
import { findOverallValue } from '../../../dtos/meter.value.dto';
import { TransactionDetailCard } from './transaction.detail.card';
import { EnergyOverTime } from '../chart/energy.over.time';

enum ChartType {
  POWER = 'Power Over Time',
  ENERGY = 'Energy Over Time',
  SOC = 'State of Charge Over Time',
}

export const TransactionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { goBack, push } = useNavigation();
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

  const generateReadingContextOptions = () => {
    const enumValues = Object.values(ReadingContextEnumType);

    return enumValues.map((value) => (
      <Select.Option key={value} value={value}>
        {value}
      </Select.Option>
    ));
  };

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

  if (isLoading) return <p>Loading...</p>;
  if (!transaction) return <p>No Data Found</p>;

  const tabItems: TabsProps['items'] = [
    {
      key: '1',
      label: 'Authorizations',
      children: (
        <Table rowKey="id" {...tableProps}>
          {authColumns}
        </Table>
      ),
    },
    {
      key: '2',
      label: 'Meter Value Data',
      children: (
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
            {generateReadingContextOptions()}
          </Select>

          <Flex gap={32}>
            <Flex vertical flex={1} gap={16}>
              <Select
                className="full-width"
                value={selectedChartLeft}
                onChange={(value) => setSelectedChartLeft(value as ChartType)}
              >
                <Select.Option value={ChartType.POWER}>
                  {ChartType.POWER}
                </Select.Option>
                <Select.Option value={ChartType.ENERGY}>
                  {ChartType.ENERGY}
                </Select.Option>
                <Select.Option value={ChartType.SOC}>
                  {ChartType.SOC}
                </Select.Option>
              </Select>
              <Flex style={{ aspectRatio: '1 / 1', maxHeight: 400 }}>
                {selectedChartLeft === ChartType.POWER ? (
                  <PowerOverTime
                    meterValues={meterValues}
                    validContexts={validContexts}
                  />
                ) : selectedChartLeft === ChartType.ENERGY ? (
                  <EnergyOverTime
                    meterValues={meterValues}
                    validContexts={validContexts}
                  />
                ) : selectedChartLeft === ChartType.SOC ? (
                  <StateOfCharge
                    meterValues={meterValues}
                    validContexts={validContexts}
                  />
                ) : (
                  <div>No data available for selected chart</div>
                )}
              </Flex>
            </Flex>

            <Flex vertical flex={1} gap={16}>
              <Select
                className="full-width"
                value={selectedChartRight}
                onChange={(value) => setSelectedChartRight(value as ChartType)}
              >
                <Select.Option value={ChartType.POWER}>
                  {ChartType.POWER}
                </Select.Option>
                <Select.Option value={ChartType.ENERGY}>
                  {ChartType.ENERGY}
                </Select.Option>
                <Select.Option value={ChartType.SOC}>
                  {ChartType.SOC}
                </Select.Option>
              </Select>
              <Flex style={{ aspectRatio: '1 / 1', maxHeight: 400 }}>
                {selectedChartRight === ChartType.POWER ? (
                  <PowerOverTime
                    meterValues={meterValues}
                    validContexts={validContexts}
                  />
                ) : selectedChartRight === ChartType.ENERGY ? (
                  <EnergyOverTime
                    meterValues={meterValues}
                    validContexts={validContexts}
                  />
                ) : selectedChartRight === ChartType.SOC ? (
                  <StateOfCharge
                    meterValues={meterValues}
                    validContexts={validContexts}
                  />
                ) : (
                  <div>No data available for selected chart</div>
                )}
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      ),
    },
    {
      key: '3',
      label: 'Events',
      children: (
        <TransactionEventsList transactionDatabaseId={transaction.id} />
      ),
    },
  ];

  return (
    <div style={{ padding: '16px' }}>
      <Card className="transaction-details">
        <TransactionDetailCard transaction={transaction} />
      </Card>
      <Card>
        <Tabs defaultActiveKey="1" items={tabItems} />
      </Card>
    </div>
  );
};