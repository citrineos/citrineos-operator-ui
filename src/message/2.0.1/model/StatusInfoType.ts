// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { CustomDataType } from '../../../model/CustomData';
import { Type } from 'class-transformer';
import { IsOptional, IsString, ValidateNested } from 'class-validator';

export class StatusInfoType {
  @Type(() => CustomDataType)
  @ValidateNested()
  @IsOptional()
  customData?: CustomDataType | null;

  @IsString()
  reasonCode!: string;

  @IsString()
  @IsOptional()
  additionalInfo?: string | null;
}
