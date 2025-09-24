// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import React, { useMemo } from 'react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { getTimestampToMeasurandArray } from '../../../dtos/meter.value.dto';
import { MeasurandEnumType, ReadingContextEnumType } from '@OCPP2_0_1';
import { chartMinHeight, formatTimeLabel, generateTimeTicks } from './util';
import { IMeterValueDto } from '@citrineos/base';
import { Flex } from 'antd';

export interface CurrentOverTimeProps {
  meterValues: IMeterValueDto[];
  validContexts: ReadingContextEnumType[];
}

export const CurrentOverTime = ({
  meterValues,
  validContexts,
}: CurrentOverTimeProps) => {
  const strokeColor = 'var(--grayscale-color-1)';
  const lineColor = 'var(--grayscale-color-5)';
  const buffer = 1;

  const { chartData, minValue, maxValue } = useMemo(() => {
    let min = Infinity;
    let max = -Infinity;

    const processedData = getTimestampToMeasurandArray(
      meterValues,
      MeasurandEnumType.Current_Import,
      new Set(validContexts),
    ).map(([elapsedTime, a]) => {
      const aFloat = Number(a);
      if (aFloat < min) min = Math.floor(aFloat);
      if (aFloat > max) max = Math.ceil(aFloat);
      return { elapsedTime, a };
    });

    return { chartData: processedData, minValue: min, maxValue: max };
  }, [meterValues, validContexts]);

  const hasChartData = chartData && chartData.length > 0;

  return (
    <div className="meter-value-chart">
      <Flex vertical gap={16}>
        <h3>Current Over Time</h3>
        {!hasChartData && (
          <div className="no-meter-values">No Current data available</div>
        )}
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
        )}
      </Flex>
    </div>
  );
};
