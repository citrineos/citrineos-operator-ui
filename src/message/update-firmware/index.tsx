import React, { useRef, useState, useCallback, useMemo } from 'react';
import { Form, notification, Spin } from 'antd';
import { GenericForm } from '../../components/form';
import { plainToInstance } from 'class-transformer';
import { useApiUrl, useCustom } from '@refinedev/core';
import { UpdateFirmwareRequest, UpdateFirmwareRequestProps } from './model';
import { validateSync } from 'class-validator';
import { MessageConfirmation } from '../MessageConfirmation';
import { BaseRestClient } from '@util/BaseRestClient';
import { CHARGING_STATION_SEQUENCES_GET_QUERY } from '../../pages/charging-station-sequences/queries';
import { formatPem, readFileContent } from '../util';
import { useSelectedChargingStationIds } from '@hooks';

const DIRECTUS_URL = import.meta.env.VITE_DIRECTUS_URL;

export const UpdateFirmware: React.FC = () => {
  const formRef = useRef();
  const apiUrl = useApiUrl();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const stationIds = useSelectedChargingStationIds();
  const [isFormValid, setIsFormValid] = useState(false);

  const { data: requestIdResponse, isLoading: isRequestIdLoading } = useCustom({
    url: `${apiUrl}`,
    method: 'post',
    config: { headers: { 'Content-Type': 'application/json' } },
    meta: {
      operation: 'ChargingStationSequencesGet',
      gqlQuery: CHARGING_STATION_SEQUENCES_GET_QUERY,
      variables: { stationId: stationIds, type: 'updateFirmware' },
    },
  });

  const initialRequest = useMemo(() => {
    const request = new UpdateFirmwareRequest();
    request[UpdateFirmwareRequestProps.requestId] =
      requestIdResponse?.data?.ChargingStationSequences[0]?.value ?? 0;
    request[UpdateFirmwareRequestProps.firmware] = {
      location: `${DIRECTUS_URL}/files`,
    } as any;
    return request;
  }, [requestIdResponse]);

  const [parentRecord, setParentRecord] = useState(initialRequest);

  const validateRequest = useCallback((request: UpdateFirmwareRequest) => {
    return validateSync(request).length === 0;
  }, []);

  const onValuesChange = useCallback(
    (changedValues: any, allValues: any) => {
      if (
        changedValues.firmware !== undefined &&
        changedValues.firmware.signingCertificateIsFile !== undefined
      ) {
        setParentRecord(allValues);
      }

      const signingCertificate =
        allValues.firmware.signingCertificateText ??
        allValues.firmware.signingCertificateFile;
      delete allValues.firmware.signingCertificateText;
      delete allValues.firmware.signingCertificateFile;
      delete allValues.firmware.signingCertificateIsFile;

      const request = plainToInstance(UpdateFirmwareRequest, allValues, {
        excludeExtraneousValues: false,
      });
      request.firmware.signingCertificate = signingCertificate;

      setIsFormValid(validateRequest(request));
    },
    [validateRequest],
  );

  const onFinish = useCallback(
    async (values: any) => {
      const signingCertificate =
        values.firmware.signingCertificateText ??
        values.firmware.signingCertificateFile;
      delete values.firmware.signingCertificateText;
      delete values.firmware.signingCertificateFile;
      delete values.firmware.signingCertificateIsFile;

      const request = plainToInstance(UpdateFirmwareRequest, values, {
        excludeExtraneousValues: false,
      });
      request.firmware.signingCertificate = signingCertificate;

      if (validateRequest(request)) {
        await updateFirmware(request);
      }
    },
    [validateRequest],
  );

  const getSigningCertificate = useCallback(
    async (request: UpdateFirmwareRequest) => {
      if (typeof request.firmware.signingCertificate === 'string') {
        const pemString = formatPem(request.firmware.signingCertificate);
        if (!pemString) throw new Error('Incorrect PEM format');
        return pemString;
      }
      return await readFileContent(request.firmware.signingCertificate ?? null);
    },
    [],
  );

  const updateFirmware = useCallback(
    async (request: UpdateFirmwareRequest) => {
      setLoading(true);
      try {
        const signingCertificate = await getSigningCertificate(request);
        request.firmware.signingCertificate = signingCertificate;

        const client = new BaseRestClient();
        const response = await client.post(
          `/configuration/updateFirmware?identifier=${stationIds}&tenantId=1`,
          MessageConfirmation,
          {},
          request,
        );

        if (response && response.success) {
          notification.success({
            message: 'Success',
            description: 'The update firmware request was successful.',
          });
        } else {
          notification.error({
            message: 'Request Failed',
            description: 'The update firmware request was not successful.',
          });
        }
      } catch (error) {
        notification.error({
          message: 'Error',
          description: `Update firmware failed: ${(error as any).message}`,
        });
      } finally {
        setLoading(false);
      }
    },
    [getSigningCertificate, stationIds],
  );

  if (loading || isRequestIdLoading) return <Spin />;

  return (
    <GenericForm
      ref={formRef as any}
      dtoClass={UpdateFirmwareRequest}
      formProps={{ form }}
      onFinish={onFinish}
      initialValues={parentRecord}
      parentRecord={parentRecord}
      onValuesChange={onValuesChange}
      submitDisabled={!isFormValid}
    />
  );
};
