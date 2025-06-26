// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { Form } from 'antd';
import { MessageConfirmation } from '../../MessageConfirmation';
import { ChargingStation } from '../../../pages/charging-stations/ChargingStation';
import { IsArray } from 'class-validator';
import { triggerMessageAndHandleResponse } from '../../util';
import { GenericForm } from '../../../components/form';
import { OCPPVersion } from '@citrineos/base';

enum GetConfigurationDataProps {
  key = 'key',
}

export interface GetConfigurationProps {
  station: ChargingStation;
}

class GetConfigurationData {
  @IsArray()
  key?: string[] | null;
}

export const GetConfiguration: React.FC<GetConfigurationProps> = ({
  station,
}) => {
  const [form] = Form.useForm();
  const formProps = {
    form,
  };

  const getConfigurationData = new GetConfigurationData();

  const handleSubmit = async (request: GetConfigurationData) => {
    const data = { key: request.key };

    await triggerMessageAndHandleResponse<MessageConfirmation[]>({
      url: `/configuration/getConfiguration?identifier=${station.id}&tenantId=1`,
      data,
      ocppVersion: OCPPVersion.OCPP1_6,
    });
  };

  return (
    <GenericForm
      formProps={formProps}
      dtoClass={GetConfigurationData}
      onFinish={handleSubmit}
      parentRecord={getConfigurationData}
      initialValues={getConfigurationData}
    />
  );
};
