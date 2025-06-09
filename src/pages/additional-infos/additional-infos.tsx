// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { IsInt, IsNotEmpty, IsString } from 'class-validator';
import { BaseModel } from '@util/BaseModel';
import { ClassResourceType } from '@util/decorators/ClassResourceType';
import { ClassGqlListQuery } from '@util/decorators/ClassGqlListQuery';
import { ClassGqlGetQuery } from '@util/decorators/ClassGqlGetQuery';
import { ClassGqlCreateMutation } from '@util/decorators/ClassGqlCreateMutation';
import { ClassGqlEditMutation } from '@util/decorators/ClassGqlEditMutation';
import { ClassGqlDeleteMutation } from '@util/decorators/ClassGqlDeleteMutation';
import { PrimaryKeyFieldName } from '@util/decorators/PrimaryKeyFieldName';
import {
  ADDITIONAL_INFOS_CREATE_MUTATION,
  ADDITIONAL_INFOS_DELETE_MUTATION,
  ADDITIONAL_INFOS_EDIT_MUTATION,
  ADDITIONAL_INFOS_LIST_QUERY,
  ADDITIONAL_INFOS_SHOW_QUERY,
} from '../../queries/additionalInfo';
import { ResourceType } from '@util/auth';

export enum AdditionalInfosProps {
  id = 'id',
  additionalIdToken = 'additionalIdToken',
  type = 'type',
}

@ClassResourceType(ResourceType.ADDITIONAL_INFOS)
@ClassGqlListQuery(ADDITIONAL_INFOS_LIST_QUERY)
@ClassGqlGetQuery(ADDITIONAL_INFOS_SHOW_QUERY)
@ClassGqlCreateMutation(ADDITIONAL_INFOS_CREATE_MUTATION)
@ClassGqlEditMutation(ADDITIONAL_INFOS_EDIT_MUTATION)
@ClassGqlDeleteMutation(ADDITIONAL_INFOS_DELETE_MUTATION)
@PrimaryKeyFieldName(AdditionalInfosProps.id)
export class AdditionalInfos extends BaseModel {
  @IsInt()
  @IsNotEmpty()
  id!: number;

  @IsString()
  @IsNotEmpty()
  additionalIdToken!: string;

  @IsString()
  @IsNotEmpty()
  type!: string;
}
