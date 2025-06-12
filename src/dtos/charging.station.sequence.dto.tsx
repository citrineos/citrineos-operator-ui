// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { IChargingStationSequenceDto } from '../../../citrineos-core/00_Base/src/interfaces/dto/charging.station.sequence.dto';
import { ChargingStationSequenceType } from '../../../citrineos-core/00_Base';

export class ChargingStationSequenceDto
  implements Partial<IChargingStationSequenceDto>
{
  type!: ChargingStationSequenceType;
}
