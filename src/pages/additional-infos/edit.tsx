import type { HttpError } from '@refinedev/core';

import { Edit, ListButton, RefreshButton, useForm } from '@refinedev/antd';

import { Form, Input } from 'antd';

import type {
  AdditionalInfosEditMutation,
  AdditionalInfosEditMutationVariables,
} from '../../graphql/types';
import type { GetFields, GetVariables } from '@refinedev/hasura';
import { ADDITIONAL_INFOS_EDIT_MUTATION } from '../../queries/additionalInfo';
import {
  AdditionalInfos_Set_Input,
  Exact,
  Scalars,
} from '../../graphql/schema.types';

export const AdditionalInfosEdit = () => {
  const { formProps, onFinish, saveButtonProps, queryResult, formLoading } =
    useForm<
      GetFields<AdditionalInfosEditMutation>,
      HttpError,
      GetVariables<AdditionalInfosEditMutationVariables>
    >({
      metaData: {
        gqlMutation: ADDITIONAL_INFOS_EDIT_MUTATION,
      },
    });

  const onFinishAddTimestamp = (
    values: GetVariables<
      Exact<{
        id: Scalars['Int']['input'];
        object: AdditionalInfos_Set_Input;
      }>
    >,
  ) => {
    values.updatedAt = new Date().toISOString();
    return onFinish(values);
  };

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
      <Form {...formProps} layout="vertical" onFinish={onFinishAddTimestamp}>
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
    </Edit>
  );
};
