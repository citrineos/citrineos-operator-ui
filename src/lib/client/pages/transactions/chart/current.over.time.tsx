// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0
'use client';

import type { MeterValueDto } from '@citrineos/base';
import { OCPP2_0_1 } from '@citrineos/base';
import {
  chartMargin,
  chartSize,
  elapsedTimeAxisLabel,
  formatTimeLabel,
  generateTimeTicks,
  getYAxisLabelConfig,
  xAxisLabelConfig,
} from '@lib/client/pages/transactions/chart/util';
import { getTimestampToMeasurandArray } from '@lib/cls/meter.value.dto';
import { useMemo } from 'react';
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardHeader } from '@lib/client/components/ui/card';
import { heading3Style } from '@lib/client/styles/page';
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@lib/client/components/ui/chart';

export interface CurrentOverTimeProps {
  meterValues: MeterValueDto[];
  validContexts: OCPP2_0_1.ReadingContextEnumType[];
}

const currentAxisLabel = 'Current (A)';

const chartConfig = {
  elapsedTime: {
    label: elapsedTimeAxisLabel,
  },
  a: {
    label: currentAxisLabel,
  },
} satisfies ChartConfig;

export const CurrentOverTime = ({
  meterValues,
  validContexts,
}: CurrentOverTimeProps) => {
  const buffer = 1;

  const { chartData, minValue, maxValue } = useMemo(() => {
    let min = Infinity;
    let max = -Infinity;

    const processedData = getTimestampToMeasurandArray(
      meterValues,
      OCPP2_0_1.MeasurandEnumType.Current_Import,
      new Set(validContexts),
    ).map(([elapsedTime, a]) => {
      const aFloat = Number(a);
      if (aFloat < min) min = Math.floor(aFloat);
      if (aFloat > max) max = Math.ceil(aFloat);
      return { elapsedTime, a };
    });

    return { chartData: processedData, minValue: min, maxValue: max };
  }, [meterValues, validContexts]);

  return (
    <Card>
      <CardHeader>
        <h3 className={heading3Style}>Current Over Time</h3>
      </CardHeader>
      <CardContent>
        {!chartData || chartData.length === 0 ? (
          <div>No Current data available</div>
        ) : (
          <ChartContainer config={chartConfig} className={chartSize}>
            <LineChart data={chartData} margin={chartMargin}>
              <CartesianGrid />
              <XAxis
                dataKey="elapsedTime"
                type="number"
                ticks={generateTimeTicks(chartData)}
                tickFormatter={formatTimeLabel}
                label={xAxisLabelConfig}
              />
              <YAxis
                domain={[minValue - buffer, maxValue + buffer]}
                label={getYAxisLabelConfig(currentAxisLabel)}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                dataKey="a"
                stroke="var(--color-destructive)"
                dot={{
                  fill: 'var(--color-destructive)',
                }}
              />
            </LineChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
};
