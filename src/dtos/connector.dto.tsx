// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { IsNumber, IsOptional, IsString } from 'class-validator';
import { BaseDto } from './base.dto';
import { ConnectorStatusEnumType, ErrorCodes } from '@OCPP2_0_1';

export enum ConnectorDtoProps {
  id = 'id',
  stationId = 'stationId',
  connectorId = 'connectorId',
}

export class ConnectorDto extends BaseDto {
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
