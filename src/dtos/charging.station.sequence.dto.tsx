// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { IsEnum, IsInt, IsString } from 'class-validator';
import { ChargingStationSequenceType } from '@citrineos/base';
import { BaseDto } from './base.dto';

export class ChargingStationSequenceDto extends BaseDto {
  @IsString()
  stationId!: string;

  @IsEnum(ChargingStationSequenceType)
  type!: string;

  @IsInt()
  value!: number;
}
