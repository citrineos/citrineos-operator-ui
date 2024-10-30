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
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { TransformDate } from '../../util/TransformDate';
import { BaseModel } from '../../util/BaseModel';
import { ClassResourceType } from '../../util/decorators/ClassResourceType';
import { ResourceType } from '../../resource-type';
import { ClassGqlListQuery } from '../../util/decorators/ClassGqlListQuery';
import { ClassGqlGetQuery } from '../../util/decorators/ClassGqlGetQuery';
import { ClassGqlCreateMutation } from '../../util/decorators/ClassGqlCreateMutation';
import { ClassGqlEditMutation } from '../../util/decorators/ClassGqlEditMutation';
import { ClassGqlDeleteMutation } from '../../util/decorators/ClassGqlDeleteMutation';
import { PrimaryKeyFieldName } from '../../util/decorators/PrimaryKeyFieldName';
import {
  TRANSACTION_EVENT_CREATE_MUTATION,
  TRANSACTION_EVENT_DELETE_MUTATION,
  TRANSACTION_EVENT_EDIT_MUTATION,
  TRANSACTION_EVENT_GET_QUERY,
  TRANSACTION_EVENT_LIST_QUERY,
} from './queries';
import { Hidden } from '../../util/decorators/Hidden';

export class TransactionType {
  @IsString()
  @IsNotEmpty()
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

export enum TransactionEventProps {
  id = 'id',
  stationId = 'stationId',
  eventType = 'eventType',
  timestamp = 'timestamp',
  triggerReason = 'triggerReason',
  seqNo = 'seqNo',
  offline = 'offline',
  numberOfPhasesUsed = 'numberOfPhasesUsed',
  cableMaxCurrent = 'cableMaxCurrent',
  reservationId = 'reservationId',
  transactionDatabaseId = 'transactionDatabaseId',
  transactionInfo = 'transactionInfo',
  evseId = 'evseId',
  idTokenId = 'idTokenId',
}

@ClassResourceType(ResourceType.TRANSACTION_EVENTS)
@ClassGqlListQuery(TRANSACTION_EVENT_LIST_QUERY)
@ClassGqlGetQuery(TRANSACTION_EVENT_GET_QUERY)
@ClassGqlCreateMutation(TRANSACTION_EVENT_CREATE_MUTATION)
@ClassGqlEditMutation(TRANSACTION_EVENT_EDIT_MUTATION)
@ClassGqlDeleteMutation(TRANSACTION_EVENT_DELETE_MUTATION)
@PrimaryKeyFieldName(TransactionEventProps.id)
export class TransactionEvent extends BaseModel {
  @Hidden()
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

  // todo: handle custom data
  // customData?: CustomDataType | null;
}
