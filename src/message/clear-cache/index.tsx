import React from 'react';
import { Form } from 'antd';
import { GenericForm } from '../../components/form';
import { plainToInstance } from 'class-transformer';
import { useSelectedChargingStationIds } from '@hooks';
import { triggerMessageAndHandleResponse } from '../util';
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

export const ClearCache: React.FC = () => {
  const [form] = Form.useForm();
  const formProps = {
    form,
  };

  const clearCacheRequest = new ClearCacheRequest();
  const stationIds = useSelectedChargingStationIds();

  const handleSubmit = async () => {
    const plainValues = await form.validateFields();
    const classInstance = plainToInstance(ClearCacheRequest, plainValues);
    await triggerMessageAndHandleResponse({
      url: `/evdriver/clearCache?identifier=${stationIds}&tenantId=1`,
      responseClass: MessageConfirmation,
      data: classInstance,
      responseSuccessCheck: (response: MessageConfirmation) =>
        response?.success,
    });
  };

  return (
    <GenericForm
      formProps={formProps}
      onFinish={handleSubmit}
      dtoClass={ClearCacheRequest}
      parentRecord={clearCacheRequest}
      initialValues={clearCacheRequest}
    />
  );
};
