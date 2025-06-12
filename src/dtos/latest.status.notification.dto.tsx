// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { ILatestStatusNotificationDto } from '../../../citrineos-core/00_Base/src/interfaces/dto/latest.status.notification.dto';
import * as statusNotificationDto from '../../../citrineos-core/00_Base/src/interfaces/dto/status.notification.dto';
import { Expose } from 'class-transformer';

export class LatestStatusNotificationDto
  implements Partial<ILatestStatusNotificationDto>
{
  @Expose({ name: 'StatusNotification' })
  statusNotification?: statusNotificationDto.IStatusNotificationDto;
}
