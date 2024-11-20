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
import { Evse } from '../../pages/evses/Evse';
import { NEW_IDENTIFIER } from '@util/consts';
import { IdToken, IdTokenProps } from '../../pages/id-tokens/id-token';
import { useApiUrl, useCustom } from '@refinedev/core';
import { CHARGING_STATION_SEQUENCES_GET_QUERY } from '../../pages/charging-station-sequences/queries';
import { EvseProps } from '../../pages/evses/EvseProps';
import { useSelectedChargingStationIds } from '@hooks';

export const RemoteStart: React.FC = () => {
  const formRef = useRef();
  const apiUrl = useApiUrl();
  const [form] = Form.useForm();
  const formProps = { form };
  const [valid, setValid] = useState<boolean>(false);
  const stationIds = useSelectedChargingStationIds();
  const [loading, setLoading] = useState<boolean>(false);

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
        stationId: stationIds,
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
        `/evdriver/requestStartTransaction?identifier=${stationIds}&tenantId=1`,
        MessageConfirmation,
        {},
        request,
      );

      if (response && response.success) {
        notification.success({
          message: 'Success',
          description: 'The start transaction request was successful.',
        });
      } else {
        notification.error({
          message: 'Request Failed',
          description:
            'The start transaction request did not receive a successful response.',
        });
      }
    } catch (error: any) {
      const msg = `Could not perform request start transaction, got error: ${error.message}`;
      console.error(msg, error);
      notification.error({
        message: 'Error',
        description: msg,
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading || isLoadingRequestId) return <Spin />;

  const evse = new Evse();
  const idToken = new IdToken();
  const requestStartTransactionRequest = new RequestStartTransactionRequest();

  idToken[IdTokenProps.id] = NEW_IDENTIFIER as any;
  evse[EvseProps.databaseId] = NEW_IDENTIFIER as any;
  requestStartTransactionRequest[
    RequestStartTransactionRequestProps.remoteStartId
  ] = requestIdResponse?.data?.ChargingStationSequences[0]?.value ?? 0;

  requestStartTransactionRequest[RequestStartTransactionRequestProps.evse] =
    evse;
  requestStartTransactionRequest[RequestStartTransactionRequestProps.idToken] =
    idToken;

  return (
    <GenericForm
      onFinish={onFinish}
      ref={formRef as any}
      formProps={formProps}
      submitDisabled={!valid}
      onValuesChange={onValuesChange}
      dtoClass={RequestStartTransactionRequest}
      parentRecord={requestStartTransactionRequest}
      initialValues={requestStartTransactionRequest}
    />
  );
};
