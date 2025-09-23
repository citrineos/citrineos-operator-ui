// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useMemo } from 'react';
import { getTimestampToMeasurandArray } from '../../../dtos/meter.value.dto';
import { MeasurandEnumType, ReadingContextEnumType } from '@OCPP2_0_1';
import { chartMinHeight, formatTimeLabel, generateTimeTicks } from './util';
import { IMeterValueDto } from '@citrineos/base';
import { Flex } from 'antd';

export interface PowerOverTimeProps {
  meterValues: IMeterValueDto[];
  validContexts: ReadingContextEnumType[];
}

export const PowerOverTime = ({
  meterValues,
  validContexts,
}: PowerOverTimeProps) => {
  const strokeColor = 'var(--grayscale-color-1)';
  const lineColor = 'var(--ui-color-error)';
  const buffer = 1;

  const { chartData, minValue, maxValue } = useMemo(() => {
    let min = Infinity;
    let max = -Infinity;

    const processedData = getTimestampToMeasurandArray(
      meterValues,
      MeasurandEnumType.Power_Active_Import,
      new Set(validContexts),
    ).map(([elapsedTime, kw]) => {
      const kwFloat = Number(kw);
      if (kwFloat < min) min = Math.floor(kwFloat);
      if (kwFloat > max) max = Math.ceil(kwFloat);
      return { elapsedTime, kw };
    });

    return { chartData: processedData, minValue: min, maxValue: max };
  }, [meterValues, validContexts]);

  const hasChartData = chartData && chartData.length > 0;

  return (
    <Flex vertical gap={16}>
      <h3>Power Over Time</h3>
      {!hasChartData && <div>No Power data available</div>}
      {hasChartData && (
        <ResponsiveContainer minHeight={chartMinHeight}>
          <LineChart data={chartData}>
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
                value: 'Power (kW)',
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
              dataKey="kw"
              stroke={lineColor}
              strokeWidth={5}
              dot={{ r: 6, fill: lineColor }}
              activeDot={{ r: 12, fill: lineColor }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </Flex>
  );
};
