import React, { useRef, useState } from 'react';
import { Form, notification, Spin } from 'antd';
import { BaseRestClient } from '@util/BaseRestClient';
import { MessageConfirmation } from '../MessageConfirmation';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { GenericForm } from '../../components/form';
import { GetInstalledCertificateIdsRequest } from './model';
import { useSelectedChargingStationIds } from '@hooks';

export const GetInstalledCertificateIds: React.FC = () => {
  const formRef = useRef();
  const [formProps] = Form.useForm();
  const [valid, setValid] = useState<boolean>(true);
  const stationIds = useSelectedChargingStationIds();
  const [loading, setLoading] = useState<boolean>(false);

  const isRequestValid = (request: GetInstalledCertificateIdsRequest) => {
    const errors = validateSync(request);
    return errors.length === 0;
  };

  const onValuesChange = (changedValues: object, allValues: object) => {
    const request = plainToInstance(
      GetInstalledCertificateIdsRequest,
      allValues,
      {
        excludeExtraneousValues: false,
      },
    );
    setValid((_) => isRequestValid(request));
  };

  const onFinish = (values: object) => {
    const request = plainToInstance(GetInstalledCertificateIdsRequest, values, {
      excludeExtraneousValues: false,
    });
    if (isRequestValid(request)) {
      getInstalledCertificateIds(request);
    }
  };

  const getInstalledCertificateIds = async (
    request: GetInstalledCertificateIdsRequest,
  ) => {
    try {
      setLoading(true);
      const client = new BaseRestClient();
      const response = await client.post(
        `/certificates/getInstalledCertificateIds?identifier=${stationIds}&tenantId=1`,
        MessageConfirmation,
        {},
        request,
      );

      if (response && response.success) {
        notification.success({
          message: 'Success',
          description:
            'The request to get installed certificate IDs was successful.',
        });
      } else {
        notification.error({
          message: 'Request Failed',
          description:
            'The request to get installed certificate IDs did not receive a successful response.',
        });
      }
    } catch (error: any) {
      const msg = `Could not perform request to get installed certificate IDs, got error: ${error.message}`;
      console.error(msg, error);
      notification.error({
        message: 'Error',
        description: msg,
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Spin />;

  return (
    <GenericForm
      onFinish={onFinish}
      ref={formRef as any}
      formProps={formProps}
      submitDisabled={!valid}
      onValuesChange={onValuesChange}
      dtoClass={GetInstalledCertificateIdsRequest}
    />
  );
};
