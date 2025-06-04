// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { Form, Spin } from 'antd';
import { MessageConfirmation } from '../../MessageConfirmation';
import { ChargingStation } from '../../../pages/charging-stations/ChargingStation';
import { triggerMessageAndHandleResponse } from '../../util';
import { GenericForm } from '../../../components/form';
import { OCPPVersion } from '@citrineos/base';
import { useApiUrl, useCustom } from '@refinedev/core';
import {
  RequestStartTransactionRequest,
  RequestStartTransactionRequestProps,
} from './model';
import { Evse } from '../../../pages/evses/Evse';
import { NEW_IDENTIFIER } from '@util/consts';
import { IdToken, IdTokenProps } from '../../../pages/id-tokens/id-token';
import { CHARGING_STATION_SEQUENCES_GET_QUERY } from '../../../pages/charging-station-sequences/queries';
import { EvseProps } from '../../../pages/evses/EvseProps';

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
      request[RequestStartTransactionRequestProps.evse]![EvseProps.id];
    delete (request as any)[RequestStartTransactionRequestProps.evse];

    request[RequestStartTransactionRequestProps.idToken] = {
      idToken:
        request[RequestStartTransactionRequestProps.idToken]![
          IdTokenProps.idToken
        ],
      type: request[RequestStartTransactionRequestProps.idToken]![
        IdTokenProps.type
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
  const idToken = new IdToken();
  evse[EvseProps.databaseId] = NEW_IDENTIFIER as any;
  idToken[IdTokenProps.id] = NEW_IDENTIFIER as any;
  requestStartTransactionRequest[RequestStartTransactionRequestProps.evse] =
    evse;
  requestStartTransactionRequest[RequestStartTransactionRequestProps.idToken] =
    idToken;

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
