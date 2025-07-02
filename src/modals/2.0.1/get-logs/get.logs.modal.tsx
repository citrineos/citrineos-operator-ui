// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect, useMemo, useState } from 'react';
import { Button, Flex, Form, Select, Spin } from 'antd';
import { ChargingStationDto } from '../../../dtos/charging.station.dto';
import { plainToInstance } from 'class-transformer';
import { closeModal, selectIsModalOpen } from '../../../redux/modal.slice';
import { useDispatch, useSelector } from 'react-redux';
import { LogEnumType } from '@OCPP2_0_1';
import { triggerMessageAndHandleResponse } from '../../../message/util';
import { MessageConfirmation } from '../../../message/MessageConfirmation';

export interface GetLogsModalProps {
  station: any;
}

export const GetLogsModal = ({ station }: GetLogsModalProps) => {
  const dispatch = useDispatch();
  const isModalOpen = useSelector(selectIsModalOpen);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const parsedStation: ChargingStationDto = useMemo(
    () => plainToInstance(ChargingStationDto, station),
    [station],
  );

  const remoteLocation = 'http://localhost:4566/citrineos-s3-bucket/';

  const requestGetLogs = async (logType: LogEnumType) => {
    if (!parsedStation?.id) {
      console.error(
        'Error: Cannot request logs because station ID is missing.',
      );
      return;
    }

    const data = {
      log: {
        remoteLocation,
        oldestTimestamp: new Date().toISOString(),
        latestTimestamp: new Date().toISOString(),
      },
      logType,
      requestId: 0,
    };

    await triggerMessageAndHandleResponse<MessageConfirmation[]>({
      url: `/reporting/getLog?identifier=${parsedStation.id}&tenantId=1`,
      data,
      setLoading,
    });
  };

  useEffect(() => {
    if (isModalOpen) {
      form.resetFields();
      form.setFieldsValue({
        logType: LogEnumType.DiagnosticsLog,
      });
    }
  }, [isModalOpen, form]);

  const onFinish = async ({ logType }: { logType: LogEnumType }) => {
    if (!parsedStation?.id) {
      console.error(
        'Error: Cannot submit Get Logs request because station ID is missing.',
      );
      return;
    }
    await requestGetLogs(logType);
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Flex vertical gap={16}>
        <Flex>
          <Form.Item
            label="Log Type"
            name="logType"
            rules={[{ required: true, message: 'Log Type is required' }]}
          >
            <Select className="full-width" placeholder="Select Log Type">
              <Select.Option value={LogEnumType.DiagnosticsLog}>
                Diagnostics Log
              </Select.Option>
              <Select.Option value={LogEnumType.SecurityLog}>
                Security Log
              </Select.Option>
            </Select>
          </Form.Item>
        </Flex>

        <Form.Item name="remoteLocation" hidden>
          <input type="hidden" value={remoteLocation} />
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
