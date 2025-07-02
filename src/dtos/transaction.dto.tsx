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
import { ChargingStateEnumType, ReasonEnumType } from '@OCPP2_0_1';
import { BaseDto } from './base.dto';
import { Expose, Type } from 'class-transformer';
import { ChargingStationDto } from './charging.station.dto';
import { TransactionEventDto } from './transaction.event.dto';
import { StartTransactionDto } from './start.transaction.dto';
import { StopTransactionDto } from './stop.transaction.dto';
import { MeterValueDto } from './meter.value.dto';
import { EvseDto } from './evse.dto';

export enum TransactionDtoProps {
  id = 'id',
  transactionId = 'transactionId',
  stationId = 'stationId',
  chargingStation = 'ChargingStation',
  transactionEvents = 'TransactionEvents',
  evseDatabaseId = 'evseDatabaseId',
  isActive = 'isActive',
  meterValues = 'meterValues',
  startTransaction = 'StartTransaction',
  stopTransaction = 'stopTransaction',
  chargingState = 'chargingState',
  timeSpentCharging = 'timeSpentCharging',
  totalKwh = 'totalKwh',
  stoppedReason = 'stoppedReason',
  remoteStartId = 'remoteStartId',
  totalCost = 'totalCost',
  evse = 'evse',
  // customData = 'customData',
}

export class TransactionDto extends BaseDto {
  @IsInt()
  id!: number;

  @IsString()
  @IsNotEmpty()
  transactionId!: string;

  @IsString()
  @IsNotEmpty()
  stationId!: string;

  @IsOptional()
  @IsArray()
  @Type(() => TransactionEventDto)
  @Expose({ name: 'TransactionEvents' })
  transactionEvents?: Partial<TransactionEventDto>[];

  @IsOptional()
  @Type(() => ChargingStationDto)
  @Expose({ name: 'ChargingStation' })
  chargingStation?: Partial<ChargingStationDto>;

  @IsOptional()
  @Type(() => EvseDto)
  @Expose({ name: 'Evse' })
  evse?: EvseDto;

  @IsInt()
  @IsOptional()
  evseDatabaseId?: number;

  @IsBoolean()
  @IsNotEmpty()
  isActive!: boolean;

  @IsArray()
  @IsOptional()
  @Type(() => MeterValueDto)
  @ValidateNested({ each: true })
  @Expose({ name: 'MeterValues' })
  meterValues?: MeterValueDto[];

  @IsOptional()
  @Type(() => StartTransactionDto)
  @Expose({ name: 'StartTransaction' })
  startTransaction?: Partial<StartTransactionDto>;

  @IsOptional()
  @Type(() => StopTransactionDto)
  @Expose({ name: 'StopTransaction' })
  stopTransaction?: Partial<StopTransactionDto>;

  @IsEnum(ChargingStateEnumType)
  @IsOptional()
  chargingState?: ChargingStateEnumType | null;

  @IsInt()
  @IsOptional()
  timeSpentCharging?: number | null;

  @IsNumber()
  @IsOptional()
  totalKwh?: number | null;

  @IsEnum(ReasonEnumType)
  @IsOptional()
  stoppedReason?: ReasonEnumType | null;

  @IsInt()
  @IsOptional()
  remoteStartId?: number | null;

  @IsNumber()
  @IsOptional()
  totalCost?: number;

  // todo: handle custom data
  // customData?: CustomDataType | null;
}
