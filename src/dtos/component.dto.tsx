// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { IsNumber, IsOptional, IsString } from 'class-validator';
import { BaseDto } from './base.dto';

export class ComponentDto extends BaseDto {
  @IsNumber()
  id!: number;

  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  instance?: string | null;

  @IsNumber()
  @IsOptional()
  evseDatabaseId!: number;

  @IsNumber()
  @IsOptional()
  evseId?: number;

  @IsNumber()
  @IsOptional()
  connectorId?: number;
}
