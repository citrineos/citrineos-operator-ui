// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  validateSync,
} from 'class-validator';
import { Expose, plainToInstance, Type } from 'class-transformer';
import { StatusNotificationDto } from './status.notification.dto';
import { EvseDto } from './evse.dto';
import { BaseDto } from './base.dto';
import { TransactionDto } from './transaction.dto';
import { LatestStatusNotificationDto } from './latest.status.notification.dto';
import { LocationDto } from './location.dto';
import { ChargingStateEnumType, ConnectorStatusEnumType } from '@OCPP2_0_1';
import { ToClass } from '@util/Transformers';
import { OCPPMessageDto } from './ocpp.message.dto';
import { OCPPVersion } from '@citrineos/base';

export enum ChargingStationDtoProps {
  id = 'id',
  isOnline = 'isOnline',
  protocol = 'protocol',
  locationId = 'locationId',
  statusNotifications = 'statusNotifications',
  latestStatusNotifications = 'latestStatusNotifications',
  evses = 'evses',
  transactions = 'transactions',
  ocppLogs = 'ocppLogs',
  location = 'Location',
  chargePointVendor = 'chargePointVendor',
  chargePointModel = 'chargePointModel',
  chargePointSerialNumber = 'chargePointSerialNumber',
  chargeBoxSerialNumber = 'chargeBoxSerialNumber',
  firmwareVersion = 'firmwareVersion',
  iccid = 'iccid',
  imsi = 'imsi',
  meterSerialNumber = 'meterSerialNumber',
}

export class ChargingStationDto extends BaseDto {
  @IsString()
  id!: string;

  @IsBoolean()
  isOnline!: boolean;

  @IsEnum(OCPPVersion)
  protocol?: OCPPVersion;

  @IsOptional()
  locationId?: string;

  @IsArray()
  @IsOptional()
  @Type(() => StatusNotificationDto)
  @Expose({ name: 'StatusNotifications' })
  statusNotifications?: StatusNotificationDto[];

  @IsArray()
  @IsOptional()
  @Type(() => LatestStatusNotificationDto)
  @Expose({ name: 'LatestStatusNotifications' })
  latestStatusNotifications?: LatestStatusNotificationDto[];

  @IsArray()
  @IsOptional()
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
  evses?: EvseDto[];

  @IsArray()
  @IsOptional()
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

  @IsArray()
  @IsOptional()
  @Type(() => TransactionDto)
  @Expose({ name: 'Transactions' })
  transactions?: TransactionDto[];

  @IsArray()
  @IsOptional()
  @Type(() => OCPPMessageDto)
  ocppLogs?: OCPPMessageDto[];

  @IsOptional()
  @Type(() => LocationDto)
  @Expose({ name: 'Location' })
  location?: Partial<LocationDto>;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  chargePointVendor?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  chargePointModel?: string;

  @IsOptional()
  @IsString()
  @MaxLength(25)
  chargePointSerialNumber?: string;

  @IsOptional()
  @IsString()
  @MaxLength(25)
  chargeBoxSerialNumber?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  firmwareVersion?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  iccid?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  imsi?: string;

  @IsOptional()
  @IsString()
  @MaxLength(25)
  meterType?: string;

  @IsOptional()
  @IsString()
  @MaxLength(25)
  meterSerialNumber?: string;
  Location: any;
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
  chargingStation: ChargingStationDto,
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
  chargingStation: ChargingStationDto,
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
