// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import React, { useMemo, useState, FC } from 'react';
import {
  DatePicker,
  Spin,
  Card,
  Checkbox,
  Select,
  Typography,
  Flex,
} from 'antd';
import { useList } from '@refinedev/core';
import dayjs, { Dayjs } from 'dayjs';
import { getPlainToInstanceOptions } from '@util/tables';
import { MeterValueDto } from '../../../dtos/meter.value.dto';
import { TransactionDto } from '../../../dtos/transaction.dto';
import {
  GET_TRANSACTION_LIST_FOR_STATION,
  GET_METER_VALUES_FOR_STATION,
} from '../../../message/queries';
import {
  PowerOverTime,
  StateOfCharge,
  EnergyOverTime,
  VoltageOverTime,
  CurrentOverTime,
} from '../../transactions/chart';
import { ReadingContextEnumType } from '@OCPP2_0_1';
import { ResourceType } from '@util/auth';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { Text } = Typography;

enum ChartType {
  POWER = 'Power Over Time',
  ENERGY = 'Energy Over Time',
  SOC = 'State of Charge Over Time',
  VOLTAGE = 'Voltage Over Time',
  CURRENT = 'Current Over Time',
}

const allContexts = [
  ReadingContextEnumType.Transaction_Begin,
  ReadingContextEnumType.Sample_Periodic,
  ReadingContextEnumType.Transaction_End,
];

const filterByDate = (series: MeterValueDto[], [s, e]: [Dayjs, Dayjs]) =>
  series.filter((mv) => {
    const ts = dayjs(mv.timestamp);
    return (ts.isAfter(s) || ts.isSame(s)) && (ts.isBefore(e) || ts.isSame(e));
  });

interface ChartPanelProps {
  series: MeterValueDto[];
  contexts: ReadingContextEnumType[];
  onContextsChange: (vals: ReadingContextEnumType[]) => void;
  selected: ChartType;
  onSelect: (c: ChartType) => void;
  allTime: boolean;
  onToggleAllTime: (v: boolean) => void;
  range: [Dayjs, Dayjs];
  onRangeChange: (r: [Dayjs, Dayjs]) => void;
}

const ChartPanel: FC<ChartPanelProps> = ({
  series,
  contexts,
  onContextsChange,
  selected,
  onSelect,
  allTime,
  onToggleAllTime,
  range,
  onRangeChange,
}) => {
  const data = allTime ? series : filterByDate(series, range);
  const ChartElement = useMemo(() => {
    switch (selected) {
      case ChartType.ENERGY:
        return <EnergyOverTime meterValues={data} validContexts={contexts} />;
      case ChartType.SOC:
        return <StateOfCharge meterValues={data} validContexts={contexts} />;
      case ChartType.VOLTAGE:
        return <VoltageOverTime meterValues={data} validContexts={contexts} />;
      case ChartType.CURRENT:
        return <CurrentOverTime meterValues={data} validContexts={contexts} />;
      default:
        return <PowerOverTime meterValues={data} validContexts={contexts} />;
    }
  }, [data, contexts, selected]);

  return (
    <Card
      style={{ flex: 1, display: 'flex', flexDirection: 'column', height: 650 }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          marginBottom: 16,
        }}
      >
        <Checkbox
          checked={allTime}
          onChange={(e) => onToggleAllTime(e.target.checked)}
        >
          All Time
        </Checkbox>
        {!allTime && (
          <RangePicker
            value={range}
            onChange={(d) => d && d[0] && d[1] && onRangeChange([d[0], d[1]])}
            style={{ width: '100%' }}
          />
        )}
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
        <Text>Chart Type:</Text>
        <Select
          value={selected}
          onChange={(v) => onSelect(v as ChartType)}
          style={{ width: '100%' }}
        >
          {Object.values(ChartType).map((c) => (
            <Option key={c} value={c}>
              {c}
            </Option>
          ))}
        </Select>
      </div>
      <Flex style={{ aspectRatio: '1 / 1', maxHeight: 400, width: '100%' }}>
        {ChartElement}
      </Flex>
    </Card>
  );
};

export const AggregatedMeterValuesData: FC<{ stationId: string }> = ({
  stationId,
}) => {
  const { data: txData, isLoading: txLoading } = useList<TransactionDto>({
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

  const { data: mvData, isLoading: mvLoading } = useList<MeterValueDto>({
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
  const [selL, setSelL] = useState<ChartType>(ChartType.POWER);
  const [allL, setAllL] = useState(true);
  const [rngL, setRngL] = useState(defaultRange);
  const [ctxL, setCtxL] = useState<ReadingContextEnumType[]>(allContexts);

  const [selR, setSelR] = useState<ChartType>(ChartType.ENERGY);
  const [allR, setAllR] = useState(true);
  const [rngR, setRngR] = useState(defaultRange);
  const [ctxR, setCtxR] = useState<ReadingContextEnumType[]>(allContexts);

  if (txLoading || mvLoading)
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 32 }}>
        <Spin size="large" />
      </div>
    );

  return (
    <div style={{ display: 'flex', gap: 32 }}>
      <ChartPanel
        series={series}
        selected={selL}
        onSelect={setSelL}
        allTime={allL}
        onToggleAllTime={setAllL}
        range={rngL}
        onRangeChange={setRngL}
        contexts={ctxL}
        onContextsChange={setCtxL}
      />
      <ChartPanel
        series={series}
        selected={selR}
        onSelect={setSelR}
        allTime={allR}
        onToggleAllTime={setAllR}
        range={rngR}
        onRangeChange={setRngR}
        contexts={ctxR}
        onContextsChange={setCtxR}
      />
    </div>
  );
};
