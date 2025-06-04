// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { IsArray, IsInt, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { TransformDate } from '@util/TransformDate';
import { SampledValue } from './SampledValue';
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
  METER_VALUE_CREATE_MUTATION,
  METER_VALUE_DELETE_MUTATION,
  METER_VALUE_EDIT_MUTATION,
  METER_VALUE_GET_QUERY,
  METER_VALUE_LIST_QUERY,
} from './queries';
import { CustomFormRender } from '@util/decorators/CustomFormRender';
import { SampledValuesListView } from './sampled-value';
import { ExpandableColumn } from '../../components/data-model-table/expandable-column';
import { Sortable } from '@util/decorators/Sortable';

export enum MeterValueProps {
  id = 'id',
  transactionEventId = 'transactionEventId',
  transactionDatabaseId = 'transactionDatabaseId',
  sampledValue = 'sampledValue',
  timestamp = 'timestamp',
}

@ClassResourceType(ResourceType.METER_VALUES)
@ClassGqlListQuery(METER_VALUE_LIST_QUERY)
@ClassGqlGetQuery(METER_VALUE_GET_QUERY)
@ClassGqlCreateMutation(METER_VALUE_CREATE_MUTATION)
@ClassGqlEditMutation(METER_VALUE_EDIT_MUTATION)
@ClassGqlDeleteMutation(METER_VALUE_DELETE_MUTATION)
@PrimaryKeyFieldName(MeterValueProps.id)
export class MeterValue extends BaseModel {
  @IsInt()
  id!: number;

  @Sortable()
  @IsInt()
  @IsOptional()
  transactionEventId?: number | null;

  @Sortable()
  @IsInt()
  @IsOptional()
  transactionDatabaseId?: number | null;

  @IsArray()
  @Type(() => SampledValue)
  @ValidateNested({ each: true })
  @CustomFormRender((meterValue: MeterValue) => (
    <ExpandableColumn
      expandedContent={
        <SampledValuesListView sampledValues={meterValue.sampledValue} />
      }
    />
  ))
  sampledValue!: SampledValue[];

  @Sortable()
  @TransformDate()
  timestamp!: Date;

  // todo: handle custom data
  // customData?: CustomDataType | null;
}
