// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { Form } from 'antd';
import { MessageConfirmation } from '../../MessageConfirmation';
import { ChargingStation } from '../../../pages/charging-stations/ChargingStation';
import { triggerMessageAndHandleResponse } from '../../util';
import { GenericForm } from '../../../components/form';
import { OCPPVersion } from '@citrineos/base';
import { Type } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { GqlAssociation } from '@util/decorators/GqlAssociation';
import { NEW_IDENTIFIER } from '@util/consts';
import {
  Transaction,
  TransactionProps,
} from '../../../pages/transactions/Transaction';
import { getSelectedChargingStation } from '../../../redux/selected.charging.station.slice';
import { GET_ACTIVE_TRANSACTION_LIST_FOR_STATION } from '../../queries';

export enum RemoteStopRequestProps {
  transaction = 'transaction',
}

export class RemoteStopRequest {
  @GqlAssociation({
    parentIdFieldName: RemoteStopRequestProps.transaction,
    associatedIdFieldName: TransactionProps.id,
    gqlListQuery: {
      query: GET_ACTIVE_TRANSACTION_LIST_FOR_STATION,
      getQueryVariables: (_: RemoteStopRequest, selector: any) => {
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

export interface RemoteStopProps {
  station: ChargingStation;
}

export const RemoteStop: React.FC<RemoteStopProps> = ({ station }) => {
  const [form] = Form.useForm();
  const formProps = {
    form,
  };

  const remoteStopRequest = new RemoteStopRequest();
  const transaction = new Transaction();
  transaction.id = NEW_IDENTIFIER as unknown as number;
  remoteStopRequest[RemoteStopRequestProps.transaction] = transaction;

  const handleSubmit = async (request: RemoteStopRequest) => {
    const selectedTransaction = request.transaction;
    if (selectedTransaction) {
      await triggerMessageAndHandleResponse<MessageConfirmation[]>({
        url: `/evdriver/requestStopTransaction?identifier=${station.id}&tenantId=1`,
        data: { transactionId: selectedTransaction.transactionId },
        ocppVersion: OCPPVersion.OCPP2_0_1,
      });
    }
  };

  return (
    <GenericForm
      formProps={formProps}
      dtoClass={RemoteStopRequest}
      onFinish={handleSubmit}
      initialValues={remoteStopRequest}
      parentRecord={remoteStopRequest}
    />
  );
};
