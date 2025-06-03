// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect, useMemo, useState } from 'react';
import { Button, Flex, Form, Select, Spin } from 'antd';
import { ChargingStationDto } from '../../../dtos/charging.station.dto';
import { closeModal, selectIsModalOpen } from '../../../redux/modal.slice';
import { useDispatch, useSelector } from 'react-redux';
import { EvseDto } from '../../../dtos/evse.dto';
import { OCPPVersion } from '@citrineos/base';
import { MessageConfirmation } from '../../../message/MessageConfirmation';
import { triggerMessageAndHandleResponse } from '../../../message/util';

export interface OCPP2_0_1_RemoteStopProps {
  station: ChargingStationDto;
}

export const OCPP2_0_1_RemoteStop = ({
  station,
}: OCPP2_0_1_RemoteStopProps) => {
  const evseMap: Map<number, EvseDto> = useMemo(() => {
    if (!station.evses) return new Map<number, EvseDto>();
    return new Map(station.evses.map((evse) => [evse.databaseId, evse]));
  }, [station.evses]);

  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  const isModalOpen = useSelector(selectIsModalOpen);

  const onFinish = async ({ transactionId }: { transactionId: string }) => {
    const data = { transactionId };

    await triggerMessageAndHandleResponse<MessageConfirmation[]>({
      url: `/evdriver/requestStopTransaction?identifier=${station.id}&tenantId=1`,
      data,
      ocppVersion: OCPPVersion.OCPP2_0_1,
      setLoading,
    });
  };

  useEffect(() => {
    if (isModalOpen) {
      form.resetFields();
    }
  }, [isModalOpen, form]);

  // Set initial value when transactions are loaded
  useEffect(() => {
    if (station.transactions && station.transactions.length > 0) {
      form.setFieldsValue({
        transactionId: station.transactions[0].transactionId,
      });
    }
  }, [station, form]);

  if (loading || !station.transactions) {
    return <Spin />;
  }

  // Handle the case when there are no active transactions
  if (station.transactions.length === 0) {
    return (
      <Flex vertical gap={16}>
        <div>No active transactions found for this charging station.</div>
        <Flex justify="end" gap={8}>
          <Button onClick={() => dispatch(closeModal())}>Close</Button>
        </Flex>
      </Flex>
    );
  }

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Flex vertical gap={16}>
        <Flex>
          <Form.Item
            label="Active Transactions"
            name="transactionId"
            rules={[{ required: true, message: 'Please select a transaction' }]}
          >
            <Select className="full-width" placeholder="Select a transaction">
              {station.transactions.map((transaction) => {
                const evse = transaction.evseDatabaseId
                  ? evseMap.get(transaction.evseDatabaseId)
                  : null;

                return (
                  <Select.Option
                    key={transaction.transactionId}
                    value={transaction.transactionId}
                  >
                    {`EVSE: ${evse?.id ?? 'Unknown'} - ${transaction.transactionId}`}
                  </Select.Option>
                );
              })}
            </Select>
          </Form.Item>
        </Flex>
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
