// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import React, { useMemo, useState, FC } from 'react';
import { DatePicker, Spin, Select, Typography, Flex, Row, Col } from 'antd';
import { useList } from '@refinedev/core';
import dayjs, { Dayjs } from 'dayjs';
import { getPlainToInstanceOptions } from '@util/tables';
import { MeterValueDto } from '../../../dtos/meter.value.dto';
import { TransactionDto } from '../../../dtos/transaction.dto';
import {
  GET_TRANSACTION_LIST_FOR_STATION,
  GET_METER_VALUES_FOR_STATION,
} from '../../../message/queries';
import { ReadingContextEnumType } from '@OCPP2_0_1';
import { ResourceType } from '@util/auth';
import { ITransactionDto } from '@citrineos/base';
import { IMeterValueDto } from '@citrineos/base';
import { ChartsWrapper } from '../../transactions/chart/charts.wrapper';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { Text } = Typography;

const allContexts = [
  ReadingContextEnumType.Transaction_Begin,
  ReadingContextEnumType.Sample_Periodic,
  ReadingContextEnumType.Transaction_End,
];

const filterByDate = (series: IMeterValueDto[], [s, e]: [Dayjs, Dayjs]) =>
  series.filter((mv) => {
    const ts = dayjs(mv.timestamp);
    return (ts.isAfter(s) || ts.isSame(s)) && (ts.isBefore(e) || ts.isSame(e));
  });

interface ChartPanelProps {
  series: IMeterValueDto[];
  contexts: ReadingContextEnumType[];
  onContextsChange: (vals: ReadingContextEnumType[]) => void;
  range: [Dayjs, Dayjs];
  onRangeChange: (r: [Dayjs, Dayjs]) => void;
}

const ChartPanel: FC<ChartPanelProps> = ({
  series,
  contexts,
  onContextsChange,
  range,
  onRangeChange,
}) => {
  const data = filterByDate(series, range);

  return (
    <Flex vertical gap={16}>
      <Row gutter={16}>
        <Col span={8}>
          <Flex vertical gap={8}>
            <Text>Time Range:</Text>
            <RangePicker
              value={range}
              onChange={(d) => d && d[0] && d[1] && onRangeChange([d[0], d[1]])}
              style={{ width: '100%' }}
            />
          </Flex>
        </Col>
        <Col span={16}>
          <Flex vertical gap={8}>
            <Text>Contexts:</Text>
            <Select
              mode="multiple"
              style={{ width: '100%' }}
              value={contexts}
              onChange={(v) => onContextsChange(v as ReadingContextEnumType[])}
            >
              {allContexts.map((ctx) => (
                <Option key={ctx} value={ctx}>
                  {ctx}
                </Option>
              ))}
            </Select>
          </Flex>
        </Col>
      </Row>
      <ChartsWrapper meterValues={data} validContexts={contexts} />
    </Flex>
  );
};

export const AggregatedMeterValuesData: FC<{ stationId: string }> = ({
  stationId,
}) => {
  const { data: txData, isLoading: txLoading } = useList<ITransactionDto>({
    resource: ResourceType.TRANSACTIONS,
    meta: {
      gqlQuery: GET_TRANSACTION_LIST_FOR_STATION,
      gqlVariables: {
        stationId,
        limit: 10000,
        offset: 0,
        order_by: { createdAt: 'asc' },
      },
    },
    queryOptions: getPlainToInstanceOptions(TransactionDto, true),
  });
  const txIds = useMemo(() => txData?.data.map((tx) => tx.id) ?? [], [txData]);

  const { data: mvData, isLoading: mvLoading } = useList<IMeterValueDto>({
    resource: ResourceType.METER_VALUES,
    meta: {
      gqlQuery: GET_METER_VALUES_FOR_STATION,
      gqlVariables: { transactionDatabaseIds: txIds, limit: 10000, offset: 0 },
    },
    queryOptions: getPlainToInstanceOptions(MeterValueDto, true),
  });
  const series = mvData?.data ?? [];

  const defaultRange: [Dayjs, Dayjs] = [
    dayjs().subtract(7, 'day').startOf('day'),
    dayjs().endOf('day'),
  ];
  const [range, setRange] = useState(defaultRange);
  const [contexts, setContexts] =
    useState<ReadingContextEnumType[]>(allContexts);

  if (txLoading || mvLoading)
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 32 }}>
        <Spin size="large" />
      </div>
    );

  return (
    <ChartPanel
      series={series}
      range={range}
      onRangeChange={setRange}
      contexts={contexts}
      onContextsChange={setContexts}
    />
  );
};
