import { useShow } from '@refinedev/core';

import { Show, RefreshButton } from '@refinedev/antd';

import { Typography } from 'antd';

import type { GetFields } from '@refinedev/hasura';
import type { IdTokenInfosShowQuery } from '../../graphql/types';
import { ID_TOKEN_INFOS_SHOW_QUERY } from './queries';

const { Title, Text } = Typography;

export const IdTokenInfosShow = () => {
  const { queryResult } = useShow<GetFields<IdTokenInfosShowQuery>>({
    metaData: {
      gqlQuery: ID_TOKEN_INFOS_SHOW_QUERY,
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
    >
      <Title level={5}>Id</Title>
      <Text>{record?.id}</Text>

      <Title level={5}>Cache Expiry DateTime</Title>
      <Text>{record?.cacheExpiryDateTime}</Text>

      <Title level={5}>Charging Priority</Title>
      <Text>{record?.chargingPriority}</Text>

      <Title level={5}>Group Id Token Id</Title>
      <Text>{record?.groupIdTokenId}</Text>

      <Title level={5}>Language 1</Title>
      <Text>{record?.language1}</Text>

      <Title level={5}>Language 2</Title>
      <Text>{record?.language2}</Text>

      <Title level={5}>Personal Message</Title>
      <Text>{record?.personalMessage}</Text>

      <Title level={5}>Status</Title>
      <Text>{record?.status}</Text>

      <Title level={5}>Created At</Title>
      <Text>{record?.createdAt}</Text>

      <Title level={5}>Updated At</Title>
      <Text>{record?.updatedAt}</Text>
    </Show>
  );
};
