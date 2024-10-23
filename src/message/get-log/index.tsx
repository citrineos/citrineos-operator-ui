import { LogEnumType, LogStatusEnumType } from '@citrineos/base';
import React, { useCallback, useRef } from 'react';
import { Form, Input } from 'antd';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsUrl,
  ValidateNested,
} from 'class-validator';
import { GenericForm } from '../../components/form';
import { plainToInstance, Type } from 'class-transformer';
import {
  generateRandomSignedInt,
  triggerMessageAndHandleResponse,
} from '../util';
import { ChargingStation } from '../../pages/charging-stations/ChargingStation';
import { CustomFormRender } from '../../util/decorators/CustomFormRender';
import { TransformDate } from '../../util/TransformDate';
import { StatusInfoType } from '../model/StatusInfoType';

const DIRECTUS_URL = import.meta.env.VITE_DIRECTUS_URL;

export enum LogParametersTypeProps {
  remoteLocation = 'remoteLocation',
  oldestTimestamp = 'oldestTimestamp',
  latestTimestamp = 'latestTimestamp',
}

export class LogParametersType {
  // todo
  // @Type(() => CustomDataType)
  // @IsOptional()
  // customData: CustomDataType | null = null;

  @IsNotEmpty()
  @IsUrl({ require_tld: false })
  @CustomFormRender(() => {
    return (
      <Form.Item
        label={LogParametersTypeProps.remoteLocation}
        name={[GetLogRequestProps.log, LogParametersTypeProps.remoteLocation]}
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
  remoteLocation!: string;

  @TransformDate()
  @IsOptional()
  oldestTimestamp?: Date;

  @TransformDate()
  @IsOptional()
  latestTimestamp?: Date;
}

export enum GetLogRequestProps {
  log = 'log',
  logType = 'logType',
  requestId = 'requestId',
  retries = 'retries',
  retryInterval = 'retryInterval',
}

export class GetLogRequest {
  // todo
  // @Type(() => CustomDataType)
  // @IsOptional()
  // customData: CustomDataType | null = null;

  @Type(() => LogParametersType)
  @ValidateNested()
  @IsNotEmpty()
  log!: LogParametersType;

  @IsEnum(LogEnumType)
  logType!: LogEnumType;

  @IsInt()
  requestId!: number;

  @IsInt()
  @IsOptional()
  retries?: number;

  @IsInt()
  @IsOptional()
  retryInterval?: number;
}

export class GetLogResponse {
  // todo
  // @Type(() => CustomDataType)
  // @ValidateNested()
  // @IsOptional()
  // customData?: CustomDataType;

  @IsEnum(LogStatusEnumType)
  status!: LogStatusEnumType;

  @Type(() => StatusInfoType)
  @ValidateNested()
  @IsOptional()
  statusInfo?: StatusInfoType;
}

export interface GetLogProps {
  station: ChargingStation;
}

export const GetLog: React.FC<GetLogProps> = ({ station }) => {
  const [formProps] = Form.useForm();
  const formRef = useRef();

  const getLogRequest = new GetLogRequest();
  getLogRequest[GetLogRequestProps.requestId] = generateRandomSignedInt();
  getLogRequest[GetLogRequestProps.log] = new LogParametersType();
  getLogRequest[GetLogRequestProps.log][LogParametersTypeProps.remoteLocation] =
    `${DIRECTUS_URL}/files`;

  const handleSubmit = useCallback(
    async (plainValues: any) => {
      const classInstance = plainToInstance(GetLogRequest, plainValues);
      await triggerMessageAndHandleResponse(
        `/reporting/getLog?identifier=${station.id}&tenantId=1`,
        GetLogResponse,
        classInstance,
        (response: GetLogResponse) => response && (response as any).success,
      );
    },
    [formRef],
  );

  return (
    <GenericForm
      ref={formRef as any}
      formProps={formProps}
      dtoClass={GetLogRequest}
      onFinish={handleSubmit}
      initialValues={getLogRequest}
    />
  );
};
