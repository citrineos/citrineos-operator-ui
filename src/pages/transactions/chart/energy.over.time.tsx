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

export interface EnergyOverTimeProps {
  meterValues: IMeterValueDto[];
  validContexts: ReadingContextEnumType[];
}

export const EnergyOverTime = ({
  meterValues,
  validContexts,
}: EnergyOverTimeProps) => {
  const strokeColor = 'var(--grayscale-color-1)';
  const lineColor = 'var(--secondary-color-2)';
  const buffer = 1;

  const { chartData, minValue, maxValue } = useMemo(() => {
    let min = Infinity;
    let max = -Infinity;

    const processedData = getTimestampToMeasurandArray(
      meterValues,
      MeasurandEnumType.Energy_Active_Import_Register,
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
    <div className="meter-value-chart">
      <Flex vertical gap={16}>
        <h3>Energy Over Time</h3>
        {!hasChartData && (
          <div className="no-meter-values">No Energy data available</div>
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
                  value: 'Energy (kW)',
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
    </div>
  );
};
