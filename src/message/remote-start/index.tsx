import React, { useRef, useState } from 'react';
import { Form, notification, Spin } from 'antd';
import { BaseRestClient } from '@util/BaseRestClient';
import { MessageConfirmation } from '../MessageConfirmation';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { GenericForm } from '../../components/form';
import {
  RequestStartTransactionRequest,
  RequestStartTransactionRequestProps,
} from './model';
import { ChargingStation } from '../../pages/charging-stations/ChargingStation';
import { Evse } from '../../pages/evses/Evse';
import { NEW_IDENTIFIER } from '@util/consts';
import { IdToken, IdTokenProps } from '../../pages/id-tokens/id-token';
import { useApiUrl, useCustom } from '@refinedev/core';
import { CHARGING_STATION_SEQUENCES_GET_QUERY } from '../../pages/charging-station-sequences/queries';
import { EvseProps } from '../../pages/evses/EvseProps';
import { showError, showSuccess } from '../util';

export interface RemoteStartProps {
  station: ChargingStation;
}

export const RemoteStart: React.FC<RemoteStartProps> = ({ station }) => {
  const formRef = useRef();
  const [form] = Form.useForm();
  const formProps = {
    form,
  };

  const [loading, setLoading] = useState<boolean>(false);
  const [valid, setValid] = useState<boolean>(false);

  const apiUrl = useApiUrl();
  const {
    data: requestIdResponse,
    isLoading: isLoadingRequestId,
    // isError: isErrorLoadingRequestId,
  } = useCustom<any>({
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

  const isRequestValid = (request: RequestStartTransactionRequest) => {
    const errors = validateSync(request);
    return errors.length === 0;
  };

  const onValuesChange = (changedValues: any, allValues: any) => {
    const request = plainToInstance(RequestStartTransactionRequest, allValues, {
      excludeExtraneousValues: false,
    });
    setValid((_) => isRequestValid(request));
  };

  const onFinish = (values: object) => {
    const request = plainToInstance(RequestStartTransactionRequest, values, {
      excludeExtraneousValues: false,
    });
    if (isRequestValid(request)) {
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
      requestStartTransaction(request).then();
    }
  };

  const requestStartTransaction = async (
    request: RequestStartTransactionRequest,
  ) => {
    try {
      setLoading(true);
      const client = new BaseRestClient();
      const response = await client.post(
        `/evdriver/requestStartTransaction?identifier=${station.id}&tenantId=1`,
        MessageConfirmation,
        {},
        request,
      );

      if (response && response.success) {
        showSuccess('The start transaction request was successful.');
      } else {
        showError(
          'The start transaction request did not receive a successful response.',
        );
      }
    } catch (error: any) {
      const msg = `Could not perform request start transaction, got error: ${error.message}`;
      console.error(msg, error);
      showError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (loading || isLoadingRequestId) return <Spin />;

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
      ref={formRef as any}
      dtoClass={RequestStartTransactionRequest}
      formProps={formProps}
      onFinish={onFinish}
      initialValues={requestStartTransactionRequest}
      parentRecord={requestStartTransactionRequest}
      onValuesChange={onValuesChange}
      submitDisabled={!valid}
    />
  );
};
