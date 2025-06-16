// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { IsArray, IsString } from 'class-validator';
import { GeoPoint, IsGeoPoint } from '@util/GeoPoint';
import { Expose, Type } from 'class-transformer';
import { ToClass, ToPlain } from '@util/Transformers';
import { ChargingStationDto } from './charging.station.dto';
import { BaseDto } from './base.dto';

export enum LocationDtoProps {
  id = 'id',
  name = 'name',
  address = 'address',
  city = 'city',
  postalCode = 'postalCode',
  state = 'state',
  country = 'country',
  coordinates = 'coordinates',
  chargingStations = 'chargingStations',
}

export class LocationDto extends BaseDto {
  @IsString()
  id!: string;

  @IsString()
  name!: string;

  @IsString()
  address!: string;

  @IsString()
  city!: string;

  @IsString()
  postalCode!: string;

  @IsString()
  state!: string;

  @IsString()
  country!: string;

  @IsGeoPoint()
  @Type(() => GeoPoint)
  @ToPlain<GeoPoint>((value) => (value ? value.json : value))
  @ToClass<GeoPoint>(GeoPoint.parse)
  coordinates?: GeoPoint;

  @IsArray()
  @Type(() => ChargingStationDto)
  @Expose({ name: 'ChargingStations' })
  chargingStations!: ChargingStationDto[];
}
