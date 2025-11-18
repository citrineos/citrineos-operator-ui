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

export interface StateOfChargeProps {
  meterValues: MeterValueDto[];
  validContexts: OCPP2_0_1.ReadingContextEnumType[];
}

export const StateOfCharge = ({
  meterValues,
  validContexts,
}: StateOfChargeProps) => {
  const strokeColor = 'var(--grayscale-color-1)';
  const lineColor = 'var(--primary-color-1)';

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
      percentage: (20 + (index / (rawData.length - 1)) * 60).toFixed(2),
    }));
  }, [meterValues, validContexts]);

  if (!chartData || chartData.length === 0) {
    return <div>No State of Charge data available</div>;
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
            value: 'State of Charge (%)',
            angle: -90,
            position: 'insideLeft',
            fill: strokeColor,
            style: { textAnchor: 'middle' },
          }}
        />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="percentage"
          stroke={lineColor}
          strokeWidth={5}
          dot={{ r: 6, fill: lineColor }}
          activeDot={{ r: 12, fill: lineColor }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
