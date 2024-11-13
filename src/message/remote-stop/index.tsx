import React from 'react';
import { Form } from 'antd';
import { MessageConfirmation } from '../MessageConfirmation';
import { ChargingStation } from '../../pages/charging-stations/ChargingStation';
import { triggerMessageAndHandleResponse } from '../util';
import { GET_ACTIVE_TRANSACTION_LIST_FOR_STATION } from '../queries';
import { plainToInstance, Type } from 'class-transformer';
import { GenericForm } from '../../components/form';
import {
  Transaction,
  TransactionProps,
} from '../../pages/transactions/Transaction';
import { NEW_IDENTIFIER } from '@util/consts';
import { GqlAssociation } from '@util/decorators/GqlAssociation';
import { getSelectedChargingStation } from '../../redux/selectedChargingStationSlice';
import { IsNotEmpty } from 'class-validator';

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

export const requestStopTransaction = async (
  stationId: string,
  transactionId: string,
  setLoading?: (loading: boolean) => void,
) => {
  await triggerMessageAndHandleResponse({
    url: `/evdriver/requestStopTransaction?identifier=${stationId}&tenantId=1`,
    responseClass: MessageConfirmation,
    data: { transactionId },
    responseSuccessCheck: (response: MessageConfirmation) =>
      response && response.success,
    setLoading,
  });
};

export const RemoteStop: React.FC<RemoteStopProps> = ({ station }) => {
  const [form] = Form.useForm();
  const formProps = {
    form,
  };

  const handleSubmit = async (plainValues: any) => {
    const remoteStopRequest = plainToInstance(RemoteStopRequest, plainValues);
    const selectedTransaction = remoteStopRequest.transaction;
    if (selectedTransaction) {
      await requestStopTransaction(
        station.id,
        selectedTransaction.transactionId,
      );
    }
  };

  const remoteStopRequest = new RemoteStopRequest();
  const transaction = new Transaction();
  transaction.id = NEW_IDENTIFIER as unknown as number;
  remoteStopRequest[RemoteStopRequestProps.transaction] = transaction;

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
