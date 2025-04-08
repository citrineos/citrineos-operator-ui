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
import {
  getTimestampToMeasurandArray,
  MeterValueDto,
} from '../../../dtos/meter.value.dto';
import { MeasurandEnumType } from '@OCPP2_0_1';

export interface PowerOverTimeProps {
  meterValues: MeterValueDto[];
}

export const PowerOverTime = ({ meterValues }: PowerOverTimeProps) => {
  const strokeColor = 'var(--grayscale-color-1)';
  const lineColor = 'var(--secondary-color-2)';
  const buffer = 1;

  const { chartData, minValue, maxValue } = useMemo(() => {
    let min = Infinity;
    let max = -Infinity;

    const processedData = getTimestampToMeasurandArray(
      meterValues,
      MeasurandEnumType.Power_Active_Import,
    ).map(([elapsedTime, kw]) => {
      const kwFloat = Number(kw);
      if (kwFloat < min) min = Math.floor(kwFloat);
      if (kwFloat > max) max = Math.ceil(kwFloat);
      return { elapsedTime, kw };
    });

    return { chartData: processedData, minValue: min, maxValue: max };
  }, [meterValues]);

  if (!chartData || chartData.length === 0) {
    return <div>No Power data available</div>;
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={chartData} margin={{ bottom: 40 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={strokeColor} />
        <XAxis
          dataKey="elapsedTime"
          type={'number'}
          tick={{ fill: strokeColor }}
          stroke={strokeColor}
          tickFormatter={(time) => `${Math.floor(time / 60)} min`}
          label={{
            value: 'Time (Minutes)',
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
  );
};
