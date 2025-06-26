// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback, useState } from 'react';
import { useForm, useSelect } from '@refinedev/antd';
import { Form, Input, Button, Select } from 'antd';

import { EvseDto } from '../../../dtos/evse.dto';
import { ResourceType } from '@util/auth';
import { BaseDtoProps } from '../../../dtos/base.dto';
import { getSerializedValues } from '@util/middleware';
import { ConnectorDto } from '../../../dtos/connector.dto';
import { EVSE_CREATE_MUTATION, EVSE_EDIT_MUTATION } from '../queries';
import { CONNECTOR_LIST_QUERY } from '../../../pages/connectors/queries';

interface EvseUpsertProps {
  onSubmit: () => void;
  evse: EvseDto | null;
}

export const EvseUpsert: React.FC<EvseUpsertProps> = ({ onSubmit, evse }) => {
  const [formData, setFormData] = useState({
    id: evse !== null ? evse.id : 0,
    connectorId: evse !== null ? evse.connectorId : undefined,
  });

  const { formProps, form } = useForm({
    resource: ResourceType.EVSES,
    id: formData.id,
    redirect: false,
    meta: {
      gqlMutation: evse === null ? EVSE_CREATE_MUTATION : EVSE_EDIT_MUTATION,
    },
    onMutationSuccess: () => {
      setFormData({
        id: 0,
        connectorId: undefined,
      });
      form.resetFields();
      onSubmit();
    },
  });

  const onFinish = useCallback(
    async (input: any) => {
      const newItem: any = getSerializedValues(input, EvseDto);
      formProps.onFinish?.(newItem);
    },
    [formProps],
  );

  const { selectProps: connectors } = useSelect<ConnectorDto>({
    resource: ResourceType.CONNECTORS,
    optionLabel: (connector) =>
      `${connector.connectorId} "-" ${connector.status?.valueOf()}`,
    optionValue: (connector) => `${connector.id}`,
    meta: {
      gqlQuery: CONNECTOR_LIST_QUERY,
      gqlVariables: {
        offset: 0,
        limit: 5,
      },
    },
    sorters: [{ field: BaseDtoProps.updatedAt, order: 'desc' }],
    pagination: { mode: 'off' },
  });

  return (
    <Form
      {...formProps}
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={formData}
    >
      <Form.Item
        name="id"
        label="ID"
        rules={[{ required: true, message: 'Please input the ID!' }]}
      >
        <Input id="id" name="id" type="text" />
      </Form.Item>
      <Form.Item label="Connector ID" name="connectorId">
        <Select {...connectors} id="connectorId" />
      </Form.Item>
      <Form.Item style={{ textAlign: 'right' }}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};
