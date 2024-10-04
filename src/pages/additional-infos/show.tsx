import { useShow } from '@refinedev/core';

import { DateField, Show, RefreshButton, TextField } from '@refinedev/antd';

import { Typography } from 'antd';

import type { GetFields } from '@refinedev/hasura';
import type { AdditionalInfosShowQuery } from '../../graphql/types';
import { ADDITIONAL_INFOS_SHOW_QUERY } from './queries';

const { Title } = Typography;

export const AdditionalInfosShow = () => {
  const { queryResult } = useShow<GetFields<AdditionalInfosShowQuery>>({
    metaData: {
      gqlQuery: ADDITIONAL_INFOS_SHOW_QUERY,
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

      <Title level={5}>Additional Id Token</Title>
      <TextField value={record?.additionalIdToken} />

      <Title level={5}>Type</Title>
      <TextField value={record?.type} />

      <Title level={5}>Created At</Title>
      <DateField value={record?.createdAt} />

      <Title level={5}>Updated At</Title>
      <DateField value={record?.updatedAt} />
    </Show>
  );
};
