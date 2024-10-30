import React from 'react';
import { Form } from 'antd';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { GenericForm } from '../../components/form';
import { plainToInstance, Type } from 'class-transformer';
import { triggerMessageAndHandleResponse } from '../util';
import { ChargingStation } from '../../pages/charging-stations/ChargingStation';
import { GqlAssociation } from '../../util/decorators/GqlAssociation';
import { NEW_IDENTIFIER } from '../../util/consts';
import {
  Transaction,
  TransactionProps,
} from '../../pages/transactions/Transaction';
import { GET_ACTIVE_TRANSACTIONS } from '../remote-stop/queries';
import { GET_TRANSACTION_LIST_FOR_STATION } from '../queries';
import { MessageConfirmation } from '../MessageConfirmation';
import { getSelectedChargingStation } from '../../redux/selectedChargingStationSlice';

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
    associatedIdFieldName: TransactionProps.transactionId,
    gqlQuery: GET_ACTIVE_TRANSACTIONS,
    gqlListQuery: GET_TRANSACTION_LIST_FOR_STATION,
    getGqlQueryVariables: (_: GetTransactionStatusRequest, selector: any) => {
      const station = selector(getSelectedChargingStation()) || {};
      return {
        stationId: station.id,
      };
    },
  })
  @Type(() => Transaction)
  @IsNotEmpty()
  transaction!: Transaction | null;
}

export class GetTransactionStatusResultType {
  @Type(() => Transaction)
  @ValidateNested()
  @IsNotEmpty()
  transaction!: Transaction;
}

export class GetTransactionStatusResponse {
  @Type(() => GetTransactionStatusResultType)
  @IsNotEmpty()
  getTransactionStatusResult!: GetTransactionStatusResultType;
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

  const handleSubmit = async (plainValues: any) => {
    const classInstance = plainToInstance(
      GetTransactionStatusRequest,
      plainValues,
    );

    let data: any = {};

    if (
      classInstance &&
      classInstance[GetTransactionStatusRequestProps.transaction] &&
      classInstance[GetTransactionStatusRequestProps.transaction][
        TransactionProps.transactionId
      ] != NEW_IDENTIFIER
    ) {
      data = {
        transactionId:
          classInstance[GetTransactionStatusRequestProps.transaction][
            TransactionProps.transactionId
          ],
      };
    }

    await triggerMessageAndHandleResponse(
      `/transactions/getTransactionStatus?identifier=${station.id}&tenantId=1`,
      MessageConfirmation,
      data,
      (response: MessageConfirmation) => response && response.success,
    );
  };

  const getTransactionStatusRequest = new GetTransactionStatusRequest();

  const transaction = new Transaction();
  transaction.transactionId = NEW_IDENTIFIER as unknown as string;
  getTransactionStatusRequest[GetTransactionStatusRequestProps.transaction] =
    transaction;

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
