// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { ITransactionDto } from '../../../citrineos-core/00_Base/src/interfaces/dto/transaction.dto';
import { ChargingStateEnumType, ReasonEnumType } from '@OCPP2_0_1';

export class TransactionDto implements Partial<ITransactionDto> {
  chargingState?: ChargingStateEnumType;
  stoppedReason?: ReasonEnumType;
}
