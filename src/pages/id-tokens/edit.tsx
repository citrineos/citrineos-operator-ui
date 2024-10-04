import type { HttpError } from '@refinedev/core';

import { Edit, ListButton, RefreshButton, useForm } from '@refinedev/antd';

import { Form, Input } from 'antd';

import type {
  IdTokensEditMutation,
  IdTokensEditMutationVariables,
} from '../../graphql/types';
import type { GetFields, GetVariables } from '@refinedev/hasura';
import { ID_TOKENS_EDIT_MUTATION } from './queries';

export const IdTokensEdit = () => {
  const { formProps, saveButtonProps, queryResult, formLoading } = useForm<
    GetFields<IdTokensEditMutation>,
    HttpError,
    GetVariables<IdTokensEditMutationVariables>
  >({
    metaData: {
      gqlMutation: ID_TOKENS_EDIT_MUTATION,
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
    </Edit>
  );
};
