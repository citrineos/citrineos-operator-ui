// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { IsArray, IsInt, IsNotEmpty, ValidateNested } from 'class-validator';
import { TransformDate } from '@util/TransformDate';
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
import { Type } from 'class-transformer';
import { GqlAssociation } from '@util/decorators/GqlAssociation';
import {
  GET_METER_VALUES_FOR_TRANSACTION_EVENT,
  METER_VALUE_GET_QUERY,
  METER_VALUE_LIST_QUERY,
} from '../meter-values/queries';
import { HiddenWhen } from '@util/decorators/HiddenWhen';
import {
  IMeterValueDto,
  ITransactionEventDto,
  MeterValueDtoProps,
  TransactionEventDtoProps,
} from '@citrineos/base';

@ClassResourceType(ResourceType.TRANSACTION_EVENTS)
@ClassGqlListQuery(TRANSACTION_EVENT_LIST_QUERY)
@ClassGqlGetQuery(TRANSACTION_EVENT_GET_QUERY)
@ClassGqlCreateMutation(TRANSACTION_EVENT_CREATE_MUTATION)
@ClassGqlEditMutation(TRANSACTION_EVENT_EDIT_MUTATION)
@ClassGqlDeleteMutation(TRANSACTION_EVENT_DELETE_MUTATION)
@PrimaryKeyFieldName(TransactionEventDtoProps.id)
export class TransactionEvent implements Partial<ITransactionEventDto> {
  @HiddenWhen(() => true)
  @IsInt()
  @IsNotEmpty()
  id!: number;

  @IsArray()
  @ValidateNested({ each: true })
  @HiddenWhen((record) => {
    return record;
  })
  @GqlAssociation({
    parentIdFieldName: TransactionEventDtoProps.id,
    associatedIdFieldName: MeterValueDtoProps.transactionEventId,
    gqlQuery: {
      query: METER_VALUE_GET_QUERY,
    },
    gqlListQuery: {
      query: METER_VALUE_LIST_QUERY,
    },
    gqlListSelectedQuery: {
      query: GET_METER_VALUES_FOR_TRANSACTION_EVENT,
      getQueryVariables: (transactionEvent: TransactionEvent) => ({
        transactionEventId: transactionEvent[TransactionEventDtoProps.id],
      }),
    },
  })
  meterValues?: IMeterValueDto[];

  @TransformDate()
  @IsNotEmpty()
  timestamp!: string;
}
