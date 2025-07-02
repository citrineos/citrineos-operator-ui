// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { ConnectorStatusEnumType } from '@OCPP2_0_1';

export enum StatusNotificationDtoProps {
  id = 'id',
  stationId = 'stationId',
  evseId = 'evseId',
  connectorId = 'connectorId',
  timestamp = 'timestamp',
  connectorStatus = 'connectorStatus',
}

export class StatusNotificationDto {
  @IsInt()
  id!: number;

  @IsString()
  stationId!: string;

  @IsString()
  evseId?: number;

  @IsString()
  connectorId!: number;

  @IsString()
  timestamp!: string;

  @IsEnum(ConnectorStatusEnumType)
  connectorStatus!: ConnectorStatusEnumType;

  @IsString()
  @IsOptional()
  errorCode?: string;

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
