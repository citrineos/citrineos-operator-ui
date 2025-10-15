// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { ILatestStatusNotificationDto } from '@citrineos/base';
import * as statusNotificationDto from '@citrineos/base';
import { Expose } from 'class-transformer';

export class LatestStatusNotificationDto
  implements Partial<ILatestStatusNotificationDto>
{
  @Expose({ name: 'StatusNotification' })
  statusNotification?: statusNotificationDto.IStatusNotificationDto;
}
