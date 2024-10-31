import type { HttpError } from '@refinedev/core';

import { Create, useForm } from '@refinedev/antd';

import { Form, Input } from 'antd';

import type {
  IdTokenInfosCreateMutation,
  IdTokenInfosCreateMutationVariables,
} from '../../graphql/types';
import type { GetFields, GetVariables } from '@refinedev/hasura';
import { ID_TOKEN_INFOS_CREATE_MUTATION } from './queries';
import { Exact, IdTokenInfos_Insert_Input } from '../../graphql/schema.types';

export const IdTokenInfosCreate = () => {
  const { formProps, onFinish, saveButtonProps } = useForm<
    GetFields<IdTokenInfosCreateMutation>,
    HttpError,
    GetVariables<IdTokenInfosCreateMutationVariables>
  >({
    metaData: {
      gqlMutation: ID_TOKEN_INFOS_CREATE_MUTATION,
    },
  });

  const onFinishAddTimestamp = (
    values: GetVariables<
      Exact<{
        object: IdTokenInfos_Insert_Input;
      }>
    >,
  ) => {
    values.createdAt = new Date();
    values.updatedAt = values.createdAt;
    return onFinish(values);
  };

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...formProps} onFinish={onFinishAddTimestamp} layout="vertical">
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
    </Create>
  );
};
