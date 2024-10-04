import { useShow } from '@refinedev/core';

import { Show, RefreshButton } from '@refinedev/antd';

import { Typography } from 'antd';

import type { GetFields } from '@refinedev/hasura';
import type { IdTokensShowQuery } from '../../graphql/types';
import { ID_TOKENS_SHOW_QUERY } from './queries';

const { Title, Text } = Typography;

export const IdTokensShow = () => {
  const { queryResult } = useShow<GetFields<IdTokensShowQuery>>({
    metaData: {
      gqlQuery: ID_TOKENS_SHOW_QUERY,
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

      <Title level={5}>Id Token</Title>
      <Text>{record?.idToken}</Text>

      <Title level={5}>Type</Title>
      <Text>{record?.type}</Text>

      <Title level={5}>Created At</Title>
      <Text>{record?.createdAt}</Text>

      <Title level={5}>Updated At</Title>
      <Text>{record?.updatedAt}</Text>
    </Show>
  );
};
