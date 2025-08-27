// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { ILocationDto } from '@citrineos/base';
import { GeoPoint, IsGeoPoint } from '@util/GeoPoint';
import { ToClass, ToPlain } from '@util/Transformers';
import { Expose, Type } from 'class-transformer';
import { IChargingStationDto } from '@citrineos/base';

export class LocationDto implements Partial<ILocationDto> {
  @IsGeoPoint()
  @Type(() => GeoPoint)
  @ToPlain<GeoPoint>((value) => (value ? value.json : value))
  @ToClass<GeoPoint>(GeoPoint.parse)
  coordinates?: GeoPoint;

  @Expose({ name: 'ChargingStations' })
  chargingStations!: IChargingStationDto[];
}
