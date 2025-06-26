// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ClassResourceType } from '@util/decorators/ClassResourceType';
import { ResourceType } from '@util/auth';
import { LabelField } from '@util/decorators/LabelField';
import { ClassGqlListQuery } from '@util/decorators/ClassGqlListQuery';
import { ClassGqlDeleteMutation } from '@util/decorators/ClassGqlDeleteMutation';
import {
  VARIABLE_CREATE_MUTATION,
  VARIABLE_DELETE_MUTATION,
  VARIABLE_EDIT_MUTATION,
  VARIABLE_GET_QUERY,
  VARIABLE_LIST_QUERY,
} from './queries';
import { PrimaryKeyFieldName } from '@util/decorators/PrimaryKeyFieldName';
import { ClassGqlEditMutation } from '@util/decorators/ClassGqlEditMutation';
import { ClassGqlGetQuery } from '@util/decorators/ClassGqlGetQuery';
import { ClassGqlCreateMutation } from '@util/decorators/ClassGqlCreateMutation';
import { BaseModel } from '@util/BaseModel';
import { Searchable } from '@util/decorators/Searcheable';
import { Sortable } from '@util/decorators/Sortable';

export enum VariableProps {
  id = 'id',
  instance = 'instance',
  name = 'name',
}

@ClassResourceType(ResourceType.VARIABLES)
@LabelField(VariableProps.name)
@ClassGqlListQuery(VARIABLE_LIST_QUERY)
@ClassGqlGetQuery(VARIABLE_GET_QUERY)
@ClassGqlCreateMutation(VARIABLE_CREATE_MUTATION)
@ClassGqlEditMutation(VARIABLE_EDIT_MUTATION)
@ClassGqlDeleteMutation(VARIABLE_DELETE_MUTATION)
@PrimaryKeyFieldName(VariableProps.id)
export class Variable extends BaseModel {
  @IsNumber()
  @Sortable()
  id!: number;

  @IsString()
  @Searchable()
  @Sortable()
  name!: string;

  @IsOptional()
  @IsString()
  instance?: string | null;
}
