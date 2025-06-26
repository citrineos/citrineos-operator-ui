// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { IsEnum, IsInt, IsString } from 'class-validator';
import { ConnectorStatusEnumType } from '@OCPP2_0_1';
import { ClassResourceType } from '@util/decorators/ClassResourceType';
import { ResourceType } from '@util/auth';
import { ClassGqlListQuery } from '@util/decorators/ClassGqlListQuery';
import { ClassGqlGetQuery } from '@util/decorators/ClassGqlGetQuery';
import { ClassGqlCreateMutation } from '@util/decorators/ClassGqlCreateMutation';
import { ClassGqlEditMutation } from '@util/decorators/ClassGqlEditMutation';
import { ClassGqlDeleteMutation } from '@util/decorators/ClassGqlDeleteMutation';
import { PrimaryKeyFieldName } from '@util/decorators/PrimaryKeyFieldName';
import {
  STATUS_NOTIFICATIONS_CREATE_MUTATION,
  STATUS_NOTIFICATIONS_DELETE_MUTATION,
  STATUS_NOTIFICATIONS_EDIT_MUTATION,
  STATUS_NOTIFICATIONS_GET_QUERY,
  STATUS_NOTIFICATIONS_LIST_QUERY,
} from './queries';

export enum StatusNotificationProps {
  id = 'id',
  stationId = 'stationId',
  evseId = 'evseId',
  connectorId = 'connectorId',
  timestamp = 'timestamp',
  connectorStatus = 'connectorStatus',
}

@ClassResourceType(ResourceType.STATUS_NOTIFICATIONS)
@ClassGqlListQuery(STATUS_NOTIFICATIONS_LIST_QUERY)
@ClassGqlGetQuery(STATUS_NOTIFICATIONS_GET_QUERY)
@ClassGqlCreateMutation(STATUS_NOTIFICATIONS_CREATE_MUTATION)
@ClassGqlEditMutation(STATUS_NOTIFICATIONS_EDIT_MUTATION)
@ClassGqlDeleteMutation(STATUS_NOTIFICATIONS_DELETE_MUTATION)
@PrimaryKeyFieldName(StatusNotificationProps.id)
export class StatusNotification {
  @IsInt()
  id!: number;

  @IsString()
  stationId!: string;

  @IsString()
  evseId!: number;

  @IsString()
  connectorId!: number;

  @IsString()
  timestamp!: string;

  @IsEnum(ConnectorStatusEnumType)
  connectorStatus!: ConnectorStatusEnumType;

  constructor(data: StatusNotification) {
    if (data) {
      Object.assign(this, {
        [StatusNotificationProps.id]: data.id,
        [StatusNotificationProps.stationId]: data.stationId,
        [StatusNotificationProps.evseId]: data.evseId,
        [StatusNotificationProps.connectorId]: data.connectorId,
        [StatusNotificationProps.timestamp]: data.timestamp,
        [StatusNotificationProps.connectorStatus]: data.connectorStatus,
      });
    }
  }
}
