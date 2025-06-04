// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { Form } from 'antd';
import { MessageConfirmation } from '../../MessageConfirmation';
import { ChargingStation } from '../../../pages/charging-stations/ChargingStation';
import { triggerMessageAndHandleResponse } from '../../util';
import { GenericForm } from '../../../components/form';
import { IsNotEmpty } from 'class-validator';

export interface UpdateAuthPasswordProps {
  station: ChargingStation;
}

enum UpdateAuthPasswordRequestProps {
  password = 'password',
  setOnCharger = 'setOnCharger',
  stationId = 'stationId',
}

export class UpdateAuthPasswordRequest {
  @IsNotEmpty()
  password!: string | null;

  @IsNotEmpty()
  setOnCharger!: boolean | null;
}

export const UpdateAuthPassword: React.FC<UpdateAuthPasswordProps> = ({
  station,
}) => {
  const [form] = Form.useForm();
  const formProps = {
    form,
  };

  const updateAuthPasswordRequest = new UpdateAuthPasswordRequest();

  const handleSubmit = async (request: UpdateAuthPasswordRequest) => {
    let data: any;

    if (
      request &&
      request[UpdateAuthPasswordRequestProps.password] &&
      request[UpdateAuthPasswordRequestProps.setOnCharger] !== null
    ) {
      data = {
        password: request[UpdateAuthPasswordRequestProps.password],
        setOnCharger: request[UpdateAuthPasswordRequestProps.setOnCharger],
        stationId: station.id,
      };
    }

    await triggerMessageAndHandleResponse<MessageConfirmation>({
      url: `/configuration/password`,
      data,
      ocppVersion: null,
    });
  };

  return (
    <GenericForm
      formProps={formProps}
      dtoClass={UpdateAuthPasswordRequest}
      onFinish={handleSubmit}
      initialValues={updateAuthPasswordRequest}
      parentRecord={updateAuthPasswordRequest}
    />
  );
};
