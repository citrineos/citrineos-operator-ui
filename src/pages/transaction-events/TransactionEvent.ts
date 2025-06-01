// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { TransactionEventEnumType, TriggerReasonEnumType } from '@OCPP2_0_1';
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
import { TransformDate } from '@util/TransformDate';
import { BaseModel } from '@util/BaseModel';
import { ClassResourceType } from '@util/decorators/ClassResourceType';
import { ResourceType } from '@util/auth';
import { ClassGqlListQuery } from '@util/decorators/ClassGqlListQuery';
import { ClassGqlGetQuery } from '@util/decorators/ClassGqlGetQuery';
import { ClassGqlCreateMutation } from '@util/decorators/ClassGqlCreateMutation';
import { ClassGqlEditMutation } from '@util/decorators/ClassGqlEditMutation';
import { ClassGqlDeleteMutation } from '@util/decorators/ClassGqlDeleteMutation';
import { PrimaryKeyFieldName } from '@util/decorators/PrimaryKeyFieldName';
import {
  TRANSACTION_EVENT_CREATE_MUTATION,
  TRANSACTION_EVENT_DELETE_MUTATION,
  TRANSACTION_EVENT_EDIT_MUTATION,
  TRANSACTION_EVENT_GET_QUERY,
  TRANSACTION_EVENT_LIST_QUERY,
} from './queries';
import { MeterValue, MeterValueProps } from '../meter-values/MeterValue';
import { Type } from 'class-transformer';
import { GqlAssociation } from '@util/decorators/GqlAssociation';
import {
  GET_METER_VALUES_FOR_TRANSACTION_EVENT,
  METER_VALUE_GET_QUERY,
  METER_VALUE_LIST_QUERY,
} from '../meter-values/queries';
import { HiddenWhen } from '@util/decorators/HiddenWhen';

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
  meterValues = 'meterValues',
}

@ClassResourceType(ResourceType.TRANSACTION_EVENTS)
@ClassGqlListQuery(TRANSACTION_EVENT_LIST_QUERY)
@ClassGqlGetQuery(TRANSACTION_EVENT_GET_QUERY)
@ClassGqlCreateMutation(TRANSACTION_EVENT_CREATE_MUTATION)
@ClassGqlEditMutation(TRANSACTION_EVENT_EDIT_MUTATION)
@ClassGqlDeleteMutation(TRANSACTION_EVENT_DELETE_MUTATION)
@PrimaryKeyFieldName(TransactionEventProps.id)
export class TransactionEvent extends BaseModel {
  @HiddenWhen(() => true)
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
  @Type(() => MeterValue)
  @ValidateNested({ each: true })
  @HiddenWhen((record) => {
    return record;
  })
  @GqlAssociation({
    parentIdFieldName: TransactionEventProps.id,
    associatedIdFieldName: MeterValueProps.transactionEventId,
    gqlQuery: {
      query: METER_VALUE_GET_QUERY,
    },
    gqlListQuery: {
      query: METER_VALUE_LIST_QUERY,
    },
    gqlListSelectedQuery: {
      query: GET_METER_VALUES_FOR_TRANSACTION_EVENT,
      getQueryVariables: (transactionEvent: TransactionEvent) => ({
        transactionEventId: transactionEvent[TransactionEventProps.id],
      }),
    },
  })
  meterValues?: MeterValue[];

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
