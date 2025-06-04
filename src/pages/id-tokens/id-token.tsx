// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { BaseModel } from '@util/BaseModel';
import { IsEnum, IsInt, IsNotEmpty, IsString } from 'class-validator';
import { IdTokenEnumType } from '@OCPP2_0_1';
import { ClassResourceType } from '@util/decorators/ClassResourceType';
import { ResourceType } from '@util/auth';
import { ClassGqlListQuery } from '@util/decorators/ClassGqlListQuery';
import { ClassGqlGetQuery } from '@util/decorators/ClassGqlGetQuery';
import { ClassGqlCreateMutation } from '@util/decorators/ClassGqlCreateMutation';
import { ClassGqlEditMutation } from '@util/decorators/ClassGqlEditMutation';
import { ClassGqlDeleteMutation } from '@util/decorators/ClassGqlDeleteMutation';
import { PrimaryKeyFieldName } from '@util/decorators/PrimaryKeyFieldName';
import {
  ID_TOKENS_CREATE_MUTATION,
  ID_TOKENS_DELETE_MUTATION,
  ID_TOKENS_EDIT_MUTATION,
  ID_TOKENS_LIST_QUERY,
  ID_TOKENS_SHOW_QUERY,
} from './queries';

export enum IdTokenProps {
  id = 'id',
  idToken = 'idToken',
  type = 'type',
}

@ClassResourceType(ResourceType.ID_TOKENS)
@ClassGqlListQuery(ID_TOKENS_LIST_QUERY)
@ClassGqlGetQuery(ID_TOKENS_SHOW_QUERY)
@ClassGqlCreateMutation(ID_TOKENS_CREATE_MUTATION)
@ClassGqlEditMutation(ID_TOKENS_EDIT_MUTATION)
@ClassGqlDeleteMutation(ID_TOKENS_DELETE_MUTATION)
@PrimaryKeyFieldName(IdTokenProps.id)
export class IdToken extends BaseModel {
  @IsInt()
  @IsNotEmpty()
  id!: number;

  @IsString()
  @IsNotEmpty()
  idToken!: string;

  @IsEnum(IdTokenEnumType)
  @IsNotEmpty()
  type!: IdTokenEnumType;
}
