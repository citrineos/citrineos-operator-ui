// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import {
  AttributeEnumType,
  DataEnumType,
  MutabilityEnumType,
} from '@OCPP2_0_1';
import { Type } from 'class-transformer';
import { ComponentDto } from './component.dto';
import { VariableDto } from './variable.dto';
import { BaseDto } from './base.dto';

export class VariableAttributeDto extends BaseDto {
  @IsNumber()
  id!: number;

  @IsString()
  stationId!: string;

  @IsOptional()
  @IsEnum(AttributeEnumType)
  type?: AttributeEnumType | null;

  @IsEnum(DataEnumType)
  dataType!: DataEnumType;

  @IsOptional()
  @IsString()
  value?: string | null;

  @IsOptional()
  @IsEnum(MutabilityEnumType)
  mutability?: MutabilityEnumType | null;

  @IsBoolean()
  persistent!: boolean;

  @IsBoolean()
  constant!: boolean;

  @Type(() => VariableDto)
  @IsOptional()
  variableId?: VariableDto | null;

  @Type(() => ComponentDto)
  @IsOptional()
  componentId?: ComponentDto | null;

  @IsOptional()
  @IsNumber()
  evseDatabaseId?: number | null;

  @IsOptional()
  @IsString()
  generatedAt?: string;
}
