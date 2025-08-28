// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { IChargingStationDto, IConnectorDto, IEvseDto } from '@citrineos/base';

export class EvseDto implements Partial<IEvseDto> {
  id?: number;
  stationId!: string;
  evseTypeId?: number;
  evseId!: string;
  physicalReference?: string | null;
  removed?: boolean;
  chargingStation?: IChargingStationDto;
  connectors?: IConnectorDto[] | null;
}
