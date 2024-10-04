import {
  ChargingStateEnumType,
  ReasonEnumType,
  TransactionEventEnumType,
  TriggerReasonEnumType,
} from '@citrineos/base';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { TransformDate } from '../../util/TransformDate';
import { BaseModel } from '../../util/BaseModel';

export class TransactionType {
  @IsString()
  transactionId!: string;

  @IsEnum(ChargingStateEnumType)
  @IsOptional()
  chargingState?: ChargingStateEnumType | null;

  @IsNumber()
  @IsOptional()
  timeSpentCharging?: number | null;

  @IsEnum(ReasonEnumType)
  @IsOptional()
  stoppedReason?: ReasonEnumType | null;

  @IsInt()
  @IsOptional()
  remoteStartId?: number | null;

  // customData?: CustomDataType | null; // todo handle custom data
}

export class TransactionEvent extends BaseModel {
  @IsInt()
  id!: number;

  @IsString()
  stationId!: string;

  @IsString()
  eventType!: TransactionEventEnumType;

  @TransformDate()
  timestamp!: Date;

  @IsEnum(TriggerReasonEnumType)
  triggerReason!: TriggerReasonEnumType;

  @IsInt()
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

  @IsString()
  @IsOptional()
  transactionDatabaseId?: string;

  @IsObject()
  transactionInfo!: TransactionType;

  @IsOptional()
  @IsInt()
  evseId?: number | null;

  @IsOptional()
  @IsInt()
  idTokenId?: number | null;

  // todo: handle custom data
  // customData?: CustomDataType | null;
}
