// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { Form, Spin } from 'antd';
import { MessageConfirmation } from '../../MessageConfirmation';
import { ChargingStation } from '../../../pages/charging-stations/ChargingStation';
import { triggerMessageAndHandleResponse } from '../../util';
import { GenericForm } from '../../../components/form';
import {
  EvseDtoProps,
  IdTokenDtoProps,
  IIdTokenDto,
  OCPPVersion,
} from '@citrineos/base';
import { useApiUrl, useCustom } from '@refinedev/core';
import {
  RequestStartTransactionRequest,
  RequestStartTransactionRequestProps,
} from './model';
import { Evse } from '../../../pages/evses/Evse';
import { NEW_IDENTIFIER } from '@util/consts';
import { IdToken } from '../../../pages/id-tokens/id-token';
import { CHARGING_STATION_SEQUENCES_GET_QUERY } from '../../../pages/charging-station-sequences/queries';

export interface RemoteStartProps {
  station: ChargingStation;
}

export const RemoteStart: React.FC<RemoteStartProps> = ({ station }) => {
  const [form] = Form.useForm();
  const formProps = {
    form,
  };

  const apiUrl = useApiUrl();
  const { data: requestIdResponse, isLoading: isLoadingRequestId } =
    useCustom<any>({
      url: `${apiUrl}`,
      method: 'post',
      config: {
        headers: {
          'Content-Type': 'application/json',
        },
      },
      meta: {
        operation: 'ChargingStationSequencesGet',
        gqlQuery: CHARGING_STATION_SEQUENCES_GET_QUERY,
        variables: {
          stationId: station.id,
          type: 'remoteStartId',
        },
      },
    });

  const handleSubmit = async (request: RequestStartTransactionRequest) => {
    (request as any).evseId =
      request[RequestStartTransactionRequestProps.evse]!.id;
    delete (request as any)[RequestStartTransactionRequestProps.evse];

    request[RequestStartTransactionRequestProps.idToken] = {
      idToken:
        request[RequestStartTransactionRequestProps.idToken]![
          IdTokenDtoProps.idToken
        ],
      type: request[RequestStartTransactionRequestProps.idToken]![
        IdTokenDtoProps.type
      ],
    } as any;

    await triggerMessageAndHandleResponse<MessageConfirmation[]>({
      url: `/evdriver/requestStartTransaction?identifier=${station.id}&tenantId=1`,
      data: request,
      ocppVersion: OCPPVersion.OCPP2_0_1,
    });
  };

  if (isLoadingRequestId) return <Spin />;

  const requestStartTransactionRequest = new RequestStartTransactionRequest();
  requestStartTransactionRequest[
    RequestStartTransactionRequestProps.remoteStartId
  ] = requestIdResponse?.data?.ChargingStationSequences[0]?.value ?? 0;
  const evse = new Evse();
  evse.id = NEW_IDENTIFIER as any;
  requestStartTransactionRequest[RequestStartTransactionRequestProps.evse] =
    evse;
  requestStartTransactionRequest[RequestStartTransactionRequestProps.idToken] =
    {
      idToken: NEW_IDENTIFIER as any,
    } as IIdTokenDto;

  return (
    <GenericForm
      formProps={formProps}
      dtoClass={RequestStartTransactionRequest}
      onFinish={handleSubmit}
      initialValues={requestStartTransactionRequest}
      parentRecord={requestStartTransactionRequest}
    />
  );
};
