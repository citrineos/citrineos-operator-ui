// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { ChargingStateEnumType, ReasonEnumType } from '@OCPP2_0_1';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ClassResourceType } from '@util/decorators/ClassResourceType';
import { ResourceType } from '@util/auth';
import { ClassGqlListQuery } from '@util/decorators/ClassGqlListQuery';
import { ClassGqlGetQuery } from '@util/decorators/ClassGqlGetQuery';
import { ClassGqlCreateMutation } from '@util/decorators/ClassGqlCreateMutation';
import { ClassGqlEditMutation } from '@util/decorators/ClassGqlEditMutation';
import { ClassGqlDeleteMutation } from '@util/decorators/ClassGqlDeleteMutation';
import { PrimaryKeyFieldName } from '@util/decorators/PrimaryKeyFieldName';
import {
  TRANSACTION_CREATE_MUTATION,
  TRANSACTION_DELETE_MUTATION,
  TRANSACTION_EDIT_MUTATION,
  TRANSACTION_GET_QUERY,
  TRANSACTION_LIST_QUERY,
} from './queries';
import { Type } from 'class-transformer';
import { FieldLabel } from '@util/decorators/FieldLabel';
import { GqlAssociation } from '@util/decorators/GqlAssociation';
import { TransactionEvent } from '../transaction-events/TransactionEvent';
import {
  GET_TRANSACTION_EVENTS_FOR_TRANSACTION_LIST_QUERY,
  TRANSACTION_EVENT_GET_QUERY,
  TRANSACTION_EVENT_LIST_QUERY,
} from '../transaction-events/queries';
import { TransformDate } from '@util/TransformDate';
import { ClassCustomActions } from '@util/decorators/ClassCustomActions';
import { CustomFormRender } from '@util/decorators/CustomFormRender';
import { ValueDisplay } from '../../components/value-display';
import React from 'react';
import { Searchable } from '@util/decorators/Searcheable';
import { Sortable } from '@util/decorators/Sortable';
import { HiddenWhen } from '@util/decorators/HiddenWhen';
import {
  ITransactionDto,
  ITransactionEventDto,
  TransactionDtoProps,
  TransactionEventDtoProps,
} from '@citrineos/base';

@ClassResourceType(ResourceType.TRANSACTIONS)
@ClassGqlListQuery(TRANSACTION_LIST_QUERY)
@ClassGqlGetQuery(TRANSACTION_GET_QUERY)
@ClassGqlCreateMutation(TRANSACTION_CREATE_MUTATION)
@ClassGqlEditMutation(TRANSACTION_EDIT_MUTATION)
@ClassGqlDeleteMutation(TRANSACTION_DELETE_MUTATION)
@PrimaryKeyFieldName(TransactionDtoProps.id)
@ClassCustomActions([
  {
    label: 'Remote Stop',
    isVisible: (transaction) => transaction[TransactionDtoProps.isActive],
    execOrRender: (transaction: Transaction, setLoading) => {
      // requestStopTransaction(
      //   transaction[TransactionProps.stationId],
      //   transaction[TransactionProps.transactionId],
      //   setLoading,
      // ).then(() => {
      //   console.log('Successfully stopped transaction', transaction);
      // });
    },
  },
])
export class Transaction implements Partial<ITransactionDto> {
  @HiddenWhen(() => true)
  id!: number;

  @Searchable()
  @Sortable()
  @IsString()
  @IsNotEmpty()
  transactionId!: string;

  @Searchable()
  @IsString()
  @IsNotEmpty()
  stationId!: string;

  @IsArray()
  @Type(() => TransactionEvent)
  @ValidateNested({ each: true })
  @FieldLabel('Events')
  @GqlAssociation({
    parentIdFieldName: TransactionDtoProps.id,
    associatedIdFieldName: TransactionEventDtoProps.transactionDatabaseId,
    gqlQuery: {
      query: TRANSACTION_EVENT_GET_QUERY,
    },
    gqlListQuery: {
      query: TRANSACTION_EVENT_LIST_QUERY,
    },
    gqlListSelectedQuery: {
      query: GET_TRANSACTION_EVENTS_FOR_TRANSACTION_LIST_QUERY,
      getQueryVariables: (transaction: Transaction) => ({
        transactionDatabaseId: transaction.id,
      }),
    },
  })
  @HiddenWhen((record) => {
    return record;
  })
  events?: ITransactionEventDto[];

  @Searchable()
  @IsEnum(ChargingStateEnumType)
  @IsOptional()
  chargingState?: ChargingStateEnumType | null;

  @IsInt()
  @IsOptional()
  @CustomFormRender((record: Transaction) => (
    <ValueDisplay value={record.totalKwh} suffix="kWh" />
  ))
  totalKwh?: number | null;

  @Searchable()
  @IsEnum(ReasonEnumType)
  @IsOptional()
  stoppedReason?: ReasonEnumType | null;

  @TransformDate()
  @IsOptional()
  updatedAt?: Date;

  @TransformDate()
  @IsOptional()
  createdAt?: Date;
}
