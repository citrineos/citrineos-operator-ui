// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { IdTokenEnumType } from '@OCPP2_0_1';
import { BaseDto } from './base.dto';

export enum IdTokenDtoProps {
  id = 'id',
  idToken = 'idToken',
  type = 'type',
}

export class IdTokenDto extends BaseDto {
  @IsInt()
  @IsNotEmpty()
  id!: number;

  @IsString()
  @IsNotEmpty()
  idToken!: string;

  @IsEnum(IdTokenEnumType)
  @IsOptional()
  type?: IdTokenEnumType;
}
