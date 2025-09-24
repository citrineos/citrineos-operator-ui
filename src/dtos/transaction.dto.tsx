// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import {
  ITransactionDto,
  ITransactionEventDto,
  type IChargingStationDto,
  IEvseDto,
  IMeterValueDto,
  IStartTransactionDto,
  IStopTransactionDto,
  IConnectorDto,
  type IAuthorizationDto,
  ITariffDto,
  type ILocationDto,
} from '@citrineos/base';
import { Expose } from 'class-transformer';

export class TransactionDto implements Partial<ITransactionDto> {
  id?: number;
  transactionId!: string;
  stationId!: string;
  transactionEvents?: ITransactionEventDto[];
  @Expose({ name: 'ChargingStation' })
  chargingStation?: IChargingStationDto | undefined;
  evse?: IEvseDto | null;
  evseDatabaseId?: number;
  isActive!: boolean;
  meterValues?: IMeterValueDto[];
  startTransaction?: IStartTransactionDto;
  stopTransaction?: IStopTransactionDto;
  chargingState?: any;
  timeSpentCharging?: number | null;
  totalKwh?: number | null;
  stoppedReason?: any;
  remoteStartId?: number | null;
  totalCost?: number;
  locationId?: number;
  @Expose({ name: 'Location' })
  location?: ILocationDto | undefined;
  evseId?: number;
  connectorId?: number;
  connector?: IConnectorDto | null;
  authorizationId?: number;
  @Expose({ name: 'Authorization' })
  authorization?: IAuthorizationDto | undefined;
  tariffId?: number | null;
  tariff?: ITariffDto | null;
  startTime?: string | null;
  endTime?: string | null;
  customData?: any | null;
}
