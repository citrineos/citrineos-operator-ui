// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { Form } from 'antd';
import { MessageConfirmation } from '../../MessageConfirmation';
import { ChargingStation } from '../../../pages/charging-stations/ChargingStation';
import { IsString } from 'class-validator';
import { triggerMessageAndHandleResponse } from '../../util';
import { GenericForm } from '../../../components/form';
import { OCPPVersion } from '@citrineos/base';

export interface ChangeConfigurationProps {
  station: ChargingStation;
  initialValues?: { key: string; value: string };
  keyDisabled?: boolean;
  onFinish?: () => void;
}

class ChangeConfigurationData {
  @IsString()
  key!: string;

  @IsString()
  value!: string;
}

export const ChangeConfiguration: React.FC<ChangeConfigurationProps> = ({
  station,
  initialValues,
  keyDisabled = false,
  onFinish,
}) => {
  const [form] = Form.useForm();
  const formProps = {
    form,
  };

  React.useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    } else {
      form.resetFields();
    }
  }, [initialValues, form]);

  const handleSubmit = async (request: ChangeConfigurationData) => {
    const data = { key: request.key, value: request.value };

    await triggerMessageAndHandleResponse<MessageConfirmation[]>({
      url: `/configuration/changeConfiguration?identifier=${station.id}&tenantId=1`,
      data,
      ocppVersion: OCPPVersion.OCPP1_6,
    });
    if (onFinish) onFinish();
  };

  return (
    <GenericForm
      formProps={formProps}
      dtoClass={ChangeConfigurationData}
      onFinish={handleSubmit}
      parentRecord={initialValues || {}}
      initialValues={initialValues}
      fieldsProps={{
        key: { disabled: keyDisabled },
        value: {},
      }}
    />
  );
};
