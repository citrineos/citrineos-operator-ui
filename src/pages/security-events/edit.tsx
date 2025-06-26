// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import type { HttpError } from '@refinedev/core';

import { Edit, ListButton, RefreshButton, useForm } from '@refinedev/antd';

import { Form, Input } from 'antd';

import type {
  SecurityEventsEditMutation,
  SecurityEventsEditMutationVariables,
} from '../../graphql/types';
import type { GetFields, GetVariables } from '@refinedev/hasura';
import { SECURITY_EVENTS_EDIT_MUTATION } from './queries';
import { useEffect } from 'react';

export const SecurityEventsEdit = () => {
  const { formProps, saveButtonProps, queryResult, formLoading } = useForm<
    GetFields<SecurityEventsEditMutation>,
    HttpError,
    GetVariables<SecurityEventsEditMutationVariables>
  >({
    metaData: {
      gqlMutation: SECURITY_EVENTS_EDIT_MUTATION,
    },
  });

  const initialData = queryResult?.data?.data;
  useEffect(() => {
    if (initialData) {
      formProps.form?.setFieldsValue(initialData);
    }
  }, [formProps.form, initialData]);

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
    </Edit>
  );
};
