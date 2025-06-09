// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback, useMemo } from 'react';
import { Form, Spin } from 'antd';
import { MessageConfirmation } from '../../MessageConfirmation';
import { ChargingStation } from '../../../pages/charging-stations/ChargingStation';
import {
  formatPem,
  readFileContent,
  triggerMessageAndHandleResponse,
} from '../../util';
import { GenericForm } from '../../../components/form';
import { OCPPVersion } from '@citrineos/base';
import { useApiUrl, useCustom } from '@refinedev/core';
import { UpdateFirmwareRequest, UpdateFirmwareRequestProps } from './model';
import { CHARGING_STATION_SEQUENCES_GET_QUERY } from '../../../pages/charging-station-sequences/queries';
import config from '@util/config';

const FILE_SERVER_URL = config.fileServer;

export interface UpdateFirmwareProps {
  station: ChargingStation;
}

export const UpdateFirmware: React.FC<UpdateFirmwareProps> = ({ station }) => {
  const [form] = Form.useForm();
  const formProps = {
    form,
  };

  const apiUrl = useApiUrl();
  const { data: requestIdResponse, isLoading: isRequestIdLoading } = useCustom({
    url: `${apiUrl}`,
    method: 'post',
    config: { headers: { 'Content-Type': 'application/json' } },
    meta: {
      operation: 'ChargingStationSequencesGet',
      gqlQuery: CHARGING_STATION_SEQUENCES_GET_QUERY,
      variables: { stationId: station.id, type: 'updateFirmware' },
    },
  });

  const getSigningCertificate = useCallback(async (signingCertificate: any) => {
    if (typeof signingCertificate === 'string') {
      const pemString = formatPem(signingCertificate);
      if (!pemString) throw new Error('Incorrect PEM format');
      return pemString;
    }
    return await readFileContent(signingCertificate ?? null);
  }, []);

  const handleSubmit = async (request: UpdateFirmwareRequest) => {
    // Process signing certificate
    const signingCertificate =
      request.firmware.signingCertificateText ??
      request.firmware.signingCertificateFile;

    delete request.firmware.signingCertificateText;
    delete request.firmware.signingCertificateFile;
    delete request.firmware.signingCertificateIsFile;

    request.firmware.signingCertificate =
      await getSigningCertificate(signingCertificate);

    await triggerMessageAndHandleResponse<MessageConfirmation[]>({
      url: `/configuration/updateFirmware?identifier=${station.id}&tenantId=1`,
      data: request,
      ocppVersion: OCPPVersion.OCPP2_0_1,
    });
  };

  const updateFirmwareRequest = useMemo(() => {
    const request = new UpdateFirmwareRequest();
    request[UpdateFirmwareRequestProps.requestId] =
      requestIdResponse?.data?.ChargingStationSequences[0]?.value ?? 0;
    request[UpdateFirmwareRequestProps.firmware] = {
      location: `${FILE_SERVER_URL}/files`,
    } as any;
    return request;
  }, [requestIdResponse]);

  if (isRequestIdLoading) return <Spin />;

  return (
    <GenericForm
      formProps={formProps}
      dtoClass={UpdateFirmwareRequest}
      onFinish={handleSubmit}
      initialValues={updateFirmwareRequest}
      parentRecord={updateFirmwareRequest}
    />
  );
};
