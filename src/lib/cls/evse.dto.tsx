// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import type {
  ChargingStationDto,
  ConnectorDto,
  EvseDto,
} from '@citrineos/base';

export class EvseClass implements Partial<EvseDto> {
  id?: number;
  stationId!: string;
  evseTypeId?: number;
  evseId!: string;
  physicalReference?: string | null;
  removed?: boolean;
  chargingStation?: ChargingStationDto;
  connectors?: ConnectorDto[] | null;
}
