// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { ILocationDto, IChargingStationDto } from '@citrineos/base';
import { Point } from 'geojson';

export class LocationDto implements Partial<ILocationDto> {
  id!: number;

  coordinates!: Point;

  chargingPool!: IChargingStationDto[];
}
