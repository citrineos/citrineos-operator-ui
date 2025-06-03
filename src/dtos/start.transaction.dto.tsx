// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import {
  IsDate,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { BaseDto } from './base.dto';
import { Expose, Type } from 'class-transformer';
import { TransformDate } from '@util/TransformDate';
import { IdTokenDto } from './id.token.dto';
import { ConnectorDto } from './connector.dto';

export enum StartTransactionDtoProps {
  id = 'id',
  stationId = 'stationId',
  meterStart = 'meterStart',
  timestamp = 'timestamp',
  reservationId = 'reservationId',
  transactionDatabaseId = 'transactionDatabaseId',
  idTokenDatabaseId = 'idTokenDatabaseId',
  connectorDatabaseId = 'connectorDatabaseId',
  idToken = 'IdToken',
  connector = 'connector',
}

export class StartTransactionDto extends BaseDto {
  @IsInt()
  @IsNotEmpty()
  id!: number;

  @IsString()
  @IsNotEmpty()
  stationId!: string;

  @IsNumber()
  @IsNotEmpty()
  meterStart!: number; // in Wh

  @TransformDate()
  @IsNotEmpty()
  timestamp!: Date;

  @IsInt()
  @IsOptional()
  reservationId?: number | null;

  @IsString()
  @IsOptional()
  transactionDatabaseId?: string;

  @IsInt()
  @IsOptional()
  idTokenDatabaseId?: number | null;

  @IsInt()
  @IsNotEmpty()
  connectorDatabaseId!: number;

  @IsOptional()
  @Type(() => IdTokenDto)
  @Expose({ name: 'IdToken' })
  idToken?: IdTokenDto;

  @IsOptional()
  @Type(() => ConnectorDto)
  @Expose({ name: 'Connector' })
  connector?: ConnectorDto;
}
