// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { IsString, MinLength } from 'class-validator';
import { UnknownPropertiesType } from '@util/unknowns';

export class CustomDataType {
  @IsString()
  @MinLength(1)
  vendorId!: string;

  @UnknownPropertiesType
  unknownProperties!: unknown[];
}
