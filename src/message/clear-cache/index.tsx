import { ClearCacheStatusEnumType } from '@citrineos/base';
import React, { useCallback, useState } from 'react';
import { Button, Form } from 'antd';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { getSchemaForInstanceAndKey, renderField } from '../../components/form';
import { FieldPath } from '../../components/form/state/fieldpath';
import { plainToInstance, Type } from 'class-transformer';
import { triggerMessageAndHandleResponse } from '../util';
import { CustomDataType } from '../../model/CustomData';
import { ChargingStation } from '../../pages/charging-stations/ChargingStation';
import {
  Unknowns,
  UnknownsActions,
} from '../../components/form/state/unknowns';
import { StatusInfoType } from '../model/StatusInfoType';
import { MessageConfirmation } from '../MessageConfirmation';

export enum ClearCacheRequestProps {
  customData = 'customData',
}

export class ClearCacheRequest {
  @Type(() => CustomDataType)
  @IsOptional()
  customData?: CustomDataType | null;
}

export class ClearCacheResponse {
  // @Type(() => CustomDataType)
  // @ValidateNested()
  // @IsOptional()
  // customData?: CustomDataType;

  @IsEnum(ClearCacheStatusEnumType)
  @IsNotEmpty()
  status!: ClearCacheStatusEnumType;

  @Type(() => StatusInfoType)
  @ValidateNested()
  @IsOptional()
  statusInfo?: StatusInfoType;
}

export interface ClearCacheProps {
  station: ChargingStation;
}

export const ClearCache: React.FC<ClearCacheProps> = ({ station }) => {
  const [form] = Form.useForm();

  const [parentRecord, setParentRecord] = useState(new ClearCacheRequest());

  const handleSubmit = async () => {
    const plainValues = await form.validateFields();
    const classInstance = plainToInstance(ClearCacheRequest, plainValues);
    await triggerMessageAndHandleResponse(
      `/evdriver/clearCache?identifier=${station.id}&tenantId=1`,
      MessageConfirmation,
      {},
      (response: MessageConfirmation) => response && (response as any).success,
    );
  };

  const handleFormChange = (
    _changedValues: any,
    allValues: ClearCacheRequest,
  ) => {
    setParentRecord(allValues);
  };

  const instance = plainToInstance(ClearCacheRequest, {});
  const fieldSchema = getSchemaForInstanceAndKey(
    instance,
    ClearCacheRequestProps.customData,
    [ClearCacheRequestProps.customData],
  );

  const [unknowns, setUnknowns] = useState<Unknowns>(Unknowns.empty());
  const modifyUnknowns = useCallback(
    <K extends UnknownsActions>(method: K, ...args: Parameters<Unknowns[K]>) =>
      setUnknowns((prev: any) => prev[method](...args)),
    [setUnknowns],
  );

  const customField = renderField({
    schema: fieldSchema,
    preFieldPath: FieldPath.empty(),
    disabled: false,
    unknowns,
    modifyUnknowns,
  });

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={parentRecord}
      onValuesChange={handleFormChange}
    >
      {customField}
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Clear Cache
        </Button>
      </Form.Item>
    </Form>
  );
};
