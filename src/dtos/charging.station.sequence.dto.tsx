// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import type { IChargingStationSequenceDto } from '@citrineos/base';
import { ChargingStationSequenceType } from '@citrineos/base';

export class ChargingStationSequenceDto
  implements Partial<IChargingStationSequenceDto>
{
  type!: ChargingStationSequenceType;
}
