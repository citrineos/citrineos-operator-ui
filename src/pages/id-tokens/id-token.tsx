// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

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
import { IdTokenDtoProps, IIdTokenDto } from '@citrineos/base';
import { IsInt, IsNotEmpty } from 'class-validator';

@ClassResourceType(ResourceType.ID_TOKENS)
@ClassGqlListQuery(ID_TOKENS_LIST_QUERY)
@ClassGqlGetQuery(ID_TOKENS_SHOW_QUERY)
@ClassGqlCreateMutation(ID_TOKENS_CREATE_MUTATION)
@ClassGqlEditMutation(ID_TOKENS_EDIT_MUTATION)
@ClassGqlDeleteMutation(ID_TOKENS_DELETE_MUTATION)
@PrimaryKeyFieldName(IdTokenDtoProps.id)
export class IdToken implements Partial<IIdTokenDto> {
  @IsInt()
  @IsNotEmpty()
  id!: number;
}
