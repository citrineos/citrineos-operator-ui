// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { RegistrationStatusEnumType, SetVariableResultType } from '@OCPP2_0_1';
import { Boots } from '../../graphql/schema.types';
import { TransformDate } from '@util/TransformDate';
import { BaseModel } from '@util/BaseModel';

export class Boot extends BaseModel {
  @IsString()
  id!: string;

  @IsOptional()
  @TransformDate()
  lastBootTime?: Date;

  @IsInt()
  @IsOptional()
  heartbeatInterval?: number;

  @IsInt()
  @IsOptional()
  bootRetryInterval?: number;

  @IsEnum(RegistrationStatusEnumType)
  status!: RegistrationStatusEnumType;

  // @Type(() => StatusInfoType)
  // statusInfo?: StatusInfoType; // todo

  @IsBoolean()
  @IsOptional()
  getBaseReportOnPending?: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  // @Type(() => SetVariableResultType)
  variablesRejectedOnLastBoot!: SetVariableResultType[];

  @IsBoolean()
  @IsOptional()
  bootWithRejectedVariables?: boolean;

  constructor(data: Boots) {
    super();
    if (data) {
      this.id = data.id;
      this.lastBootTime = data.lastBootTime;
      this.heartbeatInterval = data.heartbeatInterval as number;
      this.bootRetryInterval = data.bootRetryInterval as number;
      this.status = data.status as RegistrationStatusEnumType;
      this.getBaseReportOnPending = data.getBaseReportOnPending as boolean;
      this.variablesRejectedOnLastBoot = data.variablesRejectedOnLastBoot;
      this.bootWithRejectedVariables =
        data.bootWithRejectedVariables as boolean;
    }
  }
}
