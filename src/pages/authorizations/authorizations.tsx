// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { ClassResourceType } from '@util/decorators/ClassResourceType';
import { ClassGqlListQuery } from '@util/decorators/ClassGqlListQuery';
import { ClassGqlGetQuery } from '@util/decorators/ClassGqlGetQuery';
import { ClassGqlCreateMutation } from '@util/decorators/ClassGqlCreateMutation';
import { ClassGqlEditMutation } from '@util/decorators/ClassGqlEditMutation';
import { ClassGqlDeleteMutation } from '@util/decorators/ClassGqlDeleteMutation';
import { PrimaryKeyFieldName } from '@util/decorators/PrimaryKeyFieldName';
import { ResourceType } from '@util/auth';
import {
  AUTHORIZATIONS_CREATE_MUTATION,
  AUTHORIZATIONS_DELETE_MUTATION,
  AUTHORIZATIONS_EDIT_MUTATION,
  AUTHORIZATIONS_LIST_QUERY,
  AUTHORIZATIONS_SHOW_QUERY,
} from './queries';
import { IAuthorizationDto } from '@citrineos/base';
import { IsNumber } from 'class-validator';

export enum AuthorizationsProps {
  id = 'id',
  allowedConnectorTypes = 'allowedConnectorTypes',
  disallowedEvseIdPrefixes = 'disallowedEvseIdPrefixes',
  idTokenId = 'idTokenId',
  idTokenInfoId = 'idTokenInfoId',
  concurrentTransaction = 'concurrentTransaction',
}

@ClassResourceType(ResourceType.AUTHORIZATIONS)
@ClassGqlListQuery(AUTHORIZATIONS_LIST_QUERY)
@ClassGqlGetQuery(AUTHORIZATIONS_SHOW_QUERY)
@ClassGqlCreateMutation(AUTHORIZATIONS_CREATE_MUTATION)
@ClassGqlEditMutation(AUTHORIZATIONS_EDIT_MUTATION)
@ClassGqlDeleteMutation(AUTHORIZATIONS_DELETE_MUTATION)
@PrimaryKeyFieldName(AuthorizationsProps.id)
export class Authorization implements Partial<IAuthorizationDto> {
  @IsNumber()
  id!: number;
}
