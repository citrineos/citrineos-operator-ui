// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import {
  ChargingStationSequenceType,
  IChargingStationSequenceDto,
} from '@citrineos/base';

export class ChargingStationSequenceDto
  implements Partial<IChargingStationSequenceDto>
{
  type!: ChargingStationSequenceType;
}
