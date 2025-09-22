// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import type { IChargingStationDto, ILocationDto } from '@citrineos/base';
import type { Point } from 'geojson';

export class LocationDto implements Partial<ILocationDto> {
  coordinates!: Point;

  chargingPool!: IChargingStationDto[];
}
