import type { HttpError } from '@refinedev/core';

import { Create, useForm } from '@refinedev/antd';

import { Form, Input, Select } from 'antd';

import type {
  AuthorizationsCreateMutation,
  AuthorizationsCreateMutationVariables,
} from '../../graphql/types';
import type { GetFields, GetVariables } from '@refinedev/hasura';
import { AUTHORIZATIONS_CREATE_MUTATION } from './queries';

export const AuthorizationsCreate = () => {
  const { formProps, saveButtonProps } = useForm<
    GetFields<AuthorizationsCreateMutation>,
    HttpError,
    GetVariables<AuthorizationsCreateMutationVariables>
  >({
    metaData: {
      gqlMutation: AUTHORIZATIONS_CREATE_MUTATION,
    },
  });

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
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
    </Create>
  );
};
