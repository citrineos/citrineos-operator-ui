import React, { useRef, useState } from 'react';
import { Form, notification, Spin } from 'antd';
import { GenericForm } from '../../components/form';
import { plainToInstance } from 'class-transformer';
import { useApiUrl, useCustom } from '@refinedev/core';
import { ChargingStation } from '../../pages/charging-stations/ChargingStation';
import { UpdateFirmwareRequest, UpdateFirmwareRequestProps } from './model';
import { validateSync } from 'class-validator';
import { MessageConfirmation } from '../MessageConfirmation';
import { BaseRestClient } from '../../util/BaseRestClient';
import { CHARGING_STATION_SEQUENCES_GET_QUERY } from '../../pages/charging-station-sequences/queries';

const DIRECTUS_URL = import.meta.env.VITE_DIRECTUS_URL;

export interface UpdateFirmwareProps {
  station: ChargingStation;
}

export const UpdateFirmware: React.FC<UpdateFirmwareProps> = ({ station }) => {
  const formRef = useRef();
  const [form] = Form.useForm();
  const formProps = { form };

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
        type: 'updateFirmware',
      },
    },
  });

  const isRequestValid = (request: UpdateFirmwareRequest) => {
    const errors = validateSync(request);
    return errors.length === 0;
  };

  const onValuesChange = (_changedValues: any, allValues: any) => {
    const signingCertificate = allValues.firmware.signingCertificate;
    delete allValues.firmware.signingCertificate;

    const request = plainToInstance(UpdateFirmwareRequest, allValues, {
      excludeExtraneousValues: false,
    });

    request.firmware.signingCertificate = signingCertificate;
    setValid(isRequestValid(request));
  };

  const readFileContent = (file: File | null): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!file) {
        return resolve('');
      }

      const fileReader = new FileReader();
      fileReader.onload = (event) => {
        const text = event.target?.result as string;
        resolve(text);
      };
      fileReader.onerror = (error) => reject(error);

      fileReader.readAsText(file);
    });
  };

  const onFinish = async (values: any) => {
    const signingCertificate = values.firmware.signingCertificate;
    delete values.firmware.signingCertificate;

    const request = plainToInstance(UpdateFirmwareRequest, values, {
      excludeExtraneousValues: false,
    });

    request.firmware.signingCertificate = signingCertificate;
    if (isRequestValid(request)) {
      await updateFirmware(request);
    }
  };

  const updateFirmware = async (request: UpdateFirmwareRequest) => {
    try {
      setLoading(true);

      const signingCertificateFile = request.firmware.signingCertificate;
      let signingCertificate = undefined;
      if (signingCertificateFile) {
        try {
          signingCertificate = await readFileContent(signingCertificateFile);
        } catch (error: any) {
          const msg = `Could not read signing certificate file contents, got error: ${error.message}`;
          console.error(msg, error);
        }
      }

      const client = new BaseRestClient();
      const response = await client.post(
        `/configuration/updateFirmware?identifier=${station.id}&tenantId=1`,
        MessageConfirmation,
        {},
        {
          ...request,
          firmware: {
            ...request.firmware,
            signingCertificate,
          },
        },
      );

      if (response && response.success) {
        notification.success({
          message: 'Success',
          description: 'The update firmware request was successful.',
        });
      } else {
        notification.error({
          message: 'Request Failed',
          description:
            'The update firmware request did not receive a successful response.',
        });
      }
    } catch (error: any) {
      const msg = `Could not perform update firmware, got error: ${error.message}`;
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

  const updateFirmwareRequest = new UpdateFirmwareRequest();
  updateFirmwareRequest[UpdateFirmwareRequestProps.requestId] =
    requestIdResponse?.data?.ChargingStationSequences[0]?.value ?? 0;
  updateFirmwareRequest[UpdateFirmwareRequestProps.firmware] = {
    location: `${DIRECTUS_URL}/files`,
  } as any; // Type assertion if necessary

  return (
    <GenericForm
      ref={formRef as any}
      dtoClass={UpdateFirmwareRequest}
      formProps={formProps}
      onFinish={onFinish}
      initialValues={updateFirmwareRequest}
      parentRecord={updateFirmwareRequest}
      onValuesChange={onValuesChange}
      submitDisabled={!valid}
    />
  );
};
