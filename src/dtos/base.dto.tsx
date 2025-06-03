// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { TransformDate } from '@util/TransformDate';
import { IsOptional } from 'class-validator';

export enum BaseDtoProps {
  updatedAt = 'updatedAt',
  createdAt = 'createdAt',
}

export class BaseDto {
  @TransformDate()
  @IsOptional()
  updatedAt?: Date;

  @TransformDate()
  @IsOptional()
  createdAt?: Date;
}
