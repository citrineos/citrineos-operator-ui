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

export interface StateOfChargeProps {
  meterValues: IMeterValueDto[];
  validContexts: ReadingContextEnumType[];
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
      MeasurandEnumType.SoC,
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

  const hasChartData = chartData && chartData.length > 0;

  return (
    <div className="meter-value-chart">
      <Flex vertical gap={16}>
        <h3>State of Charge Over Time</h3>
        {!hasChartData && <div>No State of Charge data available</div>}
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
        )}
      </Flex>
    </div>
  );
};
