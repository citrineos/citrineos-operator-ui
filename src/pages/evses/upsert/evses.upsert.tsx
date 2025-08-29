// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback, useState } from 'react';
import { useForm, useSelect } from '@refinedev/antd';
import { Form, Input, Button, Select } from 'antd';

import { EvseDto } from '../../../dtos/evse.dto';
import { ResourceType } from '@util/auth';
import { getSerializedValues } from '@util/middleware';
import { EVSE_CREATE_MUTATION, EVSE_EDIT_MUTATION } from '../queries';
import { CONNECTOR_LIST_QUERY } from '../../connectors/queries';
import { BaseDtoProps } from '@citrineos/base';
import { IConnectorDto } from '@citrineos/base';
import { IEvseDto, EvseDtoProps } from '@citrineos/base';
import { useSelector } from 'react-redux';
import { getSelectedChargingStation } from '../../../redux/selected.charging.station.slice';

interface EvseUpsertProps {
  onSubmit: () => void;
  evse: IEvseDto | null;
}

export const EvseUpsert: React.FC<EvseUpsertProps> = ({ onSubmit, evse }) => {
  const [formData, setFormData] = useState({
    id: evse !== null ? evse.id : 0,
    stationId: evse !== null ? evse.stationId : '',
    evseTypeId: evse !== null ? evse.evseTypeId : undefined,
    evseId: evse !== null ? evse.evseId : '',
    physicalReference: evse !== null ? evse.physicalReference : '',
    removed: evse !== null ? evse.removed : false,
    chargingStation: evse !== null ? evse.chargingStation : undefined,
    connectorId:
      evse !== null ? evse.connectors?.at(0)?.connectorId : undefined,
  });

  const selectedChargingStation = useSelector(getSelectedChargingStation());
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
        stationId: '',
        evseTypeId: undefined,
        evseId: '',
        chargingStation: undefined,
        physicalReference: '',
        removed: false,
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

  const { selectProps: connectors } = useSelect<IConnectorDto>({
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
      <Form.Item name={EvseDtoProps.evseTypeId} label="EVSE Type ID">
        <Input id="evseTypeId" name="evseTypeId" type="number" />
      </Form.Item>
      <Form.Item
        name={EvseDtoProps.id}
        label="ID"
        rules={[{ required: true, message: 'Please input the ID!' }]}
      >
        <Input id="id" name="id" type="text" />
      </Form.Item>
      <Form.Item
        name={EvseDtoProps.evseId}
        label="EVSE ID"
        rules={[{ required: true, message: 'Please input the EVSE ID!' }]}
      >
        <Input id="evseId" name="evseId" type="text" />
      </Form.Item>
      <Form.Item
        name={EvseDtoProps.physicalReference}
        label="Physical Reference"
      >
        <Input id="physicalReference" name="physicalReference" type="text" />
      </Form.Item>
      <Form.Item name={EvseDtoProps.removed} label="Removed">
        <Select id="removed">
          <Select.Option value={true}>Yes</Select.Option>
          <Select.Option value={false}>No</Select.Option>
        </Select>
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
