// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect, useState } from 'react';
import { Button, Flex, Form, Select, Spin } from 'antd';
import { ChargingStationDto } from '../../../dtos/charging.station.dto';
import { closeModal, selectIsModalOpen } from '../../../redux/modal.slice';
import { useDispatch, useSelector } from 'react-redux';
import { EvseSelector } from '../../shared/evse-selector/evse.selector';
import { ResetEnumType } from '@OCPP2_0_1';
import { triggerMessageAndHandleResponse } from '../../../message/util';
import { MessageConfirmation } from '../../../message/MessageConfirmation';

export interface OCPP2_0_1_ResetProps {
  station: ChargingStationDto;
}

export const OCPP2_0_1_Reset = ({ station }: OCPP2_0_1_ResetProps) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  const [evseLoading, setEvseLoading] = useState<boolean>(false);
  const isModalOpen = useSelector(selectIsModalOpen);

  const handleSubmit = async ({
    type,
    evseId,
  }: {
    type: ResetEnumType;
    evseId?: number;
  }) => {
    const data = { type, evseId };

    await triggerMessageAndHandleResponse<MessageConfirmation[]>({
      url: `/configuration/reset?identifier=${station.id}&tenantId=1`,
      data,
      setLoading,
    });
  };

  useEffect(() => {
    if (isModalOpen) {
      form.resetFields();
    }
  }, [isModalOpen, form]);

  if (loading || evseLoading) {
    return <Spin />;
  }

  const handleEvseSelection = (value: any) => {
    form.setFieldsValue({ evseId: Number(value) });
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
      <Flex vertical gap={16}>
        <Form.Item
          label="Reset Type"
          name="type"
          rules={[{ required: true, message: 'Please select a reset type' }]}
        >
          <Select className="full-width" placeholder="Select reset type">
            {Object.values(ResetEnumType).map((type) => (
              <Select.Option key={type} value={type}>
                {type}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <EvseSelector
          station={station}
          onSelect={handleEvseSelection}
          onLoading={setEvseLoading}
          isOptional={true}
        />

        <Flex justify="end" gap={8}>
          <Button onClick={() => dispatch(closeModal())}>Cancel</Button>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Flex>
      </Flex>
    </Form>
  );
};
