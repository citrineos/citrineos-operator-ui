// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';
import TransformDatetime from '@util/TransformDatetime';
import { Type } from 'class-transformer';
import {
  ChargingLimitSourceEnumType,
  ChargingProfileKindEnumType,
  ChargingProfilePurposeEnumType,
  RecurrencyKindEnumType,
} from '@OCPP2_0_1';

export class ChargingProfile {
  @IsInt()
  databaseId!: number;

  @IsInt()
  id!: number;

  @IsString()
  stationId!: string;

  @IsEnum(ChargingProfileKindEnumType)
  chargingProfileKind!: ChargingProfileKindEnumType;

  @IsEnum(ChargingProfilePurposeEnumType)
  chargingProfilePurpose!: ChargingProfilePurposeEnumType;

  @IsOptional()
  @IsEnum(RecurrencyKindEnumType)
  recurrencyKind?: RecurrencyKindEnumType;

  @IsInt()
  stackLevel!: number;

  @Type(() => Date)
  @TransformDatetime()
  @IsOptional()
  validFrom: Date | null = null;

  @Type(() => Date)
  @TransformDatetime()
  @IsOptional()
  validTo: Date | null = null;

  @IsInt()
  @IsOptional()
  evseId?: number | null = null;

  @IsBoolean()
  @IsOptional()
  isActive: boolean | null = null;

  @IsOptional()
  @IsEnum(ChargingLimitSourceEnumType)
  chargingLimitSource: ChargingLimitSourceEnumType | null = null;

  @IsInt()
  @IsOptional()
  transactionDatabaseId: number | null = null;

  constructor(data: ChargingProfile) {
    if (data) {
      this.id = data.id;
      this.databaseId = data.databaseId;
      this.stationId = data.stationId;
      this.chargingProfileKind = data.chargingProfileKind;
      this.chargingProfilePurpose = data.chargingProfilePurpose;
      this.recurrencyKind = data.recurrencyKind;
      this.stackLevel = data.stackLevel;
      this.validFrom = data.validFrom;
      this.validTo = data.validTo;
      this.evseId = data.evseId;
      this.isActive = data.isActive;
      this.chargingLimitSource = data.chargingLimitSource;
      this.transactionDatabaseId = data.transactionDatabaseId;
    }
  }
}
