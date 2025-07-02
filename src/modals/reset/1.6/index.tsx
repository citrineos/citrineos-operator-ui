// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect, useState } from 'react';
import { Button, Flex, Form, Select, Spin } from 'antd';
import { ChargingStationDto } from '../../../dtos/charging.station.dto';
import { closeModal, selectIsModalOpen } from '../../../redux/modal.slice';
import { useDispatch, useSelector } from 'react-redux';
import { triggerMessageAndHandleResponse } from '../../../message/util';
import { MessageConfirmation } from '../../../message/MessageConfirmation';
import { OCPPVersion } from '@citrineos/base';
import { ResetRequestType } from '@OCPP1_6';

export interface OCPP1_6_ResetProps {
  station: ChargingStationDto;
}

export const OCPP1_6_Reset = ({ station }: OCPP1_6_ResetProps) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  const isModalOpen = useSelector(selectIsModalOpen);

  const handleSubmit = async ({ type }: { type: ResetRequestType }) => {
    const data = { type };

    await triggerMessageAndHandleResponse<MessageConfirmation[]>({
      url: `/configuration/reset?identifier=${station.id}&tenantId=1`,
      data,
      setLoading,
      ocppVersion: OCPPVersion.OCPP1_6,
    });
  };

  useEffect(() => {
    if (isModalOpen) {
      form.resetFields();
    }
  }, [isModalOpen, form]);

  if (loading) {
    return <Spin />;
  }

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
      <Flex vertical gap={16}>
        <Form.Item
          label="Reset Type"
          name="type"
          rules={[{ required: true, message: 'Please select a reset type' }]}
        >
          <Select className="full-width" placeholder="Select reset type">
            {Object.values(ResetRequestType).map((type) => (
              <Select.Option key={type} value={type}>
                {type}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

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
