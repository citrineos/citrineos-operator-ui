import React, { useEffect, useRef, useState } from 'react';
import { notification, Spin } from 'antd';
import { GET_EVSES_FOR_STATION } from './queries';
import { useCustom } from '@refinedev/core';
import { BaseRestClient } from '../../util/BaseRestClient';
import { MessageConfirmation } from '../MessageConfirmation';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { FieldType, GenericForm } from '../../components/form';
import { RequestStartTransactionRequest } from './model';
import { Evse } from '../../pages/evses/Evse';
import {ChargingStation} from "../../pages/charging-stations/ChargingStation";

export interface RemoteStartProps {
  station: ChargingStation;
}

export const RemoteStart: React.FC<RemoteStartProps> = ({ station }) => {
  const formRef = useRef();

  const [loading, setLoading] = useState<boolean>(false);
  const [valid, setValid] = useState<boolean>(false);
  const [overrides, setOverrides] = useState<any>({});

  const {
    data: evsesResponse,
    isLoading: isLoadingEvses,
    isError: isErrorLoadingEvses,
  } = useCustom<any>({
    url: 'http://localhost:8090/v1/graphql',
    method: 'post',
    config: {
      headers: {
        'Content-Type': 'application/json',
      },
    },
    meta: {
      operation: 'GetEvses',
      gqlQuery: GET_EVSES_FOR_STATION,
      variables: {
        stationId: station.id,
      },
    },
  });

  useEffect(() => {
    setOverrides((prev: any) => {
      const options = (evsesResponse?.data?.Evses || []).map((evse: Evse) => ({
        label: evse.id,
        value: evse.id,
      }));

      return {
        ...prev,
        evseId: {
          label: 'EVSE ID',
          name: 'evseId',
          type: FieldType.select,
          isRequired: false,
          selectMode: undefined,
          selectValues: undefined,
          options: options,
        },
      };
    });
  }, [evsesResponse]);

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
      requestStartTransaction(request);
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

  if (isLoadingEvses || loading) return <Spin />;
  if (isErrorLoadingEvses) return <p>Error loading EVSEs</p>;

  return (
    <GenericForm
      ref={formRef as any}
      dtoClass={RequestStartTransactionRequest}
      onFinish={onFinish}
      onValuesChange={onValuesChange}
      overrides={overrides}
      submitDisabled={!valid}
    />
  );
};
