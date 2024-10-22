import { Pie, PieChart } from 'recharts';
import React from 'react';
import { ChartWrapper } from './chart-wrapper';
import { useCustom } from '@refinedev/core';
import { gql } from 'graphql-tag';

export const OnlineStatus = () => {
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

  return (
    <ChartWrapper title={'Online Status Breakdown'}>
      <PieChart>
        <Pie
          data={[
            {
              name: 'Group A',
              value: 400,
            },
            {
              name: 'Group B',
              value: 300,
            },
            {
              name: 'Group C',
              value: 300,
            },
            {
              name: 'Group D',
              value: 200,
            },
            {
              name: 'Group E',
              value: 278,
            },
            {
              name: 'Group F',
              value: 189,
            },
          ]}
          dataKey="value"
          nameKey="date"
          cx="50%"
          cy="40%"
          outerRadius={150}
          fill="#82ca9d"
          label
        />
      </PieChart>
    </ChartWrapper>
  );
};
