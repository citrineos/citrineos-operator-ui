// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
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
  ID_TOKEN_INFOS_CREATE_MUTATION,
  ID_TOKEN_INFOS_DELETE_MUTATION,
  ID_TOKEN_INFOS_EDIT_MUTATION,
  ID_TOKEN_INFOS_LIST_QUERY,
  ID_TOKEN_INFOS_SHOW_QUERY,
} from './queries';

export enum IdTokenInfosProps {
  id = 'id',
  status = 'status',
  cacheExpiryDateTime = 'cacheExpiryDateTime',
  chargingPriority = 'chargingPriority',
  language1 = 'language1',
  language2 = 'language2',
  groupIdTokenId = 'groupIdTokenId',
  personalMessage = 'personalMessage',
}

@ClassResourceType(ResourceType.ID_TOKEN_INFOS)
@ClassGqlListQuery(ID_TOKEN_INFOS_LIST_QUERY)
@ClassGqlGetQuery(ID_TOKEN_INFOS_SHOW_QUERY)
@ClassGqlCreateMutation(ID_TOKEN_INFOS_CREATE_MUTATION)
@ClassGqlEditMutation(ID_TOKEN_INFOS_EDIT_MUTATION)
@ClassGqlDeleteMutation(ID_TOKEN_INFOS_DELETE_MUTATION)
@PrimaryKeyFieldName(IdTokenInfosProps.id)
export class IdTokenInfos extends BaseModel {
  @IsInt()
  @IsNotEmpty()
  id!: number;

  @IsString()
  @IsNotEmpty()
  status!: string;

  @IsString()
  cacheExpiryDateTime!: string;

  @IsInt()
  @IsNotEmpty()
  chargingPriority!: number;

  @IsString()
  @IsNotEmpty()
  language1!: string;

  @IsString()
  language2!: string;

  @IsInt()
  @IsOptional()
  groupIdTokenId?: number;

  @IsString()
  @IsOptional()
  personalMessage?: string;
}
