// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { IsEnum, IsNumber, IsOptional, ValidateNested } from 'class-validator';
import {
  LocationEnumType,
  MeasurandEnumType,
  PhaseEnumType,
  ReadingContextEnumType,
} from '@OCPP2_0_1';
import { Type } from 'class-transformer';
import {
  SignedMeterValue,
  UnitOfMeasure,
} from '../pages/meter-values/SampledValue';

export enum SampledValueDtoProps {
  value = 'value',
  context = 'context',
  measurand = 'measurand',
  phase = 'phase',
  location = 'location',
  signedMeterValue = 'signedMeterValue',
  unitOfMeasure = 'unitOfMeasure',
}

export class SampledValueDto {
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
