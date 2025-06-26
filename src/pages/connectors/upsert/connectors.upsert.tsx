// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { useForm } from '@refinedev/antd';
import { useSelector } from 'react-redux';
import { Form, Input, Button, Select } from 'antd';
import React, { useCallback, useState } from 'react';

import { ResourceType } from '@util/auth';
import { getSerializedValues } from '@util/middleware';
import { ConnectorDto } from '../../../dtos/connector.dto';
import { CONNECTOR_CREATE_MUTATION, CONNECTOR_EDIT_MUTATION } from '../queries';
import { ErrorCodes, ConnectorStatusEnumType } from '@OCPP2_0_1';
import { getSelectedChargingStation } from '../../../redux/selected.charging.station.slice';

const { Option } = Select;

interface ConnectorUpsertProps {
  onSubmit: () => void;
  connector: ConnectorDto | null;
}

export const ConnectorsUpsert: React.FC<ConnectorUpsertProps> = ({
  onSubmit,
  connector,
}) => {
  const selectedChargingStation = useSelector(getSelectedChargingStation());

  console.log(
    'Selected Charging Station in ConnectorsUpsert:',
    selectedChargingStation,
  );
  const [formData, setFormData] = useState({
    id: connector !== null ? connector.id : 0,
    info: connector !== null ? connector.info : undefined,
    stationId:
      connector !== null
        ? connector.stationId
        : selectedChargingStation?.id || '',
    status: connector !== null ? connector.status : undefined,
    vendorId: connector !== null ? connector.vendorId : undefined,
    errorCode: connector !== null ? connector.errorCode : undefined,
    connectorId: connector !== null ? connector.connectorId : undefined,
    vendorErrorCode: connector !== null ? connector.vendorErrorCode : undefined,
  });

  const { formProps, form } = useForm({
    resource: ResourceType.CONNECTORS,
    id: formData.id,
    redirect: false,
    meta: {
      gqlMutation:
        connector === null
          ? CONNECTOR_CREATE_MUTATION
          : CONNECTOR_EDIT_MUTATION,
    },
    onMutationSuccess: () => {
      setFormData({
        id: 0,
        stationId: selectedChargingStation?.id || '',
        info: undefined,
        status: undefined,
        vendorId: undefined,
        errorCode: undefined,
        connectorId: undefined,
        vendorErrorCode: undefined,
      });
      form.resetFields();
      onSubmit();
    },
  });

  const onFinish = useCallback(
    async (input: any) => {
      const newItem: any = getSerializedValues(input, ConnectorDto);
      formProps.onFinish?.(newItem);
    },
    [formProps],
  );

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
      <Form.Item
        name="stationId"
        label="Station ID"
        rules={[{ required: true, message: 'Please input the Station ID!' }]}
      >
        <Input
          id="stationId"
          name="stationId"
          type="text"
          value={selectedChargingStation?.id || ''}
        />
      </Form.Item>
      <Form.Item label="Connector ID" name="connectorId">
        <Input type="text" id="connectorId" name="connectorId" required />
      </Form.Item>
      <Form.Item label="Status" name="status">
        <Select id="status">
          {Object.values(ConnectorStatusEnumType).map((status) => (
            <Option key={status} value={status}>
              {status}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item label="Error Code" name="errorCode">
        <Select id="errorCode">
          {Object.values(ErrorCodes).map((status) => (
            <Option key={status} value={status}>
              {status}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item label="Info" name="info">
        <Input type="text" id="info" name="info" />
      </Form.Item>
      <Form.Item label="Vendor ID" name="vendorId">
        <Input type="text" id="vendorId" name="vendorId" />
      </Form.Item>
      <Form.Item label="Vendor Error Code" name="vendorErrorCode">
        <Input type="text" id="vendorErrorCode" name="vendorErrorCode" />
      </Form.Item>
      <Form.Item style={{ textAlign: 'right' }}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};
