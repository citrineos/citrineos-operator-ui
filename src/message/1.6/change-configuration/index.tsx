import React from 'react';
import { Form } from 'antd';
import { MessageConfirmation } from '../../MessageConfirmation';
import { ChargingStation } from '../../../pages/charging-stations/ChargingStation';
import { IsString } from 'class-validator';
import {
  responseSuccessCheck,
  triggerMessageAndHandleResponse,
} from '../../util';
import { GenericForm } from '../../../components/form';
import { OCPPVersion } from '@citrineos/base';

enum ChangeConfigurationDataProps {
  key = 'key',
  value = 'value',
}

export interface ChangeConfigurationProps {
  station: ChargingStation;
}

class ChangeConfigurationData {
  @IsString()
  key!: string;

  @IsString()
  value!: string;
}

export const ChangeConfiguration: React.FC<ChangeConfigurationProps> = ({
  station,
}) => {
  const [form] = Form.useForm();
  const formProps = {
    form,
  };

  const changeConfigurationData = new ChangeConfigurationData();

  const handleSubmit = async (request: ChangeConfigurationData) => {
    const data = { key: request.key, value: request.value };

    await triggerMessageAndHandleResponse<MessageConfirmation[]>({
      url: `/configuration/changeConfiguration?identifier=${station.id}&tenantId=1`,
      data,
      responseSuccessCheck,
      ocppVersion: OCPPVersion.OCPP1_6,
    });
  };

  return (
    <GenericForm
      formProps={formProps}
      dtoClass={ChangeConfigurationData}
      onFinish={handleSubmit}
      parentRecord={changeConfigurationData}
      initialValues={changeConfigurationData}
    />
  );
};
