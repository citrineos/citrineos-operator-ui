import React, { useRef, useState } from 'react';
import { Form, notification, Spin } from 'antd';
import { GenericForm } from '../../components/form';
import { plainToInstance } from 'class-transformer';
import { useApiUrl, useCustom } from '@refinedev/core';
import { CHARGING_STATION_SEQUENCES_GET_QUERY } from '../../pages/charging-station-sequences/queries';
import { GetBaseReportRequest, GetBaseReportRequestProps } from './model';
import { validateSync } from 'class-validator';
import { MessageConfirmation } from '../MessageConfirmation';
import { BaseRestClient } from '@util/BaseRestClient';
import { ReportBaseEnumType } from '@citrineos/base';
import { useSelectedChargingStationIds } from '@hooks';

export const GetBaseReport: React.FC = () => {
  const formRef = useRef();
  const apiUrl = useApiUrl();
  const [form] = Form.useForm();
  const formProps = { form };
  const [valid, setValid] = useState<boolean>(true);
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
        type: 'getBaseReport',
      },
    },
  });

  const isRequestValid = (request: GetBaseReportRequest) => {
    const errors = validateSync(request);
    return errors.length === 0;
  };

  const onValuesChange = (changedValues: any, allValues: any) => {
    const request = plainToInstance(GetBaseReportRequest, allValues, {
      excludeExtraneousValues: false,
    });
    setValid((_) => isRequestValid(request));
  };

  const onFinish = (values: object) => {
    const request = plainToInstance(GetBaseReportRequest, values, {
      excludeExtraneousValues: false,
    });
    if (isRequestValid(request)) {
      getBaseReport(request).then();
    }
  };

  const getBaseReport = async (request: GetBaseReportRequest) => {
    try {
      setLoading(true);
      const client = new BaseRestClient();
      const response = await client.post(
        `/reporting/getBaseReport?identifier=${stationIds}&tenantId=1`,
        MessageConfirmation,
        {},
        request,
      );

      if (response && response.success) {
        notification.success({
          message: 'Success',
          description: 'The get base report request was successful.',
        });
      } else {
        notification.error({
          message: 'Request Failed',
          description:
            'The get base report request did not receive a successful response.',
        });
      }
    } catch (error: any) {
      const msg = `Could not perform get base report, got error: ${error.message}`;
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

  const getBaseReportRequest = new GetBaseReportRequest();
  getBaseReportRequest[GetBaseReportRequestProps.requestId] =
    requestIdResponse?.data?.ChargingStationSequences[0]?.value ?? 0;
  getBaseReportRequest[GetBaseReportRequestProps.reportBase] =
    ReportBaseEnumType.FullInventory;

  return (
    <GenericForm
      ref={formRef as any}
      dtoClass={GetBaseReportRequest}
      formProps={formProps}
      onFinish={onFinish}
      initialValues={getBaseReportRequest}
      parentRecord={getBaseReportRequest}
      onValuesChange={onValuesChange}
      submitDisabled={!valid}
    />
  );
};
