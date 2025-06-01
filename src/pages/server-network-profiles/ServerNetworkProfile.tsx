// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { BaseModel } from '@util/BaseModel';
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

export enum ServerNetworkProfileProps {
  id = 'id',
  host = 'host',
  port = 'port',
  pingInterval = 'pingInterval',
  protocol = 'protocol',
  messageTimeout = 'messageTimeout',
  securityProfile = 'securityProfile',
  allowUnknownChargingStations = 'allowUnknownChargingStations',
  tlsKeyFilePath = 'tlsKeyFilePath',
  tlsCertificateChainFilePath = 'tlsCertificateChainFilePath',
  mtlsCertificateAuthorityKeyFilePath = 'mtlsCertificateAuthorityKeyFilePath',
  rootCACertificateFilePath = 'rootCACertificateFilePath',
}

@ClassResourceType(ResourceType.SERVER_NETWORK_PROFILES)
@ClassGqlListQuery(SERVER_NETWORK_PROFILE_LIST_QUERY)
@ClassGqlGetQuery(SERVER_NETWORK_PROFILE_GET_QUERY)
@ClassGqlCreateMutation(SERVER_NETWORK_PROFILE_CREATE_MUTATION)
@ClassGqlEditMutation(SERVER_NETWORK_PROFILE_EDIT_MUTATION)
@ClassGqlDeleteMutation(SERVER_NETWORK_PROFILE_DELETE_MUTATION)
@PrimaryKeyFieldName(ServerNetworkProfileProps.id)
export class ServerNetworkProfile extends BaseModel {
  @IsString()
  @IsNotEmpty()
  id!: string;

  @IsString()
  @IsNotEmpty()
  host!: string;

  @IsInt()
  @IsNotEmpty()
  port!: number;

  @IsInt()
  @IsNotEmpty()
  pingInterval!: number;

  @IsString()
  @IsNotEmpty()
  protocol!: string;

  @IsInt()
  @IsNotEmpty()
  messageTimeout!: number;

  @IsInt()
  @IsNotEmpty()
  securityProfile!: number;

  @IsBoolean()
  @IsNotEmpty()
  allowUnknownChargingStations!: boolean;

  @IsString()
  @IsOptional()
  tlsKeyFilePath?: string;

  @IsString()
  @IsOptional()
  tlsCertificateChainFilePath?: string;

  @IsString()
  @IsOptional()
  mtlsCertificateAuthorityKeyFilePath?: string;

  @IsString()
  @IsOptional()
  rootCACertificateFilePath?: string;
}
