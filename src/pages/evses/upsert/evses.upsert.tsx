// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback, useState } from 'react';
import { useForm, useSelect } from '@refinedev/antd';
import { Form, Input, Button, Select, Tooltip } from 'antd';

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
import { InfoCircleOutlined } from '@ant-design/icons';

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
      <Form.Item
        name={EvseDtoProps.evseTypeId}
        label={
          <span>
            Evse Type ID{' '}
            <Tooltip title="This is the serial int used in OCPP 2.0.1 to refer to the EVSE, unique per Charging Station.">
              <InfoCircleOutlined style={{ color: '#1890ff' }} />
            </Tooltip>
          </span>
        }
      >
        <Input id="evseTypeId" name="evseTypeId" type="number" />
      </Form.Item>
      <Form.Item
        name={EvseDtoProps.evseId}
        label={
          <span>
            Evse ID{' '}
            <Tooltip title="This is the eMI3 compliant EVSE ID, which must be globally unique.">
              <InfoCircleOutlined style={{ color: '#1890ff' }} />
            </Tooltip>
          </span>
        }
        rules={[{ required: true, message: 'Please input the EVSE ID!' }]}
      >
        <Input id="evseId" name="evseId" type="text" />
      </Form.Item>
      <Form.Item
        name={EvseDtoProps.physicalReference}
        label={
          <span>
            Physical Reference{' '}
            <Tooltip title="Any identifier printed on the EVSE used to identify it when physically at the location, e.g. a number or a letter.">
              <InfoCircleOutlined style={{ color: '#1890ff' }} />
            </Tooltip>
          </span>
        }
      >
        <Input id="physicalReference" name="physicalReference" type="text" />
      </Form.Item>
      <Form.Item name={EvseDtoProps.removed} label="Removed">
        <Select id="removed">
          <Select.Option value={true}>Yes</Select.Option>
          <Select.Option value={false}>No</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item style={{ textAlign: 'right' }}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};
