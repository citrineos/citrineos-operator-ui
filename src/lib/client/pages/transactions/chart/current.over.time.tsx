// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0
'use client';

import type { MeterValueDto } from '@citrineos/base';
import { OCPP2_0_1 } from '@citrineos/base';
import {
  formatTimeLabel,
  generateTimeTicks,
} from '@lib/client/pages/transactions/chart/util';
import { getTimestampToMeasurandArray } from '@lib/cls/meter.value.dto';
import { useMemo } from 'react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

export interface CurrentOverTimeProps {
  meterValues: MeterValueDto[];
  validContexts: OCPP2_0_1.ReadingContextEnumType[];
}

export const CurrentOverTime = ({
  meterValues,
  validContexts,
}: CurrentOverTimeProps) => {
  const strokeColor = 'var(--grayscale-color-1)';
  const lineColor = 'var(--secondary-color-2)';
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

  if (!chartData || chartData.length === 0) {
    return <div>No Current data available</div>;
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={chartData} margin={{ bottom: 40 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={strokeColor} />
        <XAxis
          dataKey="elapsedTime"
          type="number"
          tick={{ fill: strokeColor }}
          stroke={strokeColor}
          ticks={generateTimeTicks(chartData)}
          tickFormatter={formatTimeLabel}
          label={{
            value: 'Time Elapsed',
            position: 'insideBottom',
            offset: -20,
            fill: strokeColor,
          }}
        />
        <YAxis
          tick={{ fill: strokeColor }}
          stroke={strokeColor}
          label={{
            value: 'Current (A)',
            angle: -90,
            position: 'insideLeft',
            fill: strokeColor,
            style: { textAnchor: 'middle' },
          }}
          domain={[minValue - buffer, maxValue + buffer]}
        />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="a"
          stroke={lineColor}
          strokeWidth={5}
          dot={{ r: 6, fill: lineColor }}
          activeDot={{ r: 12, fill: lineColor }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
