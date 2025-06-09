// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import {
  LocationEnumType,
  MeasurandEnumType,
  PhaseEnumType,
  ReadingContextEnumType,
} from '@OCPP2_0_1';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class SignedMeterValue {
  @IsString()
  signedMeterData!: string;

  @IsString()
  signingMethod!: string;

  @IsString()
  encodingMethod!: string;

  @IsString()
  publicKey!: string;

  // customData?: CustomDataType | null; // todo: handle custom data
}

export class UnitOfMeasure {
  @IsString()
  @IsOptional()
  unit?: string | null;

  @IsNumber()
  @IsOptional()
  multiplier?: number | null;

  // customData?: CustomDataType | null; // todo: handle custom data
}

export enum SampledValueProps {
  value = 'value',
  context = 'context',
  measurand = 'measurand',
  phase = 'phase',
  location = 'location',
  signedMeterValue = 'signedMeterValue',
  unitOfMeasure = 'unitOfMeasure',
}
export class SampledValue {
  @IsNumber()
  value!: number;

  @IsEnum(ReadingContextEnumType)
  @IsOptional()
  context?: ReadingContextEnumType | null;

  @IsEnum(MeasurandEnumType)
  @IsOptional()
  measurand?: MeasurandEnumType | null;

  @IsEnum(PhaseEnumType)
  @IsOptional()
  phase?: PhaseEnumType | null;

  @IsEnum(LocationEnumType)
  @IsOptional()
  location?: LocationEnumType | null;

  @Type(() => SignedMeterValue)
  @IsOptional()
  @ValidateNested()
  signedMeterValue?: SignedMeterValue | null;

  @Type(() => UnitOfMeasure)
  @IsOptional()
  @ValidateNested()
  unitOfMeasure?: UnitOfMeasure | null;

  // customData?: CustomDataType | null; // todo: handle custom data
}
