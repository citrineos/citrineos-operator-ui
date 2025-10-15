// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { IsDate } from 'class-validator';
import { Type } from 'class-transformer';
import { TransformDate } from '@util/TransformDate';
import { Dayjs } from 'dayjs';
import { IReservationDto } from '@citrineos/base';

export class Reservation implements Partial<IReservationDto> {
  @Type(() => Date)
  @IsDate()
  @TransformDate()
  expiryDateTime!: string;

  constructor(data: Reservation) {
    if (data) {
      Object.keys(data).forEach((key) => {
        if (Object.prototype.hasOwnProperty.call(this, key)) {
          (this as any)[key] = (data as any)[key];
        }
      });
    }
  }
}
