import type { HttpError } from '@refinedev/core';

import { Create, useForm } from '@refinedev/antd';

import { Form, Input } from 'antd';

import type {
  AdditionalInfosCreateMutation,
  AdditionalInfosCreateMutationVariables,
} from '../../graphql/types';
import type { GetFields, GetVariables } from '@refinedev/hasura';
import { ADDITIONAL_INFOS_CREATE_MUTATION } from '../../queries/additionalInfo';
import {
  AdditionalInfos_Insert_Input,
  Exact,
} from '../../graphql/schema.types';

export const AdditionalInfosCreate = () => {
  const { formProps, onFinish, saveButtonProps } = useForm<
    GetFields<AdditionalInfosCreateMutation>,
    HttpError,
    GetVariables<AdditionalInfosCreateMutationVariables>
  >({
    metaData: {
      gqlMutation: ADDITIONAL_INFOS_CREATE_MUTATION,
    },
  });

  const onFinishAddTimestamp = (
    values: GetVariables<
      Exact<{
        object: AdditionalInfos_Insert_Input;
      }>
    >,
  ) => {
    values.createdAt = new Date().toISOString();
    values.updatedAt = values.createdAt;
    return onFinish(values);
  };

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...formProps} onFinish={onFinishAddTimestamp} layout="vertical">
        <Form.Item
          label="Additional Id Token"
          name="additionalIdToken"
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
