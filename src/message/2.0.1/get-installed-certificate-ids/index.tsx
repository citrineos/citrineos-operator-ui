// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { Form } from 'antd';
import { MessageConfirmation } from '../../MessageConfirmation';
import { ChargingStation } from '../../../pages/charging-stations/ChargingStation';
import { triggerMessageAndHandleResponse } from '../../util';
import { GenericForm } from '../../../components/form';
import { OCPPVersion } from '@citrineos/base';
import { GetInstalledCertificateIdsRequest } from './model';

export interface GetInstalledCertificateIdsProps {
  station: ChargingStation;
}

export const GetInstalledCertificateIds: React.FC<
  GetInstalledCertificateIdsProps
> = ({ station }) => {
  const [form] = Form.useForm();
  const formProps = {
    form,
  };

  const getInstalledCertificateIdsRequest =
    new GetInstalledCertificateIdsRequest();

  const handleSubmit = async (request: GetInstalledCertificateIdsRequest) => {
    await triggerMessageAndHandleResponse<MessageConfirmation[]>({
      url: `/certificates/getInstalledCertificateIds?identifier=${station.id}&tenantId=1`,
      data: request,
      ocppVersion: OCPPVersion.OCPP2_0_1,
    });
  };

  return (
    <GenericForm
      formProps={formProps}
      dtoClass={GetInstalledCertificateIdsRequest}
      onFinish={handleSubmit}
      parentRecord={getInstalledCertificateIdsRequest}
      initialValues={getInstalledCertificateIdsRequest}
    />
  );
};
