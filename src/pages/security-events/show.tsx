// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { useShow } from '@refinedev/core';

import { DateField, Show, RefreshButton, TextField } from '@refinedev/antd';

import { Typography } from 'antd';

import type { GetFields } from '@refinedev/hasura';
import type { SecurityEventsShowQuery } from '../../graphql/types';
import { SECURITY_EVENTS_SHOW_QUERY } from './queries';

const { Title } = Typography;

export const SecurityEventsShow = () => {
  const { queryResult } = useShow<GetFields<SecurityEventsShowQuery>>({
    metaData: {
      gqlQuery: SECURITY_EVENTS_SHOW_QUERY,
    },
  });

  const { data, isLoading } = queryResult;
  const record = data?.data;

  return (
    <Show
      isLoading={isLoading}
      headerProps={{
        extra: (
          <RefreshButton
            onClick={() => {
              queryResult.refetch();
            }}
          />
        ),
      }}
      canEdit={true}
    >
      <Title level={5}>Id</Title>
      <TextField value={record?.id} />

      <Title level={5}>Station ID</Title>
      <TextField value={record?.stationId} />

      <Title level={5}>Type</Title>
      <TextField value={record?.type} />

      <Title level={5}>Timestamp</Title>
      <TextField value={record?.timestamp} />

      <Title level={5}>Tech Info</Title>
      <TextField value={record?.techInfo} />

      <Title level={5}>Created At</Title>
      <DateField value={record?.createdAt} />

      <Title level={5}>Updated At</Title>
      <DateField value={record?.updatedAt} />
    </Show>
  );
};
