// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { ResourceType } from '@util/auth';
import { ClassGqlCreateMutation } from '@util/decorators/ClassGqlCreateMutation';
import { ClassGqlDeleteMutation } from '@util/decorators/ClassGqlDeleteMutation';
import { ClassGqlEditMutation } from '@util/decorators/ClassGqlEditMutation';
import { ClassGqlGetQuery } from '@util/decorators/ClassGqlGetQuery';
import { ClassGqlListQuery } from '@util/decorators/ClassGqlListQuery';
import { ClassResourceType } from '@util/decorators/ClassResourceType';
import { PrimaryKeyFieldName } from '@util/decorators/PrimaryKeyFieldName';
import {
  SERVER_NETWORK_PROFILE_LIST_QUERY,
  SERVER_NETWORK_PROFILE_GET_QUERY,
  SERVER_NETWORK_PROFILE_CREATE_MUTATION,
  SERVER_NETWORK_PROFILE_EDIT_MUTATION,
  SERVER_NETWORK_PROFILE_DELETE_MUTATION,
} from './queries';
import {
  IServerNetworkProfileDto,
  ServerNetworkProfileDtoProps,
} from '@citrineos/base';
import { IsNotEmpty, IsString } from 'class-validator';

@ClassResourceType(ResourceType.SERVER_NETWORK_PROFILES)
@ClassGqlListQuery(SERVER_NETWORK_PROFILE_LIST_QUERY)
@ClassGqlGetQuery(SERVER_NETWORK_PROFILE_GET_QUERY)
@ClassGqlCreateMutation(SERVER_NETWORK_PROFILE_CREATE_MUTATION)
@ClassGqlEditMutation(SERVER_NETWORK_PROFILE_EDIT_MUTATION)
@ClassGqlDeleteMutation(SERVER_NETWORK_PROFILE_DELETE_MUTATION)
@PrimaryKeyFieldName(ServerNetworkProfileDtoProps.id)
export class ServerNetworkProfile implements Partial<IServerNetworkProfileDto> {
  @IsString()
  @IsNotEmpty()
  id!: string;
}
