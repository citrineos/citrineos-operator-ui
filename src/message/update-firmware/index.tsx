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
import { formatPem, readFileContent } from '../util';
import { handleSwitchChange } from '../../util/renderUtil';

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

  const extractSigningCertificate = (values: any) => {
    const {
      'firmware.signingCertificateFile': certificateFile,
      'firmware.signingCertificateString': certificateString,
      'firmware.signingCertificateSwitch': certificateSwitch,
    } = values;

    let signingCertificate: any;

    if (
      (certificateSwitch === undefined || certificateSwitch) &&
      certificateString
    ) {
      signingCertificate = certificateString;
    } else if (!certificateSwitch && certificateFile) {
      signingCertificate = certificateFile;
    }

    [
      'firmware.signingCertificateFile',
      'firmware.signingCertificateString',
      'firmware.signingCertificateSwitch',
    ].forEach((key) => delete values[key]);

    return signingCertificate;
  };

  const onValuesChange = (_changedValues: any, allValues: any) => {
    const signingCertificate = extractSigningCertificate(allValues);

    const request = plainToInstance(UpdateFirmwareRequest, allValues, {
      excludeExtraneousValues: false,
    });

    request.firmware.signingCertificate = signingCertificate;
    setValid(isRequestValid(request));
  };

  const onFinish = async (values: any) => {
    const signingCertificate = extractSigningCertificate(values);

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
      let signingCertificate: any;
      const signingCertificateFile = request.firmware.signingCertificate;

      if (typeof request.firmware.signingCertificate === 'string') {
        const pemString = formatPem(request.firmware.signingCertificate);
        if (pemString == null) {
          throw new Error('Incorrectly formatted PEM');
        }
        request.firmware.signingCertificate = pemString;
      } else if (signingCertificateFile instanceof File) {
        try {
          signingCertificate = await readFileContent(signingCertificateFile);
          request.firmware.signingCertificate = signingCertificate;
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
      handleSwitchChange(true);
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
