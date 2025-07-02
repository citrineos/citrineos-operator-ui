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
import { IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { GqlAssociation } from '@util/decorators/GqlAssociation';
import { NEW_IDENTIFIER } from '@util/consts';
import {
  Transaction,
  TransactionProps,
} from '../../../pages/transactions/Transaction';
import { getSelectedChargingStation } from '../../../redux/selected.charging.station.slice';
import { GET_TRANSACTION_LIST_FOR_STATION } from '../../queries';

enum GetTransactionStatusRequestProps {
  transaction = 'transaction',
}

export class GetTransactionStatusRequest {
  // todo
  // @Type(() => CustomDataType)
  // @ValidateNested()
  // customData?: CustomDataType;

  @GqlAssociation({
    parentIdFieldName: GetTransactionStatusRequestProps.transaction,
    associatedIdFieldName: TransactionProps.id,
    gqlListQuery: {
      query: GET_TRANSACTION_LIST_FOR_STATION,
      getQueryVariables: (_: GetTransactionStatusRequest, selector: any) => {
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

export interface GetTransactionStatusProps {
  station: ChargingStation;
}

export const GetTransactionStatus: React.FC<GetTransactionStatusProps> = ({
  station,
}) => {
  const [form] = Form.useForm();
  const formProps = {
    form,
  };

  const getTransactionStatusRequest = new GetTransactionStatusRequest();

  const transaction = new Transaction();
  transaction.id = NEW_IDENTIFIER as unknown as number;
  getTransactionStatusRequest[GetTransactionStatusRequestProps.transaction] =
    transaction;

  const handleSubmit = async (request: GetTransactionStatusRequest) => {
    let data: any = {};

    if (
      request &&
      request[GetTransactionStatusRequestProps.transaction] &&
      request[GetTransactionStatusRequestProps.transaction][
        TransactionProps.transactionId
      ] != NEW_IDENTIFIER
    ) {
      data = {
        transactionId:
          request[GetTransactionStatusRequestProps.transaction][
            TransactionProps.transactionId
          ],
      };
    }

    await triggerMessageAndHandleResponse<MessageConfirmation[]>({
      url: `/transactions/getTransactionStatus?identifier=${station.id}&tenantId=1`,
      data,
      ocppVersion: OCPPVersion.OCPP2_0_1,
    });
  };

  return (
    <GenericForm
      formProps={formProps}
      dtoClass={GetTransactionStatusRequest}
      onFinish={handleSubmit}
      initialValues={getTransactionStatusRequest}
      parentRecord={getTransactionStatusRequest}
    />
  );
};
