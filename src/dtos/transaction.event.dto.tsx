// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { TransactionEventEnumType, TriggerReasonEnumType } from '@OCPP2_0_1';
import { Expose, Type } from 'class-transformer';
import { TransformDate } from '@util/TransformDate';
import { BaseDto } from './base.dto';
import { MeterValueDto } from './meter.value.dto';
import { IdTokenDto } from './id.token.dto';

export enum TransactionEventDtoProps {
  id = 'id',
  stationId = 'stationId',
  evseId = 'evseId',
  transactionDatabaseId = 'transactionDatabaseId',
  eventType = 'eventType',
  meterValues = 'meterValues',
  timestamp = 'timestamp',
  triggerReason = 'triggerReason',
  seqNo = 'seqNo',
  offline = 'offline',
  numberOfPhasesUsed = 'numberOfPhasesUsed',
  cableMaxCurrent = 'cableMaxCurrent',
  reservationId = 'reservationId',
  idToken = 'IdToken',
  idTokenId = 'idTokenId',
}

export class TransactionEventDto extends BaseDto {
  @IsInt()
  @IsNotEmpty()
  id!: number;

  @IsString()
  @IsNotEmpty()
  stationId!: string;

  @IsOptional()
  @IsInt()
  evseId?: number | null;

  @IsString()
  @IsOptional()
  transactionDatabaseId?: string;

  @IsString()
  @IsNotEmpty()
  eventType!: TransactionEventEnumType;

  @IsArray()
  @Type(() => MeterValueDto)
  @ValidateNested({ each: true })
  @Expose({ name: 'MeterValues' })
  meterValues?: MeterValueDto[];

  @TransformDate()
  @IsNotEmpty()
  timestamp!: Date;

  @IsEnum(TriggerReasonEnumType)
  @IsNotEmpty()
  triggerReason!: TriggerReasonEnumType;

  @IsInt()
  @IsNotEmpty()
  seqNo!: number;

  @IsBoolean()
  @IsOptional()
  offline?: boolean | null;

  @IsInt()
  @IsOptional()
  numberOfPhasesUsed?: number | null;

  @IsNumber()
  @IsOptional()
  cableMaxCurrent?: number | null;

  @IsInt()
  @IsOptional()
  reservationId?: number | null;

  // todo
  // @IsObject()
  // @IsNotEmpty()
  // transactionInfo!: TransactionType;

  @IsOptional()
  @IsInt()
  idTokenId?: number | null;

  @IsOptional()
  @Type(() => IdTokenDto)
  @Expose({ name: 'IdToken' })
  idToken?: IdTokenDto;

  // todo: handle custom data
  // customData?: CustomDataType | null;
}
