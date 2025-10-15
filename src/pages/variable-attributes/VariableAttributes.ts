// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ClassResourceType } from '@util/decorators/ClassResourceType';
import { ResourceType } from '@util/auth';
import { Component, ComponentProps } from './components/Component';
import { Type } from 'class-transformer';
import { GqlAssociation } from '@util/decorators/GqlAssociation';
import {
  COMPONENT_GET_QUERY,
  COMPONENT_LIST_QUERY,
} from './components/queries';
import { Variable, VariableProps } from './variables/Variable';
import { VARIABLE_GET_QUERY, VARIABLE_LIST_QUERY } from './variables/queries';
import { ClassGqlListQuery } from '@util/decorators/ClassGqlListQuery';
import {
  VARIABLE_ATTRIBUTE_CREATE_MUTATION,
  VARIABLE_ATTRIBUTE_DELETE_MUTATION,
  VARIABLE_ATTRIBUTE_EDIT_MUTATION,
  VARIABLE_ATTRIBUTE_GET_QUERY,
  VARIABLE_ATTRIBUTE_LIST_QUERY,
} from './queries';
import { ClassGqlDeleteMutation } from '@util/decorators/ClassGqlDeleteMutation';
import { PrimaryKeyFieldName } from '@util/decorators/PrimaryKeyFieldName';
import { ClassGqlEditMutation } from '@util/decorators/ClassGqlEditMutation';
import { ClassGqlGetQuery } from '@util/decorators/ClassGqlGetQuery';
import { ClassGqlCreateMutation } from '@util/decorators/ClassGqlCreateMutation';
import { LabelField } from '@util/decorators/LabelField';
import {
  IVariableAttributeDto,
  VariableAttributeDtoProps,
} from '@citrineos/base';

@ClassResourceType(ResourceType.VARIABLE_ATTRIBUTES)
@LabelField(VariableAttributeDtoProps.stationId)
@ClassGqlListQuery(VARIABLE_ATTRIBUTE_LIST_QUERY)
@ClassGqlGetQuery(VARIABLE_ATTRIBUTE_GET_QUERY)
@ClassGqlCreateMutation(VARIABLE_ATTRIBUTE_CREATE_MUTATION)
@ClassGqlEditMutation(VARIABLE_ATTRIBUTE_EDIT_MUTATION)
@ClassGqlDeleteMutation(VARIABLE_ATTRIBUTE_DELETE_MUTATION)
@PrimaryKeyFieldName(VariableAttributeDtoProps.id)
export class VariableAttribute implements Partial<IVariableAttributeDto> {
  @GqlAssociation({
    parentIdFieldName: VariableAttributeDtoProps.variableId,
    associatedIdFieldName: VariableProps.id,
    gqlQuery: {
      query: VARIABLE_GET_QUERY,
    },
    gqlListQuery: {
      query: VARIABLE_LIST_QUERY,
    },
  })
  @IsOptional()
  variableId?: number | null | undefined;

  @GqlAssociation({
    parentIdFieldName: VariableAttributeDtoProps.componentId,
    associatedIdFieldName: ComponentProps.id,
    gqlQuery: {
      query: COMPONENT_GET_QUERY,
    },
    gqlListQuery: {
      query: COMPONENT_LIST_QUERY,
    },
  })
  @Type(() => Component)
  @IsOptional()
  componentId?: number | null;

  @IsOptional()
  @IsNumber()
  evseDatabaseId?: number | null;

  @IsOptional()
  @IsString()
  generatedAt?: string;

  constructor(data: Partial<IVariableAttributeDto>) {
    if (data) {
      Object.assign(this, {
        [VariableAttributeDtoProps.id]: data.id,
        [VariableAttributeDtoProps.stationId]: data.stationId,
        [VariableAttributeDtoProps.type]: data.type,
        [VariableAttributeDtoProps.dataType]: data.dataType,
        [VariableAttributeDtoProps.value]: data.value,
        [VariableAttributeDtoProps.mutability]: data.mutability,
        [VariableAttributeDtoProps.persistent]: data.persistent,
        [VariableAttributeDtoProps.constant]: data.constant,
        [VariableAttributeDtoProps.variableId]: data.variableId,
        [VariableAttributeDtoProps.componentId]: data.componentId,
        [VariableAttributeDtoProps.evseDatabaseId]: data.evseDatabaseId,
        [VariableAttributeDtoProps.generatedAt]: data.generatedAt,
      });
    }
  }
}
