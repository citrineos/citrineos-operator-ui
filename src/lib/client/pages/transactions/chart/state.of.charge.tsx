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
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@lib/client/components/ui/chart';
import { Card, CardContent, CardHeader } from '@lib/client/components/ui/card';
import { heading3Style } from '@lib/client/styles/page';

interface StateOfChargeProps {
  meterValues: MeterValueDto[];
  validContexts: OCPP2_0_1.ReadingContextEnumType[];
}

const socAxisLabel = 'State of Charge (%)';

const chartConfig = {
  elapsedTime: {
    label: elapsedTimeAxisLabel,
  },
  stateOfCharge: {
    label: socAxisLabel,
  },
} satisfies ChartConfig;

export const StateOfCharge = ({
  meterValues,
  validContexts,
}: StateOfChargeProps) => {
  const chartData = useMemo(() => {
    const rawData = getTimestampToMeasurandArray(
      meterValues,
      OCPP2_0_1.MeasurandEnumType.SoC,
      new Set(validContexts),
    ).map(([elapsedTime]) => ({
      elapsedTime,
    }));

    if (rawData.length === 0) return [];

    return rawData.map(({ elapsedTime }, index) => ({
      elapsedTime,
      stateOfCharge: (20 + (index / (rawData.length - 1)) * 60).toFixed(2),
    }));
  }, [meterValues, validContexts]);

  return (
    <Card>
      <CardHeader>
        <h3 className={heading3Style}>State of Charge Over Time</h3>
      </CardHeader>
      <CardContent>
        {!chartData || chartData.length === 0 ? (
          <div>No State of Charge data available</div>
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
                domain={[0, 100]}
                tickFormatter={(value) => `${value}%`}
                label={getYAxisLabelConfig(socAxisLabel)}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                dataKey="stateOfCharge"
                stroke="var(--color-warning)"
                dot={{
                  fill: 'var(--color-warning)',
                }}
              />
            </LineChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
};
