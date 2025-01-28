import React from 'react';
import { Form } from 'antd';
import { GenericForm } from '../../components/form';
import { plainToInstance } from 'class-transformer';
import { triggerMessageAndHandleResponse } from '../util';
import { ChargingStation } from '../../pages/charging-stations/ChargingStation';
import { MessageConfirmation } from '../MessageConfirmation';

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

  const handleSubmit = async () => {
    const plainValues = await form.validateFields();
    const classInstance = plainToInstance(ClearCacheRequest, plainValues);
    await triggerMessageAndHandleResponse({
      url: `/evdriver/clearCache?identifier=${station.id}&tenantId=1`,
      responseClass: MessageConfirmation,
      data: classInstance,
      responseSuccessCheck: (response: MessageConfirmation) =>
        response?.success,
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
