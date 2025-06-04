// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import {
  IsBoolean,
  IsDate,
  IsDefined,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  ConnectorEnumType,
  IdTokenEnumType,
  ReserveNowStatusEnumType,
} from '@OCPP2_0_1';
import { CustomDataType } from '../../model/CustomData';
import { TransformDate } from '@util/TransformDate';
import { Dayjs } from 'dayjs';

export class AdditionalInfoType {
  @IsOptional()
  @Type(() => CustomDataType)
  customData?: CustomDataType | null;

  @IsString()
  additionalIdToken!: string;

  @IsString()
  type!: string;
}

export class IdTokenType {
  @IsOptional()
  @Type(() => CustomDataType)
  customData?: CustomDataType | null;

  @IsOptional()
  @Type(() => AdditionalInfoType)
  additionalInfo?: AdditionalInfoType[];

  @IsString()
  idToken!: string;

  @IsEnum(IdTokenEnumType)
  type!: IdTokenEnumType;
}

export class Reservation {
  @IsInt()
  databaseId!: number;

  @IsInt()
  id!: number;

  @IsString()
  stationId!: string;

  @Type(() => Date)
  @IsDate()
  @TransformDate()
  expiryDateTime!: Dayjs;

  @IsEnum(ConnectorEnumType)
  @IsOptional()
  connectorType: ConnectorEnumType | null = null;

  @IsEnum(ReserveNowStatusEnumType)
  @IsOptional()
  reserveStatus: ReserveNowStatusEnumType | null = null;

  @IsBoolean()
  isActive!: boolean;

  @IsString()
  @IsOptional()
  terminatedByTransaction: string | null = null;

  @Type(() => IdTokenType)
  @IsDefined()
  idToken!: IdTokenType;

  @Type(() => IdTokenType)
  @IsDefined()
  groupIdToken!: IdTokenType;

  @IsInt()
  @IsOptional()
  evseId: number | null = null;

  constructor(data: Reservation) {
    if (data) {
      this.databaseId = data.databaseId;
      this.id = data.id;
      this.stationId = data.stationId;
      this.expiryDateTime = data.expiryDateTime;
      this.connectorType = data.connectorType;
      this.reserveStatus = data.reserveStatus;
      this.isActive = data.isActive;
      this.terminatedByTransaction = data.terminatedByTransaction;
      this.idToken = data.idToken;
      this.groupIdToken = data.groupIdToken;
      this.evseId = data.evseId;
    }
  }
}
