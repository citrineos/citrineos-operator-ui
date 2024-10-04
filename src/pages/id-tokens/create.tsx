import type { HttpError } from '@refinedev/core';

import { Create, useForm } from '@refinedev/antd';

import { Form, Input } from 'antd';

import type {
  IdTokensCreateMutation,
  IdTokensCreateMutationVariables,
} from '../../graphql/types';
import type { GetFields, GetVariables } from '@refinedev/hasura';
import { ID_TOKENS_CREATE_MUTATION } from './queries';
import { Exact, IdTokens_Insert_Input } from '../../graphql/schema.types';

export const IdTokensCreate = () => {
  const { formProps, onFinish, saveButtonProps } = useForm<
    GetFields<IdTokensCreateMutation>,
    HttpError,
    GetVariables<IdTokensCreateMutationVariables>
  >({
    metaData: {
      gqlMutation: ID_TOKENS_CREATE_MUTATION,
    },
  });

  const onFinishAddTimestamp = (
    values: GetVariables<
      Exact<{
        object: IdTokens_Insert_Input;
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
        <Form.Item
          label="Id Token"
          name="idToken"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="Type" name="type">
          <Input />
        </Form.Item>
      </Form>
    </Create>
  );
};
