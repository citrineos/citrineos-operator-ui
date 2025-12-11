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

export interface PowerOverTimeProps {
  meterValues: MeterValueDto[];
  validContexts: OCPP2_0_1.ReadingContextEnumType[];
}

const powerAxisLabel = 'Power (kW)';

const chartConfig = {
  elapsedTime: {
    label: elapsedTimeAxisLabel,
  },
  kw: {
    label: powerAxisLabel,
  },
} satisfies ChartConfig;

export const PowerOverTime = ({
  meterValues,
  validContexts,
}: PowerOverTimeProps) => {
  const buffer = 1;

  const { chartData, minValue, maxValue } = useMemo(() => {
    let min = Infinity;
    let max = -Infinity;

    const processedData = getTimestampToMeasurandArray(
      meterValues,
      OCPP2_0_1.MeasurandEnumType.Power_Active_Import,
      new Set(validContexts),
    ).map(([elapsedTime, kw]) => {
      const kwFloat = Number(kw);
      if (kwFloat < min) min = Math.floor(kwFloat);
      if (kwFloat > max) max = Math.ceil(kwFloat);
      return { elapsedTime, kw };
    });

    return { chartData: processedData, minValue: min, maxValue: max };
  }, [meterValues, validContexts]);

  return (
    <Card>
      <CardHeader>
        <h3 className={heading3Style}>Power Over Time</h3>
      </CardHeader>
      <CardContent>
        {!chartData || chartData.length === 0 ? (
          <div>No Power data available</div>
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
                label={getYAxisLabelConfig(powerAxisLabel)}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                dataKey="kWh"
                stroke="var(--color-secondary)"
                dot={{
                  fill: 'var(--color-secondary)',
                }}
              />
            </LineChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>

    // <ResponsiveContainer minHeight={chartMinHeight}>
    //   <LineChart data={chartData} margin={{ bottom: 40 }}>
    //     <CartesianGrid strokeDasharray="3 3" stroke={strokeColor} />
    //     <XAxis
    //       dataKey="elapsedTime"
    //       type="number"
    //       tick={{ fill: strokeColor }}
    //       stroke={strokeColor}
    //       ticks={generateTimeTicks(chartData)}
    //       tickFormatter={formatTimeLabel}
    //       label={{
    //         value: 'Time Elapsed',
    //         position: 'insideBottom',
    //         offset: -20,
    //         fill: strokeColor,
    //       }}
    //     />
    //     <YAxis
    //       tick={{ fill: strokeColor }}
    //       stroke={strokeColor}
    //       label={{
    //         value: 'Power (kW)',
    //         angle: -90,
    //         position: 'insideLeft',
    //         fill: strokeColor,
    //         style: { textAnchor: 'middle' },
    //       }}
    //       domain={[minValue - buffer, maxValue + buffer]}
    //     />
    //     <Tooltip />
    //     <Line
    //       type="monotone"
    //       dataKey="kw"
    //       stroke={lineColor}
    //       strokeWidth={5}
    //       dot={{ r: 6, fill: lineColor }}
    //       activeDot={{ r: 12, fill: lineColor }}
    //     />
    //   </LineChart>
    // </ResponsiveContainer>
  );
};
