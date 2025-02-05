import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ChargingStateEnumType, ReasonEnumType } from '@citrineos/base';
import { BaseDto } from './base';

export class TransactionDto extends BaseDto {
  @IsInt()
  id!: number;

  @IsString()
  @IsNotEmpty()
  transactionId!: string;

  @IsString()
  @IsNotEmpty()
  stationId!: string;

  @IsInt()
  @IsOptional()
  evseDatabaseId?: number;

  @IsBoolean()
  @IsNotEmpty()
  isActive!: boolean;

  // @IsArray()
  // @Type(() => TransactionEvent)
  // @ValidateNested({ each: true })
  // events?: TransactionEvent[];

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
