// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ConnectorStatusEnumType, ErrorCodes } from '@OCPP2_0_1';
import { PrimaryKeyFieldName } from '@util/decorators/PrimaryKeyFieldName';
import { ClassResourceType } from '@util/decorators/ClassResourceType';
import { ResourceType } from '@util/auth';
import { ClassGqlCreateMutation } from '@util/decorators/ClassGqlCreateMutation';
import { ClassGqlDeleteMutation } from '@util/decorators/ClassGqlDeleteMutation';
import { ClassGqlEditMutation } from '@util/decorators/ClassGqlEditMutation';
import { ClassGqlGetQuery } from '@util/decorators/ClassGqlGetQuery';
import { ClassGqlListQuery } from '@util/decorators/ClassGqlListQuery';
import {
  CONNECTOR_CREATE_MUTATION,
  CONNECTOR_DELETE_MUTATION,
  CONNECTOR_EDIT_MUTATION,
  CONNECTOR_GET_QUERY,
  CONNECTOR_LIST_QUERY,
} from './queries';
import { BaseModel } from '@util/BaseModel';

export enum ConnectorProps {
  id = 'id',
  stationId = 'stationId',
  connectorId = 'connectorId',
}

@ClassResourceType(ResourceType.CONNECTORS)
@ClassGqlListQuery(CONNECTOR_LIST_QUERY)
@ClassGqlGetQuery(CONNECTOR_GET_QUERY)
@ClassGqlCreateMutation(CONNECTOR_CREATE_MUTATION)
@ClassGqlEditMutation(CONNECTOR_EDIT_MUTATION)
@ClassGqlDeleteMutation(CONNECTOR_DELETE_MUTATION)
@PrimaryKeyFieldName(ConnectorProps.id)
export class Connector extends BaseModel {
  @IsNumber()
  id!: number;

  @IsString()
  stationId!: string;

  @IsNumber()
  connectorId!: number;

  @IsOptional()
  status?: ConnectorStatusEnumType;

  @IsOptional()
  errorCode?: ErrorCodes;

  @IsString()
  @IsOptional()
  info?: string;

  @IsString()
  @IsOptional()
  vendorId?: string;

  @IsString()
  @IsOptional()
  vendorErrorCode?: string;
}
