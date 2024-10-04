import { useShow } from '@refinedev/core';

import { RefreshButton, Show } from '@refinedev/antd';

import { Typography } from 'antd';

import type { GetFields } from '@refinedev/hasura';
import type { AuthorizationsShowQuery } from '../../graphql/types';
import { AUTHORIZATIONS_SHOW_QUERY } from './queries';

const { Title, Text } = Typography;

export const AuthorizationsShow = () => {
  const { queryResult } = useShow<GetFields<AuthorizationsShowQuery>>({
    metaData: {
      gqlQuery: AUTHORIZATIONS_SHOW_QUERY,
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

      <Title level={5}>Allowed Connector Types</Title>
      <Text>{record?.allowedConnectorTypes?.join(', ')}</Text>

      <Title level={5}>Disallowed EVSE ID Prefixes</Title>
      <Text>{record?.disallowedEvseIdPrefixes?.join(', ')}</Text>

      <Title level={5}>ID Token ID</Title>
      <Text>{record?.idTokenId}</Text>

      <Title level={5}>ID Token Info ID</Title>
      <Text>{record?.idTokenInfoId}</Text>

      <Title level={5}>Created At</Title>
      <Text>{record?.createdAt}</Text>

      <Title level={5}>Updated At</Title>
      <Text>{record?.updatedAt}</Text>
    </Show>
  );
};
