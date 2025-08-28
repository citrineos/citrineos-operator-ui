// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { IsOptional } from 'class-validator';
import { TransformDate } from '@util/TransformDate';
import { IBootDto } from '@citrineos/base';

export class Boot implements Partial<IBootDto> {
  @IsOptional()
  @TransformDate()
  lastBootTime?: string;
}
