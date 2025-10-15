// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { IsOptional } from 'class-validator';
import TransformDatetime from '@util/TransformDatetime';
import { Type } from 'class-transformer';
import { IChargingProfileDto } from '@citrineos/base';

export class ChargingProfile implements Partial<IChargingProfileDto> {
  @Type(() => Date)
  @TransformDatetime()
  @IsOptional()
  validFrom: string | null = null;

  @Type(() => Date)
  @TransformDatetime()
  @IsOptional()
  validTo: string | null = null;

  constructor(data: Partial<IChargingProfileDto>) {
    if (data) {
      Object.assign(this, {
        id: data.id,
        databaseId: data.databaseId,
        stationId: data.stationId,
        chargingProfileKind: data.chargingProfileKind,
        chargingProfilePurpose: data.chargingProfilePurpose,
        recurrencyKind: data.recurrencyKind,
        stackLevel: data.stackLevel,
        validFrom: data.validFrom,
        validTo: data.validTo,
        evseId: data.evseId,
        isActive: data.isActive,
        chargingLimitSource: data.chargingLimitSource,
        transactionDatabaseId: data.transactionDatabaseId,
      });
    }
  }
}
