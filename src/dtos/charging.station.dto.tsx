// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { ChargingStateEnumType, ConnectorStatusEnumType } from '@OCPP2_0_1';
import { IChargingStationDto } from '@citrineos/base';
import { OCPPVersion } from '@citrineos/base';
import { OCPPMessageDto } from './ocpp.message.dto';
import { Expose, plainToInstance } from 'class-transformer';
import { ToClass } from '@util/Transformers';
import { EvseDto } from './evse.dto';
import { validateSync } from 'class-validator';
import { IEvseDto } from '@citrineos/base';
import * as locationDto from '@citrineos/base';
import { ITransactionDto } from '@citrineos/base';
import { IStatusNotificationDto } from '@citrineos/base';
import { ILatestStatusNotificationDto } from '@citrineos/base';

export class ChargingStationDto implements Partial<IChargingStationDto> {
  protocol?: OCPPVersion;
  ocppLogs?: OCPPMessageDto[];
  @Expose({ name: 'StatusNotifications' })
  statusNotifications?: IStatusNotificationDto[];
  @Expose({ name: 'LatestStatusNotifications' })
  latestStatusNotifications?: ILatestStatusNotificationDto[];

  @Expose({ name: 'Evses' })
  @ToClass((value: { Evse: EvseDto }[]) => {
    if (value === null || value === undefined) {
      return undefined;
    }
    return value.map((val: any) => {
      if ('Evse' in val) {
        return plainToInstance(EvseDto, val.Evse);
      } else {
        const instance = plainToInstance(EvseDto, val);
        const errors = validateSync(value, { whitelist: true });
        if (errors.length === 0) {
          return instance;
        } else {
          return val;
        }
      }
    });
  })
  evses?: IEvseDto[];
  @Expose({ name: 'ConnectorTypes' })
  @ToClass((value: { value: string }[]) => {
    if (value === null || value === undefined) {
      return undefined;
    }
    return value
      .filter((val: { value: string }) => !!val.value)
      .map((val: { value: string }) => val.value);
  })
  connectorTypes?: string[];
  @Expose({ name: 'Transactions' })
  transactions?: ITransactionDto[];
  @Expose({ name: 'Location' })
  location?: locationDto.ILocationDto;
  isOnline?: boolean;
}

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
        chargingStation?.latestStatusNotifications?.find(
          (latestStatusNotification) =>
            latestStatusNotification?.statusNotification?.evseId === evse.id &&
            latestStatusNotification?.statusNotification?.connectorId ===
              evse.connectorId,
        );
      if (latestStatusNotificationForEvse) {
        const connectorStatus: ConnectorStatusEnumType =
          latestStatusNotificationForEvse?.statusNotification
            ?.connectorStatus || ConnectorStatusEnumType.Unavailable;
        switch (connectorStatus) {
          case ConnectorStatusEnumType.Available:
            counts[ChargingStationStatus.AVAILABLE]++;
            break;
          case ConnectorStatusEnumType.Occupied: {
            const activeTransaction = chargingStation?.transactions?.find(
              (transaction) => transaction.evseDatabaseId === evse.databaseId,
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
