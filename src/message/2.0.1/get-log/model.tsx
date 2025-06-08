// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsUrl,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { LogEnumType } from '@OCPP2_0_1';
import { TransformDate } from '@util/TransformDate';
import { CustomFormRender } from '@util/decorators/CustomFormRender';
import { Form, Input } from 'antd';
import React from 'react'; // Necessary for JSX in decorators

export enum LogParametersTypeProps {
  remoteLocation = 'remoteLocation',
  oldestTimestamp = 'oldestTimestamp',
  latestTimestamp = 'latestTimestamp',
}

export class LogParametersType {
  // @Type(() => CustomDataType)
  // @IsOptional()
  // customData?: CustomDataType | null;

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
  // @Type(() => CustomDataType)
  // @IsOptional()
  // customData?: CustomDataType | null;

  @Type(() => LogParametersType)
  @ValidateNested()
  @IsNotEmpty()
  log!: LogParametersType;

  @IsEnum(LogEnumType)
  logType!: LogEnumType;

  @IsInt()
  @IsNotEmpty()
  requestId!: number;

  @IsInt()
  @IsOptional()
  retries?: number;

  @IsInt()
  @IsOptional()
  retryInterval?: number;
}
