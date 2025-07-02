// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { Form } from 'antd';
import { MessageConfirmation } from '../../MessageConfirmation';
import { ChargingStation } from '../../../pages/charging-stations/ChargingStation';
import { IsNotEmpty } from 'class-validator';
import { triggerMessageAndHandleResponse } from '../../util';
import { GenericForm } from '../../../components/form';
import { OCPPVersion } from '@citrineos/base';
import { GqlAssociation } from '@util/decorators/GqlAssociation';
import { Type } from 'class-transformer';
import { GET_ACTIVE_TRANSACTION_LIST_FOR_STATION } from '../../queries';
import {
  TransactionProps,
  Transaction,
} from '../../../pages/transactions/Transaction';
import { getSelectedChargingStation } from '../../../redux/selected.charging.station.slice';

enum RemoteStopTransactionDataProps {
  transaction = 'transaction',
}

export interface RemoteStopTransactionProps {
  station: ChargingStation;
}

class RemoteStopTransactionData {
  @GqlAssociation({
    parentIdFieldName: RemoteStopTransactionDataProps.transaction,
    associatedIdFieldName: TransactionProps.id,
    gqlListQuery: {
      query: GET_ACTIVE_TRANSACTION_LIST_FOR_STATION,
      getQueryVariables: (_: RemoteStopTransactionData, selector: any) => {
        const station = selector(getSelectedChargingStation()) || {};
        return {
          stationId: station.id,
        };
      },
    },
  })
  @Type(() => Transaction)
  @IsNotEmpty()
  transaction!: Transaction | null;
}

export const RemoteStopTransaction: React.FC<RemoteStopTransactionProps> = ({
  station,
}) => {
  const [form] = Form.useForm();
  const formProps = {
    form,
  };

  const remoteStopTransactionData = new RemoteStopTransactionData();

  const handleSubmit = async (request: RemoteStopTransactionData) => {
    if (request.transaction) {
      const data = { transactionId: request.transaction.id };

      await triggerMessageAndHandleResponse<MessageConfirmation[]>({
        url: `/evdriver/remoteStopTransaction?identifier=${station.id}&tenantId=1`,
        data,
        ocppVersion: OCPPVersion.OCPP1_6,
      });
    }
  };

  return (
    <GenericForm
      formProps={formProps}
      dtoClass={RemoteStopTransactionData}
      onFinish={handleSubmit}
      parentRecord={remoteStopTransactionData}
      initialValues={remoteStopTransactionData}
    />
  );
};
