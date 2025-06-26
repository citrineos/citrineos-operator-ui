// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import {
  IsArray,
  IsDate,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { BaseDto } from './base.dto';
import { Expose, Type } from 'class-transformer';
import { TransformDate } from '@util/TransformDate';
import { IdTokenDto } from './id.token.dto';
import { MeterValueDto } from './meter.value.dto';

export enum StopTransactionDtoProps {
  id = 'id',
  stationId = 'stationId',
  transactionDatabaseId = 'transactionDatabaseId',
  meterStop = 'meterStop',
  timestamp = 'timestamp',
  idTokenDatabaseId = 'idTokenDatabaseId',
  reason = 'reason',
  meterValues = 'meterValues',
  idToken = 'idToken',
}

export class StopTransactionDto extends BaseDto {
  @IsInt()
  @IsNotEmpty()
  id!: number;

  @IsString()
  @IsNotEmpty()
  stationId!: string;

  @IsString()
  @IsOptional()
  transactionDatabaseId?: string;

  @IsNumber()
  @IsNotEmpty()
  meterStop!: number;

  @TransformDate()
  @IsNotEmpty()
  timestamp!: Date;

  @IsInt()
  @IsOptional()
  idTokenDatabaseId?: number | null;

  @IsString()
  @IsOptional()
  reason?: string;

  @IsArray()
  @IsOptional()
  @Type(() => MeterValueDto)
  @ValidateNested({ each: true })
  @Expose({ name: 'MeterValues' })
  meterValues?: MeterValueDto[];

  @IsOptional()
  @Type(() => IdTokenDto)
  @Expose({ name: 'IdToken' })
  idToken?: IdTokenDto;
}
