// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { Expose, plainToInstance } from 'class-transformer';
import { IsBoolean, validateSync } from 'class-validator';

import {
  IChargingStationDto,
  IStatusNotificationDto,
  IEvseDto,
  ILocationDto,
  IConnectorDto,
  ChargingStationParkingRestriction,
  ChargingStationCapability,
} from '@citrineos/base';
import { Point } from 'geojson';
import { ChargingStateEnumType, ConnectorStatusEnumType } from '@OCPP2_0_1';

export class ChargingStationDto implements Partial<IChargingStationDto> {
  id!: string;
  @IsBoolean()
  isOnline!: boolean;
  protocol?: any;
  chargePointVendor?: string | null;
  chargePointModel?: string | null;
  chargePointSerialNumber?: string | null;
  chargeBoxSerialNumber?: string | null;
  firmwareVersion?: string | null;
  iccid?: string | null;
  imsi?: string | null;
  meterType?: string | null;
  meterSerialNumber?: string | null;
  coordinates?: Point | null;
  floorLevel?: string | null;
  parkingRestrictions?: ChargingStationParkingRestriction[] | null;
  capabilities?: ChargingStationCapability[] | null;
  locationId?: number | null;
  @Expose({ name: 'StatusNotifications' })
  statusNotifications?: IStatusNotificationDto[] | null;
  evses?: IEvseDto[] | null;
  connectors?: IConnectorDto[] | null;
  // TODO: Add missing properties from IChargingStationDto
  location?: ILocationDto;
  networkProfiles?: any;
  transactions?: any[] | null;
}

// TODO: Add missing enums and types for local use
export enum ChargingStationStatus {
  CHARGING = 'CHARGING',
  CHARGING_SUSPENDED = 'CHARGING_SUSPENDED',
  AVAILABLE = 'AVAILABLE',
  UNAVAILABLE = 'UNAVAILABLE',
  FAULTED = 'FAULTED',
}

export interface ChargingStationStatusCounts {
  [ChargingStationStatus.CHARGING]: number;
  [ChargingStationStatus.CHARGING_SUSPENDED]: number;
  [ChargingStationStatus.AVAILABLE]: number;
  [ChargingStationStatus.UNAVAILABLE]: number;
  [ChargingStationStatus.FAULTED]: number;
}

export const getChargingStationStatus = (
  chargingStation: IChargingStationDto,
) => {
  const counts = getChargingStationStatusCounts(chargingStation);

  if (counts[ChargingStationStatus.FAULTED] > 0) {
    return ChargingStationStatus.FAULTED;
  } else if (counts[ChargingStationStatus.AVAILABLE] > 0) {
    return ChargingStationStatus.AVAILABLE;
  } else {
    if (counts[ChargingStationStatus.CHARGING_SUSPENDED] > 0) {
      return ChargingStationStatus.CHARGING_SUSPENDED;
    } else if (counts[ChargingStationStatus.UNAVAILABLE] > 0) {
      return ChargingStationStatus.UNAVAILABLE;
    }
  }
};

export const getChargingStationStatusCounts = (
  chargingStation: IChargingStationDto,
) => {
  const counts: ChargingStationStatusCounts = {
    [ChargingStationStatus.CHARGING]: 0,
    [ChargingStationStatus.CHARGING_SUSPENDED]: 0,
    [ChargingStationStatus.AVAILABLE]: 0,
    [ChargingStationStatus.UNAVAILABLE]: 0,
    [ChargingStationStatus.FAULTED]: 0,
  };
  const evses = chargingStation?.evses;
  if (evses && evses.length > 0) {
    for (const evse of evses) {
      const latestStatusNotificationForEvse =
        chargingStation?.statusNotifications?.find(
          (latestStatusNotification) =>
            latestStatusNotification?.evseId === evse.id &&
            latestStatusNotification?.connectorId === evse.connectors?.[0]?.id,
        );
      if (latestStatusNotificationForEvse) {
        const connectorStatus: ConnectorStatusEnumType =
          latestStatusNotificationForEvse?.connectorStatus ||
          ConnectorStatusEnumType.Unavailable;
        switch (connectorStatus) {
          case ConnectorStatusEnumType.Available:
            counts[ChargingStationStatus.AVAILABLE]++;
            break;
          case ConnectorStatusEnumType.Occupied: {
            const activeTransaction = (
              chargingStation as ChargingStationDto
            )?.transactions?.find(
              (transaction) => transaction.evse?.id === evse.id,
            );
            if (activeTransaction && activeTransaction.isActive) {
              const chargingState = activeTransaction.chargingState;
              if (chargingState === ChargingStateEnumType.Charging) {
                counts[ChargingStationStatus.CHARGING]++;
              } else {
                counts[ChargingStationStatus.CHARGING_SUSPENDED]++;
              }
            }
            break;
          }
          case ConnectorStatusEnumType.Faulted:
            counts[ChargingStationStatus.FAULTED]++;
            break;
          case ConnectorStatusEnumType.Unavailable:
            counts[ChargingStationStatus.UNAVAILABLE]++;
            break;
          case ConnectorStatusEnumType.Reserved:
          default:
            // no handling
            break;
        }
      } else {
        counts[ChargingStationStatus.UNAVAILABLE]++;
      }
    }
  }
  return counts;
};
