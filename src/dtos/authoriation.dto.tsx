// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import {
  IsArray,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { AllowedConnectorTypes, DisallowedEvseIdPrefixes } from '@enums';
import { IdTokenDto } from './id.token.dto';
import { BaseDto } from './base.dto';
import { IdTokenInfoDto } from './id.token.info.dto';

export enum AuthorizationDtoProps {
  id = 'id',
  allowedConnectorTypes = 'allowedConnectorTypes',
  disallowedEvseIdPrefixes = 'disallowedEvseIdPrefixes',
  idToken = 'IdToken',
  idTokenId = 'idTokenId',
  idTokenInfo = 'IdTokenInfo',
  idTokenInfoId = 'idTokenInfoId',
  concurrentTransaction = 'concurrentTransaction',
}

export class AuthorizationDto extends BaseDto {
  @IsInt()
  @IsNotEmpty()
  id!: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AllowedConnectorTypes as any)
  allowedConnectorTypes!: AllowedConnectorTypes[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DisallowedEvseIdPrefixes as any)
  disallowedEvseIdPrefixes!: DisallowedEvseIdPrefixes[];

  @IsNotEmpty()
  idTokenId!: number;

  @IsOptional()
  @Type(() => IdTokenDto)
  @Expose({ name: 'IdToken' })
  idToken?: Partial<IdTokenDto>;

  @IsNotEmpty()
  idTokenInfoId!: number;

  @IsOptional()
  @Type(() => IdTokenInfoDto)
  @Expose({ name: 'IdTokenInfo' })
  idTokenInfo?: Partial<IdTokenInfoDto>;

  @IsBoolean()
  concurrentTransaction?: boolean;
}
