// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { IsArray, IsNumber, ValidateNested } from 'class-validator';

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
import { VariableAttribute } from '../variable-attributes/VariableAttributes';
import {
  VARIABLE_ATTRIBUTE_GET_QUERY,
  VARIABLE_ATTRIBUTE_LIST_FOR_EVSE_QUERY,
  VARIABLE_ATTRIBUTE_LIST_QUERY,
} from '../variable-attributes/queries';
import {
  EvseDtoProps,
  IEvseDto,
  VariableAttributeDtoProps,
} from '@citrineos/base';

@ClassResourceType(ResourceType.EVSES)
@ClassGqlListQuery(EVSE_LIST_QUERY)
@ClassGqlGetQuery(EVSE_GET_QUERY)
@ClassGqlCreateMutation(EVSE_CREATE_MUTATION)
@ClassGqlEditMutation(EVSE_EDIT_WITH_VARIABLE_ATTRIBUTES_MUTATION)
@ClassGqlDeleteMutation(EVSE_DELETE_MUTATION)
@PrimaryKeyFieldName(EvseDtoProps.id)
export class Evse implements Partial<IEvseDto> {
  @IsNumber()
  id!: number;

  @IsArray()
  @Type(() => VariableAttribute)
  @ValidateNested({ each: true })
  @FieldLabel('Device Model')
  @GqlAssociation({
    parentIdFieldName: EvseDtoProps.id,
    associatedIdFieldName: 'id',
    hasNewAssociatedIdsVariable: true,
    gqlQuery: {
      query: VARIABLE_ATTRIBUTE_GET_QUERY,
    },
    gqlListQuery: {
      query: VARIABLE_ATTRIBUTE_LIST_QUERY,
    },
    gqlListSelectedQuery: {
      query: VARIABLE_ATTRIBUTE_LIST_FOR_EVSE_QUERY,
      getQueryVariables: (evse: IEvseDto) => ({
        id: evse.id,
      }),
    },
  })
  VariableAttributes?: VariableAttribute[];

  constructor(data?: Partial<IEvseDto>) {
    if (data) {
      Object.assign(this, {
        id: data.id,
        connectors: data.connectors,
        VariableAttributes: (data as any).VariableAttributes,
      });
    }
  }
}
