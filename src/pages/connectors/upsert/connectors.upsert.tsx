// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { useForm } from '@refinedev/antd';
import { useSelector } from 'react-redux';
import { Form, Input, Button, Select, InputNumber, Tooltip } from 'antd';
import React, { useCallback, useState, useMemo, useEffect } from 'react';

import { ResourceType } from '@util/auth';
import { getSerializedValues } from '@util/middleware';
import { ConnectorDto } from '../../../dtos/connector.dto';
import { CONNECTOR_CREATE_MUTATION, CONNECTOR_EDIT_MUTATION } from '../queries';
import { ErrorCodes, ConnectorStatusEnumType } from '@OCPP2_0_1';
import { getSelectedChargingStation } from '../../../redux/selected.charging.station.slice';
import {
  IConnectorDto,
  ConnectorDtoProps,
  ConnectorTypeEnum,
  ConnectorFormatEnum,
  ConnectorPowerType,
} from '@citrineos/base';
import { InfoCircleOutlined } from '@ant-design/icons';

const { Option } = Select;

interface ConnectorUpsertProps {
  onSubmit: () => void;
  connector: IConnectorDto | null;
  evseId?: number | null;
}

export const ConnectorsUpsert: React.FC<ConnectorUpsertProps> = ({
  onSubmit,
  connector,
  evseId,
}) => {
  const selectedChargingStation = useSelector(getSelectedChargingStation());
  const [id, setId] = useState<number | undefined>(undefined);

  const initialFormData = useMemo(
    () => ({
      id: connector?.id,
      stationId: connector?.stationId || selectedChargingStation?.id || '',
      connectorId: connector?.connectorId || '',
      evseTypeConnectorId: connector?.evseTypeConnectorId || '',
      type: connector?.type,
      format: connector?.format,
      powerType: connector?.powerType,
      maximumAmperage: connector?.maximumAmperage,
      maximumVoltage: connector?.maximumVoltage,
      maximumPowerWatts: connector?.maximumPowerWatts,
      termsAndConditionsUrl: connector?.termsAndConditionsUrl,
    }),
    [connector, selectedChargingStation?.id],
  );

  const { formProps, form } = useForm({
    resource: ResourceType.CONNECTORS,
    id: id,
    redirect: false,
    meta: {
      gqlMutation:
        connector === null
          ? CONNECTOR_CREATE_MUTATION
          : CONNECTOR_EDIT_MUTATION,
      gqlVariables: { id },
    },
    onMutationSuccess: () => {
      if (!connector) {
        form.resetFields();
      }
      onSubmit();
    },
  });

  useEffect(() => {
    setId(connector?.id);

    form.setFieldsValue(initialFormData);
  }, [connector, form, initialFormData]);

  const onFinish = useCallback(
    async (input: any) => {
      if (evseId) {
        input.evseId = evseId;
      }
      if (connector?.id) {
        setId(connector.id);
      }
      const newItem: any = getSerializedValues(input, ConnectorDto);
      formProps.onFinish?.(newItem);
    },
    [formProps, evseId, connector?.id],
  );

  return (
    <Form
      {...formProps}
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={initialFormData}
    >
      <Form.Item
        name={ConnectorDtoProps.stationId}
        label="Station ID"
        rules={[{ required: true, message: 'Please input the Station ID!' }]}
      >
        <Input
          id="stationId"
          name="stationId"
          type="text"
          disabled={!!selectedChargingStation?.id}
        />
      </Form.Item>
      <Form.Item
        label={
          <span>
            Connector ID{' '}
            <Tooltip title="This is the serial int starting at 1 used in OCPP 1.6 to refer to the connector, unique per Charging Station.">
              <InfoCircleOutlined style={{ color: '#1890ff' }} />
            </Tooltip>
          </span>
        }
        name={ConnectorDtoProps.connectorId}
      >
        <Input type="text" id="connectorId" name="connectorId" required />
      </Form.Item>
      <Form.Item
        label={
          <span>
            Evse Type Connector ID{' '}
            <Tooltip title="This is the serial int starting at 1 used in OCPP 2.0.1 to refer to the connector, unique per EVSE.">
              <InfoCircleOutlined style={{ color: '#1890ff' }} />
            </Tooltip>
          </span>
        }
        name={ConnectorDtoProps.evseTypeConnectorId}
      >
        <Input
          type="text"
          id="evseTypeConnectorId"
          name="evseTypeConnectorId"
          required
        />
      </Form.Item>
      <Form.Item label="Type" name={ConnectorDtoProps.type}>
        <Select id="type">
          {Object.values(ConnectorTypeEnum).map((type) => (
            <Option key={type} value={type}>
              {type}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item label="Format" name={ConnectorDtoProps.format}>
        <Select id="format">
          {Object.values(ConnectorFormatEnum).map((format) => (
            <Option key={format} value={format}>
              {format}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item label="Power Type" name={ConnectorDtoProps.powerType}>
        <Select id="powerType">
          {Object.values(ConnectorPowerType).map((powerType) => (
            <Option key={powerType} value={powerType}>
              {powerType}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        label="Maximum Amperage"
        name={ConnectorDtoProps.maximumAmperage}
      >
        <InputNumber id="maximumAmperage" name="maximumAmperage" />
      </Form.Item>
      <Form.Item
        label="Maximum Voltage"
        name={ConnectorDtoProps.maximumVoltage}
      >
        <InputNumber id="maximumVoltage" name="maximumVoltage" />
      </Form.Item>
      <Form.Item
        label="Maximum Power Watts"
        name={ConnectorDtoProps.maximumPowerWatts}
      >
        <InputNumber id="maximumPowerWatts" name="maximumPowerWatts" />
      </Form.Item>
      <Form.Item
        label="Terms and Conditions URL"
        name={ConnectorDtoProps.termsAndConditionsUrl}
      >
        <Input
          type="text"
          id="termsAndConditionsUrl"
          name="termsAndConditionsUrl"
        />
      </Form.Item>
      <Form.Item style={{ textAlign: 'right' }}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};
