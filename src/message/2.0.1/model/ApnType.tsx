// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { APNAuthenticationEnumType } from '@OCPP2_0_1';

export class ApnType {
  // todo
  // @Type(() => CustomDataType)
  // @ValidateNested()
  // @IsOptional()
  // customData?: CustomDataType;

  @MaxLength(512)
  @IsString()
  @IsNotEmpty()
  apn!: string;

  @MaxLength(20)
  @IsString()
  @IsOptional()
  apnUserName?: string;

  @MaxLength(20)
  @IsString()
  @IsOptional()
  apnPassword?: string;

  @IsInt()
  @IsOptional()
  simPin?: number;

  @MaxLength(6)
  @IsString()
  @IsOptional()
  preferredNetwork?: string;

  @IsBoolean()
  @IsOptional()
  useOnlyPreferredNetwork?: boolean;

  @IsEnum(APNAuthenticationEnumType)
  @IsNotEmpty()
  apnAuthentication!: APNAuthenticationEnumType;
}
