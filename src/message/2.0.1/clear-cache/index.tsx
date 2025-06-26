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

export enum ClearCacheRequestProps {
  customData = 'customData',
}

export class ClearCacheRequest {
  // todo
  // @Type(() => CustomDataType)
  // @IsOptional()
  // customData: CustomDataType | null = null;
}

export interface ClearCacheProps {
  station: ChargingStation;
}

export const ClearCache: React.FC<ClearCacheProps> = ({ station }) => {
  const [form] = Form.useForm();
  const formProps = {
    form,
  };

  const clearCacheRequest = new ClearCacheRequest();

  const handleSubmit = async (request: ClearCacheRequest) => {
    await triggerMessageAndHandleResponse<MessageConfirmation[]>({
      url: `/evdriver/clearCache?identifier=${station.id}&tenantId=1`,
      data: request,
      ocppVersion: OCPPVersion.OCPP2_0_1,
    });
  };

  return (
    <GenericForm
      formProps={formProps}
      dtoClass={ClearCacheRequest}
      onFinish={handleSubmit}
      parentRecord={clearCacheRequest}
      initialValues={clearCacheRequest}
    />
  );
};
