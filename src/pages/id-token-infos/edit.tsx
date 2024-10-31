import type { HttpError } from '@refinedev/core';

import { Edit, ListButton, RefreshButton, useForm } from '@refinedev/antd';

import { Form, Input } from 'antd';

import type {
  IdTokenInfosEditMutation,
  IdTokenInfosEditMutationVariables,
} from '../../graphql/types';
import type { GetFields, GetVariables } from '@refinedev/hasura';
import { ID_TOKEN_INFOS_EDIT_MUTATION } from './queries';

export const IdTokenInfosEdit = () => {
  const { formProps, saveButtonProps, queryResult, formLoading } = useForm<
    GetFields<IdTokenInfosEditMutation>,
    HttpError,
    GetVariables<IdTokenInfosEditMutationVariables>
  >({
    metaData: {
      gqlMutation: ID_TOKEN_INFOS_EDIT_MUTATION,
    },
  });

  return (
    <Edit
      isLoading={formLoading}
      headerProps={{
        extra: (
          <>
            <ListButton />
            <RefreshButton onClick={() => queryResult?.refetch()} />
          </>
        ),
      }}
      saveButtonProps={saveButtonProps}
    >
      <Form
        {...formProps}
        layout="vertical"
        onFinish={(values) => {
          if (values.groupIdTokenId?.toString() === '') {
            delete values.groupIdTokenId;
          }
          formProps.onFinish?.({
            ...values,
          });
        }}
      >
        <Form.Item label="Cache Expiry DateTime" name="cacheExpiryDateTime">
          <Input />
        </Form.Item>
        <Form.Item label="Charging Priority" name="chargingPriority">
          <Input />
        </Form.Item>
        <Form.Item label="Group Id Token Id" name="groupIdTokenId">
          <Input />
        </Form.Item>
        <Form.Item label="Language 1" name="language1">
          <Input />
        </Form.Item>
        <Form.Item label="Language 2" name="language2">
          <Input />
        </Form.Item>
        <Form.Item label="Personal Message" name="personalMessage">
          <Input />
        </Form.Item>
        <Form.Item label="Status" name="status">
          <Input />
        </Form.Item>
      </Form>
    </Edit>
  );
};
