// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { Form } from 'antd';
import { MessageConfirmation } from '../../MessageConfirmation';
import { ResetRequestType } from '@OCPP1_6';
import { ChargingStation } from '../../../pages/charging-stations/ChargingStation';
import { IsEnum } from 'class-validator';
import { triggerMessageAndHandleResponse } from '../../util';
import { GenericForm } from '../../../components/form';
import { OCPPVersion } from '@citrineos/base';

enum ResetDataProps {
  type = 'type',
}

export interface ResetChargingStationProps {
  station: ChargingStation;
}

class ResetData {
  @IsEnum(ResetRequestType)
  type!: ResetRequestType;
}

export const ResetChargingStation: React.FC<ResetChargingStationProps> = ({
  station,
}) => {
  const [form] = Form.useForm();
  const formProps = {
    form,
  };

  const resetData = new ResetData();

  const handleSubmit = async (request: ResetData) => {
    const data = { type: request.type };

    await triggerMessageAndHandleResponse<MessageConfirmation[]>({
      url: `/configuration/reset?identifier=${station.id}&tenantId=1`,
      data,
      ocppVersion: OCPPVersion.OCPP1_6,
    });
  };

  return (
    <GenericForm
      formProps={formProps}
      dtoClass={ResetData}
      onFinish={handleSubmit}
      parentRecord={resetData}
      initialValues={resetData}
    />
  );
};
