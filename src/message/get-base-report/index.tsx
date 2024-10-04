import {
  GenericDeviceModelStatusEnumType,
  ReportBaseEnumType,
} from '@citrineos/base';
import React, { useState } from 'react';
import { Button, Form, InputNumber } from 'antd';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { getSchemaForInstanceAndKey, renderField } from '../../components/form';
import { FieldPath } from '../../components/form/state/fieldpath';
import { plainToInstance, Type } from 'class-transformer';
import { generateRandomLong, triggerMessageAndHandleResponse } from '../util';
import { ChargingStation } from '../../pages/charging-stations/ChargingStation';
import { StatusInfoType } from '../model/StatusInfoType';

export enum GetBaseReportRequestProps {
  requestId = 'requestId',
  reportBase = 'reportBase',
  customData = 'customData',
}

export class GetBaseReportRequest {
  @IsInt()
  @IsNotEmpty()
  requestId!: number;

  @IsEnum(ReportBaseEnumType)
  reportBase!: ReportBaseEnumType;

  // @Type(() => CustomDataType)
  // @IsOptional()
  // customData: CustomDataType | null = null;

  constructor(data: Partial<GetBaseReportRequest>) {
    if (data) {
      Object.assign(this, {
        [GetBaseReportRequestProps.reportBase]:
          data[GetBaseReportRequestProps.reportBase],
        [GetBaseReportRequestProps.requestId]:
          data[GetBaseReportRequestProps.requestId],
      });
    }
  }
}

export class GetBaseReportResponse {
  // @Type(() => CustomDataType)
  // @ValidateNested()
  // @IsOptional()
  // customData?: CustomDataType;

  @IsEnum(GenericDeviceModelStatusEnumType)
  @IsNotEmpty()
  status!: GenericDeviceModelStatusEnumType;

  @Type(() => StatusInfoType)
  @ValidateNested()
  @IsOptional()
  statusInfo?: StatusInfoType;
}

export interface GetBaseReportProps {
  station: ChargingStation;
}

export const GetBaseReport: React.FC<GetBaseReportProps> = ({ station }) => {
  const [form] = Form.useForm();

  const [parentRecord, setParentRecord] = useState(
    new GetBaseReportRequest({
      [GetBaseReportRequestProps.requestId]: generateRandomLong(),
    }),
  );

  const handleSubmit = async () => {
    const plainValues = await form.validateFields();
    const classInstance = plainToInstance(GetBaseReportRequest, plainValues);
    await triggerMessageAndHandleResponse(
      `/configuration/triggerMessage?identifier=${station.id}&tenantId=1`,
      GetBaseReportResponse,
      classInstance,
      (response: GetBaseReportResponse) =>
        response &&
        response.status &&
        response.status === GenericDeviceModelStatusEnumType.Accepted,
    );
  };

  const handleFormChange = (
    _changedValues: any,
    allValues: GetBaseReportRequest,
  ) => {
    setParentRecord(allValues);
  };

  const instance = plainToInstance(GetBaseReportRequest, {});
  const fieldSchema = getSchemaForInstanceAndKey(
    instance,
    GetBaseReportRequestProps.reportBase,
    [GetBaseReportRequestProps.reportBase],
  );

  const enumField = renderField({
    schema: fieldSchema,
    preFieldPath: FieldPath.empty(),
    disabled: false,
  });

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={parentRecord}
      onValuesChange={handleFormChange}
    >
      <Form.Item
        label={GetBaseReportRequestProps.requestId}
        name={GetBaseReportRequestProps.requestId}
      >
        <InputNumber />
      </Form.Item>
      {enumField}
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Get Base Report
        </Button>
      </Form.Item>
    </Form>
  );
};
