// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { IsDate } from 'class-validator';
import { Type } from 'class-transformer';
import { TransformDate } from '@util/TransformDate';
import { Dayjs } from 'dayjs';
import { IMessageInfoDto } from '@citrineos/base';
export class MessageInfo implements Partial<IMessageInfoDto> {
  @Type(() => Date)
  @IsDate()
  @TransformDate()
  startDateTime: string | null = null;

  @Type(() => Date)
  @IsDate()
  @TransformDate()
  endDateTime: string | null = null;

  constructor(data: Partial<IMessageInfoDto>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}
