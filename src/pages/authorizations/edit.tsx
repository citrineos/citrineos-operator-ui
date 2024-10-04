import type { HttpError } from '@refinedev/core';

import { Edit, ListButton, RefreshButton, useForm } from '@refinedev/antd';

import { Form, Input, Select } from 'antd';

import type {
  AuthorizationsEditMutation,
  AuthorizationsEditMutationVariables,
} from '../../graphql/types';
import type { GetFields, GetVariables } from '@refinedev/hasura';
import { AUTHORIZATIONS_EDIT_MUTATION } from './queries';

export const AuthorizationsEdit = () => {
  const { formProps, saveButtonProps, queryResult, formLoading } = useForm<
    GetFields<AuthorizationsEditMutation>,
    HttpError,
    GetVariables<AuthorizationsEditMutationVariables>
  >({
    metaData: {
      gqlMutation: AUTHORIZATIONS_EDIT_MUTATION,
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
        onFinish={(values) =>
          formProps.onFinish?.({
            ...values,
          })
        }
      >
        <Form.Item label="Allowed Connector Types" name="allowedConnectorTypes">
          <Select mode="multiple">
            <Select.Option value="Type1">Type 1</Select.Option>
            <Select.Option value="Type2">Type 2</Select.Option>
            <Select.Option value="CCS">CCS</Select.Option>
            <Select.Option value="CHAdeMO">CHAdeMO</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="Disallowed EVSE ID Prefixes"
          name="disallowedEvseIdPrefixes"
        >
          <Select mode="multiple">
            <Select.Option value="EVSE1">EVSE 1</Select.Option>
            <Select.Option value="EVSE2">EVSE 2</Select.Option>
            <Select.Option value="EVSE3">EVSE 3</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="ID Token ID" name="idTokenId">
          <Input />
        </Form.Item>
        <Form.Item label="ID Token Info ID" name="idTokenInfoId">
          <Input />
        </Form.Item>
      </Form>
    </Edit>
  );
};
