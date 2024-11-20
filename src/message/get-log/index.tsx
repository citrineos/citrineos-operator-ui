import React, { useRef, useState } from 'react';
import { Form, notification, Spin } from 'antd';
import { GenericForm } from '../../components/form';
import { plainToInstance } from 'class-transformer';
import { useApiUrl, useCustom } from '@refinedev/core';
import { GetLogRequest, GetLogRequestProps } from './model';
import { validateSync } from 'class-validator';
import { MessageConfirmation } from '../MessageConfirmation';
import { BaseRestClient } from '@util/BaseRestClient';
import { LogEnumType } from '@citrineos/base';
import { useSelectedChargingStationIds } from '@hooks';
import { CHARGING_STATION_SEQUENCES_GET_QUERY } from '../../pages/charging-station-sequences/queries';

const DIRECTUS_URL = import.meta.env.VITE_DIRECTUS_URL;

export const GetLog: React.FC = () => {
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
        stationIds: stationIds,
        type: 'getLog',
      },
    },
  });

  const isRequestValid = (request: GetLogRequest) => {
    const errors = validateSync(request);
    return errors.length === 0;
  };

  const onValuesChange = (_changedValues: any, allValues: any) => {
    const request = plainToInstance(GetLogRequest, allValues, {
      excludeExtraneousValues: false,
    });
    setValid(isRequestValid(request));
  };

  const onFinish = async (values: object) => {
    const request = plainToInstance(GetLogRequest, values, {
      excludeExtraneousValues: false,
    });
    if (isRequestValid(request)) {
      await getLog(request);
    }
  };

  const getLog = async (request: GetLogRequest) => {
    try {
      setLoading(true);
      const client = new BaseRestClient();
      const response = await client.post(
        `/reporting/getLog?identifier=${stationIds}&tenantId=1`,
        MessageConfirmation,
        {},
        request,
      );

      if (response && response.success) {
        notification.success({
          message: 'Success',
          description: 'The get log request was successful.',
        });
      } else {
        notification.error({
          message: 'Request Failed',
          description:
            'The get log request did not receive a successful response.',
        });
      }
    } catch (error: any) {
      const msg = `Could not perform get log, got error: ${error.message}`;
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

  const getLogRequest = new GetLogRequest();
  getLogRequest[GetLogRequestProps.requestId] =
    requestIdResponse?.data?.ChargingStationSequences[0]?.value ?? 0;
  getLogRequest[GetLogRequestProps.log] = {
    remoteLocation: `${DIRECTUS_URL}/files`,
  } as any; // Type assertion if necessary
  getLogRequest[GetLogRequestProps.logType] = LogEnumType.DiagnosticsLog;

  return (
    <GenericForm
      onFinish={onFinish}
      ref={formRef as any}
      formProps={formProps}
      submitDisabled={!valid}
      dtoClass={GetLogRequest}
      parentRecord={getLogRequest}
      initialValues={getLogRequest}
      onValuesChange={onValuesChange}
    />
  );
};
