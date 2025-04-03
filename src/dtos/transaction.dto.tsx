import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ChargingStateEnumType, ReasonEnumType } from '@OCPP2_0_1';
import { BaseDto } from './base.dto';
import { Expose, Type } from 'class-transformer';
import { ChargingStationDto } from './charging.station.dto';
import { TransactionEventDto } from './transaction.event.dto';

export enum TransactionDtoProps {
  id = 'id',
  transactionId = 'transactionId',
  stationId = 'stationId',
  evseDatabaseId = 'evseDatabaseId',
  isActive = 'isActive',
  events = 'events',
  chargingState = 'chargingState',
  timeSpentCharging = 'timeSpentCharging',
  totalKwh = 'totalKwh',
  stoppedReason = 'stoppedReason',
  remoteStartId = 'remoteStartId',
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

  @IsInt()
  @IsOptional()
  evseDatabaseId?: number;

  @IsBoolean()
  @IsNotEmpty()
  isActive!: boolean;

  @IsArray()
  @Type(() => TransactionEventDto)
  @ValidateNested({ each: true })
  @Expose({ name: 'TransactionEvents' })
  events?: TransactionEventDto[];

  @IsEnum(ChargingStateEnumType)
  @IsOptional()
  chargingState?: ChargingStateEnumType | null;

  @IsInt()
  @IsOptional()
  timeSpentCharging?: number | null;

  @IsInt()
  @IsOptional()
  totalKwh?: number | null;

  @IsEnum(ReasonEnumType)
  @IsOptional()
  stoppedReason?: ReasonEnumType | null;

  @IsInt()
  @IsOptional()
  remoteStartId?: number | null;

  // todo: handle custom data
  // customData?: CustomDataType | null;
}
