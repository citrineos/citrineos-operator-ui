// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect } from 'react';
import { Button, Flex, Form } from 'antd';
import { closeModal, selectIsModalOpen } from '../../../redux/modal.slice';
import { useDispatch, useSelector } from 'react-redux';
import { OCPPVersion } from '@citrineos/base';
import { MessageConfirmation } from '../../../message/MessageConfirmation';
import { triggerMessageAndHandleResponse } from '../../../message/util';
import { IChargingStationDto } from '@citrineos/base';

export interface OCPP2_0_1_RemoteStopProps {
  station: IChargingStationDto;
}

export const OCPP2_0_1_RemoteStop = ({
  station,
}: OCPP2_0_1_RemoteStopProps) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const isModalOpen = useSelector(selectIsModalOpen);

  useEffect(() => {}, [isModalOpen, form]);

  // TODO: Fetch transactions for the station separately, as transactions is not a direct property
  // For now, skip transaction logic to avoid type errors
  // useEffect(() => {
  //   if (station.transactions && station.transactions.length > 0) {
  //     form.setFieldsValue({
  //       transactionId: station.transactions[0].transactionId,
  //     });
  //   }
  // }, [station, form]);

  // if (loading || !station.transactions) {
  //   return <Spin />;
  // }

  // const activeTransactions = station.transactions.filter((tx) => tx.isActive);
  // if (activeTransactions.length === 0) {
  //   return (
  //     <Flex vertical gap={16}>
  //       <div>No active transactions found for this charging station.</div>
  //       <Flex justify="end" gap={8}>
  //         <Button onClick={() => dispatch(closeModal())}>Close</Button>
  //       </Flex>
  //     </Flex>
  //   );
  // }

  // Render fallback UI or message
  return (
    <Flex vertical gap={16}>
      <div>
        Transaction data not available. Please implement transaction fetching
        logic.
      </div>
      <Flex justify="end" gap={8}>
        <Button onClick={() => dispatch(closeModal())}>Close</Button>
      </Flex>
    </Flex>
  );
};
