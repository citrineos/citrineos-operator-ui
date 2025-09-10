// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import {
  ITransactionDto,
  ITransactionEventDto,
  IChargingStationDto,
  IEvseDto,
  IMeterValueDto,
  IStartTransactionDto,
  IStopTransactionDto,
  IConnectorDto,
  IAuthorizationDto,
  ITariffDto,
  ILocationDto,
} from '@citrineos/base';
import { ChargingStateEnumType, ReasonEnumType } from '@OCPP2_0_1';

export class TransactionDto implements Partial<ITransactionDto> {
  id?: number;
  transactionId!: string;
  stationId!: string;
  transactionEvents?: ITransactionEventDto[];
  chargingStation?: IChargingStationDto;
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
  location?: ILocationDto;
  evseId?: number;
  connectorId?: number;
  connector?: IConnectorDto | null;
  authorizationId?: number;
  authorization?: IAuthorizationDto;
  tariffId?: number | null;
  tariff?: ITariffDto | null;
  startTime?: string | null;
  endTime?: string | null;
  customData?: any | null;
}
