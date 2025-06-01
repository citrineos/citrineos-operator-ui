// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { IsArray, IsNumber, IsOptional, ValidateNested } from 'class-validator';

import { Type } from 'class-transformer';
import { FieldLabel } from '@util/decorators/FieldLabel';
import { ResourceType } from '@util/auth';
import { ClassResourceType } from '@util/decorators/ClassResourceType';
import { GqlAssociation } from '@util/decorators/GqlAssociation';

import {
  EVSE_CREATE_MUTATION,
  EVSE_DELETE_MUTATION,
  EVSE_EDIT_WITH_VARIABLE_ATTRIBUTES_MUTATION,
  EVSE_GET_QUERY,
  EVSE_LIST_QUERY,
} from './queries';
import { ClassGqlDeleteMutation } from '@util/decorators/ClassGqlDeleteMutation';
import { ClassGqlListQuery } from '@util/decorators/ClassGqlListQuery';
import { PrimaryKeyFieldName } from '@util/decorators/PrimaryKeyFieldName';
import { ClassGqlEditMutation } from '@util/decorators/ClassGqlEditMutation';
import { ClassGqlGetQuery } from '@util/decorators/ClassGqlGetQuery';
import { ClassGqlCreateMutation } from '@util/decorators/ClassGqlCreateMutation';
import { BaseModel } from '@util/BaseModel';
import { EvseProps } from './EvseProps';
import {
  VariableAttribute,
  VariableAttributeProps,
} from '../variable-attributes/VariableAttributes';
import {
  VARIABLE_ATTRIBUTE_GET_QUERY,
  VARIABLE_ATTRIBUTE_LIST_FOR_EVSE_QUERY,
  VARIABLE_ATTRIBUTE_LIST_QUERY,
} from '../variable-attributes/queries';

@ClassResourceType(ResourceType.EVSES)
@ClassGqlListQuery(EVSE_LIST_QUERY)
@ClassGqlGetQuery(EVSE_GET_QUERY)
@ClassGqlCreateMutation(EVSE_CREATE_MUTATION)
@ClassGqlEditMutation(EVSE_EDIT_WITH_VARIABLE_ATTRIBUTES_MUTATION)
@ClassGqlDeleteMutation(EVSE_DELETE_MUTATION)
@PrimaryKeyFieldName(EvseProps.databaseId)
export class Evse extends BaseModel {
  @IsNumber()
  databaseId!: number;

  @IsNumber()
  id!: number;

  @IsOptional()
  @IsNumber()
  connectorId?: number | null;

  /* @Type(() => CustomDataType)
  @IsOptional()
  customData: CustomDataType | null = null;
  */

  @IsArray()
  @Type(() => VariableAttribute)
  @ValidateNested({ each: true })
  @FieldLabel('Device Model')
  @GqlAssociation({
    parentIdFieldName: EvseProps.databaseId,
    associatedIdFieldName: VariableAttributeProps.evseDatabaseId,
    hasNewAssociatedIdsVariable: true,
    gqlQuery: {
      query: VARIABLE_ATTRIBUTE_GET_QUERY,
    },
    gqlListQuery: {
      query: VARIABLE_ATTRIBUTE_LIST_QUERY,
    },
    gqlListSelectedQuery: {
      query: VARIABLE_ATTRIBUTE_LIST_FOR_EVSE_QUERY,
      getQueryVariables: (evse: Evse) => ({
        [VariableAttributeProps.evseDatabaseId]: evse.databaseId,
      }),
    },
  })
  VariableAttributes?: VariableAttribute[];

  constructor(data?: Partial<Evse>) {
    super();
    if (data) {
      Object.assign(this, {
        [EvseProps.databaseId]: data.databaseId,
        [EvseProps.id]: data.id,
        [EvseProps.connectorId]: data.connectorId,
        [EvseProps.VariableAttributes]: data.VariableAttributes,
      });
    }
  }
}
