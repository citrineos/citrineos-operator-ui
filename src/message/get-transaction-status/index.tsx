import { AttributeEnumType, GetVariableStatusEnumType } from '@citrineos/base';
import React from 'react';
import { Form } from 'antd';
import {
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsString,
    MaxLength,
    ValidateNested,
} from 'class-validator';
import { GenericForm } from '../../components/form';
import { plainToInstance, Type } from 'class-transformer';
import { triggerMessageAndHandleResponse } from '../util';
import { ChargingStation } from '../../pages/charging-stations/ChargingStation';
import { GqlAssociation } from '../../util/decorators/GqlAssociation';
import { StatusInfoType } from '../model/StatusInfoType';
import { ClassCustomConstructor } from '../../util/decorators/ClassCustomConstructor';
import { NEW_IDENTIFIER } from '../../util/consts';
import { Transaction, TransactionProps } from '../../pages/transactions/Transaction';
import { TRANSACTION_GET_QUERY, TRANSACTION_LIST_QUERY } from '../../pages/transactions/queries';
import { GET_ACTIVE_TRANSACTIONS } from '../remote-stop/queries';

enum GetTransactionStatusRequestProps {
    transaction = "transaction",
}

export class GetTransactionStatusRequest {
    @GqlAssociation({
        parentIdFieldName: TransactionProps.transactionId,
        associatedIdFieldName: TransactionProps.chargingState,
        gqlQuery: GET_ACTIVE_TRANSACTIONS,
        gqlListQuery: GET_ACTIVE_TRANSACTIONS,
        gqlUseQueryVariablesKey: GetTransactionStatusRequestProps.transaction
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

export const GetTransactionStatus: React.FC<GetTransactionStatusProps> = ({ station }) => {
    const [form] = Form.useForm();
    const formProps = {
        form,
    };

    const handleSubmit = async (plainValues: any) => {
    }

    const getTransactionStatusRequest = new GetTransactionStatusRequest();

    const transaction = new Transaction();
    transaction.transactionId = NEW_IDENTIFIER as unknown as number;
    getTransactionStatusRequest[GetTransactionStatusRequestProps.transaction] = transaction;
    console.log(getTransactionStatusRequest);

    // getTransactionStatusRequest[GetTransactionStatusRequestProps.getTransactionStatusData] = [
    //     GetTransactionStatusDataCustomConstructor(),
    // ];

    // const handleSubmit = async (plainValues: any) => {
    //     const classInstance = plainToInstance(GetTransactionStatusRequest, plainValues);
    //     const getTransactionStatusRequest = {
    //         [GetTransactionStatusRequestProps.getTransactionStatusData]: classInstance[
    //             GetTransactionStatusRequestProps.getTransactionStatusData
    //         ].map((item: GetTransactionStatusData) => {
    //             if (item && item[GetTransactionStatusDataProps.evse]) {
    //                 const evse: Evse = item[GetTransactionStatusDataProps.evse]!;
    //                 const transaction: Transaction = item[GetTransactionStatusDataProps.transactionStatus]!;
    //                 return {
    //                     component: {
    //                         name: component[ComponentProps.name],
    //                         evse: {
    //                             id: evse[EvseProps.databaseId],
    //                             connectorId: evse[EvseProps.connectorId],
    //                             // customData: null // todo
    //                         },
    //                         instance: item[GetTransactionStatusDataProps.componentInstance],
    //                         // customData: null // todo
    //                     },
    //                     transaction: {
    //                         id: transaction[TransactionProps.transactionId],
    //                         chargingStationId: transaction[TransactionProps.stationId]
    //                     },
    //                     attributeType: item[GetTransactionStatusDataProps.attributeType],
    //                     // customData: null // todo
    //                 };
    //             } else {
    //                 return null;
    //             }
    //         }),
    //         // customData: null // todo
    //     };
    //     await triggerMessageAndHandleResponse(
    //         `/ocpp/monitoring/GetTransactionStatus?identifier=${station.id}&tenantId=1`,
    //         GetTransactionStatusResponse,
    //         getTransactionStatusRequest,
    //         (response: GetTransactionStatusResponse) => !!response,
    //     );
    // };

    return (
        <GenericForm
            formProps={formProps}
            dtoClass={GetTransactionStatusRequest}
            onFinish={handleSubmit}
            initialValues={getTransactionStatusRequest}
            parentRecord={getTransactionStatusRequest}
            gqlQueryVariablesMap={{
                [GetTransactionStatusRequestProps.transaction]: {
                    stationId: station.id,
                },
            }}
        />
    );
};
