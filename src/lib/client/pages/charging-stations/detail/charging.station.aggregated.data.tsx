// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import {
  type MeterValueDto,
  type TransactionDto,
  OCPP2_0_1,
} from '@citrineos/base';
import { RangePicker } from '@lib/client/components/range-picker';
import { Card, CardContent } from '@lib/client/components/ui/card';
import { Checkbox } from '@lib/client/components/ui/checkbox';
import { LoadingIcon } from '@lib/client/components/ui/loading';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@lib/client/components/ui/select';
import { CurrentOverTime } from '@lib/client/pages/transactions/chart/current.over.time';
import { EnergyOverTime } from '@lib/client/pages/transactions/chart/energy.over.time';
import { PowerOverTime } from '@lib/client/pages/transactions/chart/power.over.time';
import { StateOfCharge } from '@lib/client/pages/transactions/chart/state.of.charge';
import { VoltageOverTime } from '@lib/client/pages/transactions/chart/voltage.over.time';
import { MeterValueClass } from '@lib/cls/meter.value.dto';
import { TransactionClass } from '@lib/cls/transaction.dto';
import { GET_METER_VALUES_FOR_STATION } from '@lib/queries/meter.values';
import { GET_TRANSACTION_LIST_FOR_STATION } from '@lib/queries/transactions';
import { ResourceType } from '@lib/utils/access.types';
import { getPlainToInstanceOptions } from '@lib/utils/tables';
import { useList } from '@refinedev/core';
import {
  endOfDay,
  isAfter,
  isBefore,
  isSameDay,
  parseISO,
  startOfDay,
  subDays,
} from 'date-fns';
import type { FC } from 'react';
import { useMemo, useState } from 'react';
import { type DateRange } from 'react-day-picker';

enum ChartType {
  POWER = 'Power Over Time',
  ENERGY = 'Energy Over Time',
  SOC = 'State of Charge Over Time',
  VOLTAGE = 'Voltage Over Time',
  CURRENT = 'Current Over Time',
}

const allContexts = [
  OCPP2_0_1.ReadingContextEnumType.Transaction_Begin,
  OCPP2_0_1.ReadingContextEnumType.Sample_Periodic,
  OCPP2_0_1.ReadingContextEnumType.Transaction_End,
];

const filterByDate = (
  series: MeterValueDto[],
  range: DateRange | undefined,
) => {
  if (!range?.from || !range?.to) return series;

  return series.filter((mv) => {
    const ts = parseISO(mv.timestamp);
    const isAfterOrSameStart =
      isAfter(ts, range.from!) || isSameDay(ts, range.from!);
    const isBeforeOrSameEnd =
      isBefore(ts, range.to!) || isSameDay(ts, range.to!);
    return isAfterOrSameStart && isBeforeOrSameEnd;
  });
};

interface ChartPanelProps {
  series: MeterValueDto[];
  contexts: OCPP2_0_1.ReadingContextEnumType[];
  onContextsChange: (vals: OCPP2_0_1.ReadingContextEnumType[]) => void;
  selected: ChartType;
  onSelect: (c: ChartType) => void;
  allTime: boolean;
  onToggleAllTime: (v: boolean) => void;
  dateRange: DateRange | undefined;
  setDateRange: (r: DateRange) => void;
}

const ChartPanel: FC<ChartPanelProps> = ({
  series,
  contexts,
  onContextsChange,
  selected,
  onSelect,
  allTime,
  onToggleAllTime,
  dateRange,
  setDateRange,
}) => {
  const data = allTime ? series : filterByDate(series, dateRange);
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
    <Card className="flex-1 flex flex-col" style={{ height: 650 }}>
      <CardContent className="flex flex-col gap-4 p-6">
        <div className="flex items-center gap-2">
          <Checkbox
            checked={allTime}
            onCheckedChange={(checked) => onToggleAllTime(checked as boolean)}
          />
          <label className="text-sm font-medium">All Time</label>
        </div>
        {!allTime && (
          <div className="space-y-2">
            <RangePicker dateRange={dateRange} setDateRange={setDateRange} />
          </div>
        )}
        <div className="space-y-2">
          <label className="text-sm font-medium">Contexts:</label>
          <Select
            value={contexts.join(',')}
            onValueChange={(v) =>
              onContextsChange(
                v.split(',') as OCPP2_0_1.ReadingContextEnumType[],
              )
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {allContexts.map((ctx) => (
                <SelectItem key={ctx} value={ctx}>
                  {ctx}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Chart Type:</label>
          <Select
            value={selected}
            onValueChange={(v) => onSelect(v as ChartType)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.values(ChartType).map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="aspect-square max-h-[400px] w-full">{ChartElement}</div>
      </CardContent>
    </Card>
  );
};

export const AggregatedMeterValuesData: FC<{ stationId: string }> = ({
  stationId,
}) => {
  const {
    query: { data: txData, isLoading: txLoading },
  } = useList<TransactionDto>({
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
    queryOptions: getPlainToInstanceOptions(TransactionClass, true),
  });
  const txIds = useMemo(() => txData?.data.map((tx) => tx.id) ?? [], [txData]);

  const {
    query: { data: mvData, isLoading: mvLoading },
  } = useList<MeterValueDto>({
    resource: ResourceType.METER_VALUES,
    meta: {
      gqlQuery: GET_METER_VALUES_FOR_STATION,
      gqlVariables: { transactionDatabaseIds: txIds, limit: 10000, offset: 0 },
    },
    queryOptions: getPlainToInstanceOptions(MeterValueClass, true),
  });
  const series = mvData?.data ?? [];

  const defaultRange: DateRange = {
    from: startOfDay(subDays(new Date(), 7)),
    to: endOfDay(new Date()),
  };
  const [selL, setSelL] = useState<ChartType>(ChartType.POWER);
  const [allL, setAllL] = useState(true);
  const [rngL, setRngL] = useState(defaultRange);
  const [ctxL, setCtxL] =
    useState<OCPP2_0_1.ReadingContextEnumType[]>(allContexts);

  const [selR, setSelR] = useState<ChartType>(ChartType.ENERGY);
  const [allR, setAllR] = useState(true);
  const [rngR, setRngR] = useState(defaultRange);
  const [ctxR, setCtxR] =
    useState<OCPP2_0_1.ReadingContextEnumType[]>(allContexts);

  if (txLoading || mvLoading)
    return (
      <div className="flex justify-center p-8">
        <LoadingIcon />
      </div>
    );

  return (
    <div className="flex gap-8">
      <ChartPanel
        series={series}
        selected={selL}
        onSelect={setSelL}
        allTime={allL}
        onToggleAllTime={setAllL}
        dateRange={rngL}
        setDateRange={setRngL}
        contexts={ctxL}
        onContextsChange={setCtxL}
      />
      <ChartPanel
        series={series}
        selected={selR}
        onSelect={setSelR}
        allTime={allR}
        onToggleAllTime={setAllR}
        dateRange={rngR}
        setDateRange={setRngR}
        contexts={ctxR}
        onContextsChange={setCtxR}
      />
    </div>
  );
};
