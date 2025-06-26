// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { BaseDto } from './base.dto';
import { AuthorizationStatusEnumType } from '@OCPP2_0_1';
import { TransformDate } from '@util/TransformDate';

export enum IdTokenInfoDtoProps {
  id = 'id',
  status = 'status',
  cacheExpiryDateTime = 'cacheExpiryDateTime',
  chargingPriority = 'chargingPriority',
  language1 = 'language1',
  language2 = 'language2',
  groupIdTokenId = 'groupIdTokenId',
  personalMessage = 'personalMessage',
}

export class IdTokenInfoDto extends BaseDto {
  @IsInt()
  @IsNotEmpty()
  id!: number;

  @IsString()
  @IsNotEmpty()
  status!: AuthorizationStatusEnumType;

  @TransformDate()
  @IsOptional()
  cacheExpiryDateTime?: Date;

  @IsInt()
  @IsOptional()
  chargingPriority?: number;

  @IsString()
  @IsOptional()
  language1?: string;

  @IsString()
  @IsOptional()
  language2?: string;

  @IsInt()
  @IsOptional()
  groupIdTokenId?: number;

  @IsString()
  @IsOptional()
  personalMessage?: string;
}
