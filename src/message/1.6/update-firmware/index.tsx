// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { Form, Input } from 'antd';
import { MessageConfirmation } from '../../MessageConfirmation';
import { ChargingStation } from '../../../pages/charging-stations/ChargingStation';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsUrl,
  Length,
  Min,
} from 'class-validator';
import { triggerMessageAndHandleResponse } from '../../util';
import { GenericForm } from '../../../components/form';
import { OCPPVersion } from '@citrineos/base';
import { CustomFormRender } from '@util/decorators/CustomFormRender';
import { TransformDate } from '@util/TransformDate';

enum UpdateFirmwareDataProps {
  location = 'location',
  retrieveDate = 'retrieveDate',
  retries = 'retries',
  retryInterval = 'retryInterval',
}

export interface UpdateFirmwareProps {
  station: ChargingStation;
}

class UpdateFirmwareData {
  @IsNotEmpty()
  @IsUrl({ require_tld: false })
  @Length(0, 512)
  @CustomFormRender(() => {
    return (
      <Form.Item
        label={'Location'}
        name={UpdateFirmwareDataProps.location}
        rules={[
          {
            required: true,
            whitespace: true,
            message: 'Please enter a valid URL.',
            type: 'url',
          },
        ]}
      >
        <Input />
      </Form.Item>
    );
  })
  location!: string;

  @TransformDate()
  @IsNotEmpty()
  retrieveDate!: Date;

  @IsInt()
  @Min(0)
  @IsOptional()
  retries?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  retryInterval?: number;
}

export const UpdateFirmware: React.FC<UpdateFirmwareProps> = ({ station }) => {
  const [form] = Form.useForm();
  const formProps = {
    form,
  };

  const updateFirmwareData = new UpdateFirmwareData();

  const handleSubmit = async (request: UpdateFirmwareData) => {
    const data = {
      location: request.location,
      retrieveDate: request.retrieveDate,
      retries: request.retries,
      retryInterval: request.retryInterval,
    };

    await triggerMessageAndHandleResponse<MessageConfirmation[]>({
      url: `/configuration/updateFirmware?identifier=${station.id}&tenantId=1`,
      data,
      ocppVersion: OCPPVersion.OCPP1_6,
    });
  };

  return (
    <GenericForm
      formProps={formProps}
      dtoClass={UpdateFirmwareData}
      onFinish={handleSubmit}
      parentRecord={updateFirmwareData}
      initialValues={updateFirmwareData}
    />
  );
};
