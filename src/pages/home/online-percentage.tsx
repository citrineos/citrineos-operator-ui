import { useCustom } from '@refinedev/core';
import { gql } from 'graphql-tag';
import { Alert, Spin } from 'antd';
import { Cell, Pie, PieChart } from 'recharts';
import React, { useState } from 'react';
import { ChartWrapper } from './chart-wrapper';

export const OnlinePercentage = () => {
  const RADIAN = Math.PI / 180;

  const { data, isLoading, isError } = useCustom<any>({
    url: import.meta.env.VITE_API_URL,
    method: 'post',
    config: {
      headers: {
        'Content-Type': 'application/json',
      },
    },
    meta: {
      operation: 'GetChargingStationCounts',
      gqlQuery: gql`
        query GetChargingStationCounts {
          total: ChargingStations_aggregate {
            aggregate {
              count
            }
          }
          online: ChargingStations_aggregate(
            where: { isOnline: { _eq: true } }
          ) {
            aggregate {
              count
            }
          }
        }
      `,
    },
  });

  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  if (isLoading) {
    return <Spin />;
  }

  if (isError) {
    return (
      <Alert
        message={`Error: OnlinePercentage could not fetch data`}
        type="error"
      />
    );
  }

  const total = data?.data.total.aggregate.count;
  const online = data?.data.online.aggregate.count;
  const percentage = ((online / total) * 100).toFixed(2);

  const cells = [
    { name: '<20%', value: 20, color: 'var(--ant-red)' },
    { name: '20-40%', value: 20, color: 'var(--ant-orange)' },
    { name: '40-60%', value: 20, color: 'var(--ant-yellow)' },
    { name: '60-80%', value: 20, color: 'var(--ant-lime)' },
    { name: '>80%', value: 20, color: 'var(--ant-green)' },
  ];

  const needle = (value, total, cx, cy, iR, oR, color) => {
    const ang = 180.0 * (1 - value / total);
    const length = (iR + 2 * oR) / 3;
    const sin = Math.sin(-RADIAN * ang);
    const cos = Math.cos(-RADIAN * ang);
    const r = 5;
    const x0 = cx;
    const y0 = cy;
    const xba = x0 + r * sin;
    const yba = y0 - r * cos;
    const xbb = x0 - r * sin;
    const ybb = y0 + r * cos;
    const xp = x0 + length * cos;
    const yp = y0 + length * sin;

    return [
      <circle cx={x0} cy={y0} r={r} fill={color} stroke="none" key="circle" />,
      <path
        key="needle"
        d={`M${xba} ${yba}L${xbb} ${ybb} L${xp} ${yp} L${xba} ${yba}`}
        stroke="none"
        fill={color}
      />,
      <text
        key="text"
        x={x0}
        y={y0 + 20}
        fill={color}
        textAnchor="middle"
        dominantBaseline="middle"
      >
        {percentage}%
      </text>,
    ];
  };

  const handleResize = (width, height) => {
    setDimensions({ width, height });
  };

  const cx = dimensions.width / 2;
  const cy = dimensions.height / 1.7;
  const iR = dimensions.width / 8;
  const oR = dimensions.width / 4;

  return (
    <ChartWrapper
      title={'Online Percentage'}
      onResize={(w, h) => handleResize(w, h)}
    >
      <PieChart>
        <Pie
          dataKey="value"
          startAngle={180}
          endAngle={0}
          data={cells}
          cx={cx}
          cy={cy}
          innerRadius={iR}
          outerRadius={oR}
          fill="#8884d8"
          stroke="none"
          paddingAngle={2}
        >
          {cells.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        {needle(online, total, cx, cy, iR, oR, 'var(--ant-black)')}
      </PieChart>
    </ChartWrapper>
  );
};
