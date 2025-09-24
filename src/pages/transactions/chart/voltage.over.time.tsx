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
import React, { useMemo } from 'react';
import { getTimestampToMeasurandArray } from '../../../dtos/meter.value.dto';
import { MeasurandEnumType, ReadingContextEnumType } from '@OCPP2_0_1';
import { chartMinHeight, formatTimeLabel, generateTimeTicks } from './util';
import { IMeterValueDto } from '@citrineos/base';
import { Flex } from 'antd';

export interface VoltageOverTimeProps {
  meterValues: IMeterValueDto[];
  validContexts: ReadingContextEnumType[];
}

export const VoltageOverTime = ({
  meterValues,
  validContexts,
}: VoltageOverTimeProps) => {
  const strokeColor = 'var(--grayscale-color-1)';
  const lineColor = 'var(--ui-color-success)';
  const buffer = 1;

  const { chartData, minValue, maxValue } = useMemo(() => {
    let min = Infinity;
    let max = -Infinity;

    const processedData = getTimestampToMeasurandArray(
      meterValues,
      MeasurandEnumType.Voltage,
      new Set(validContexts),
    ).map(([elapsedTime, v]) => {
      const vFloat = Number(v);
      if (vFloat < min) min = Math.floor(vFloat);
      if (vFloat > max) max = Math.ceil(vFloat);
      return { elapsedTime, v };
    });

    return { chartData: processedData, minValue: min, maxValue: max };
  }, [meterValues, validContexts]);

  const hasChartData = chartData && chartData.length > 0;

  return (
    <div className="meter-value-chart">
      <Flex vertical gap={16}>
        <h3>Voltage Over Time</h3>
        {!hasChartData && <div>No Voltage data available</div>}
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
                  value: 'Voltage (V)',
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
                dataKey="v"
                stroke={lineColor}
                strokeWidth={5}
                dot={{ r: 6, fill: lineColor }}
                activeDot={{ r: 12, fill: lineColor }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </Flex>
    </div>
  );
};
