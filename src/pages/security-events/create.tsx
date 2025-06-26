// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import type { HttpError } from '@refinedev/core';

import { Create, useForm } from '@refinedev/antd';

import { Form, Input } from 'antd';

import type {
  SecurityEventsCreateMutation,
  SecurityEventsCreateMutationVariables,
} from '../../graphql/types';
import type { GetFields, GetVariables } from '@refinedev/hasura';
import { SECURITY_EVENTS_CREATE_MUTATION } from './queries';
import { Exact, SecurityEvents_Insert_Input } from '../../graphql/schema.types';

export const SecurityEventsCreate = () => {
  const { formProps, onFinish, saveButtonProps } = useForm<
    GetFields<SecurityEventsCreateMutation>,
    HttpError,
    GetVariables<SecurityEventsCreateMutationVariables>
  >({
    metaData: {
      gqlMutation: SECURITY_EVENTS_CREATE_MUTATION,
    },
  });

  const onFinishAddTimestamp = (
    values: GetVariables<
      Exact<{
        object: SecurityEvents_Insert_Input;
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
          label="Station Id"
          name="stationId"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Type"
          name="type"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Timestamp"
          name="timestamp"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="Tech Info" name="techInfo">
          <Input />
        </Form.Item>
      </Form>
    </Create>
  );
};
