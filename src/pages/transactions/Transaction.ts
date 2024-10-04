import { ChargingStateEnumType, ReasonEnumType } from '@citrineos/base';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';
import { BaseModel } from '../../util/BaseModel';

export class Transaction extends BaseModel {
  @IsString()
  stationId!: string;

  @IsInt()
  @IsOptional()
  evseDatabaseId?: number;

  @IsString()
  transactionId!: string;

  @IsBoolean()
  isActive!: boolean;

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
