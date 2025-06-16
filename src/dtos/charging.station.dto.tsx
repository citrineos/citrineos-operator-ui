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
}

export enum ChargignStationStatus {
  CHARGING = 'CHARGING',
  CHARGING_SUSPENDED = 'CHARGING_SUSPENDED',
  AVAILABLE = 'AVAILABLE',
  UNAVAILABLE = 'UNAVAILABLE',
  FAULTED = 'FAULTED',
}

export interface ChargingStationStatusCounts {
  [ChargignStationStatus.CHARGING]: number;
  [ChargignStationStatus.CHARGING_SUSPENDED]: number;
  [ChargignStationStatus.AVAILABLE]: number;
  [ChargignStationStatus.UNAVAILABLE]: number;
  [ChargignStationStatus.FAULTED]: number;
}

export const getChargingStationStatus = (
  chargingStation: IChargingStationDto,
) => {
  const counts = getChargingStationStatusCounts(chargingStation);

  if (counts[ChargignStationStatus.FAULTED] > 0) {
    return ChargignStationStatus.FAULTED;
  } else if (counts[ChargignStationStatus.AVAILABLE] > 0) {
    return ChargignStationStatus.AVAILABLE;
  } else {
    if (counts[ChargignStationStatus.CHARGING_SUSPENDED] > 0) {
      return ChargignStationStatus.CHARGING_SUSPENDED;
    } else if (counts[ChargignStationStatus.UNAVAILABLE] > 0) {
      return ChargignStationStatus.UNAVAILABLE;
    }
  }
};

export const getChargingStationStatusCounts = (
  chargingStation: IChargingStationDto,
) => {
  const counts: ChargingStationStatusCounts = {
    [ChargignStationStatus.CHARGING]: 0,
    [ChargignStationStatus.CHARGING_SUSPENDED]: 0,
    [ChargignStationStatus.AVAILABLE]: 0,
    [ChargignStationStatus.UNAVAILABLE]: 0,
    [ChargignStationStatus.FAULTED]: 0,
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
            counts[ChargignStationStatus.AVAILABLE]++;
            break;
          case ConnectorStatusEnumType.Occupied: {
            const activeTransaction = chargingStation?.transactions?.find(
              (transaction) => transaction.evseDatabaseId === evse.databaseId,
            );
            if (activeTransaction && activeTransaction.isActive) {
              const chargingState = activeTransaction.chargingState;
              if (chargingState === ChargingStateEnumType.Charging) {
                counts[ChargignStationStatus.CHARGING]++;
              } else {
                counts[ChargignStationStatus.CHARGING_SUSPENDED]++;
              }
            }
            break;
          }
          case ConnectorStatusEnumType.Faulted:
            counts[ChargignStationStatus.FAULTED]++;
            break;
          case ConnectorStatusEnumType.Unavailable:
            counts[ChargignStationStatus.UNAVAILABLE]++;
            break;
          case ConnectorStatusEnumType.Reserved:
          default:
            // no handling
            break;
        }
      } else {
        counts[ChargignStationStatus.UNAVAILABLE]++;
      }
    }
  }
  return counts;
};
