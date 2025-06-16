// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { ITransactionDto } from '@citrineos/base';
import { ChargingStateEnumType, ReasonEnumType } from '@OCPP2_0_1';

export class TransactionDto implements Partial<ITransactionDto> {
  chargingState?: ChargingStateEnumType;
  stoppedReason?: ReasonEnumType;
}
