// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { ITransactionEventDto } from '@citrineos/base';
import { TransactionEventEnumType, TriggerReasonEnumType } from '@OCPP2_0_1';
import { IMeterValueDto } from '@citrineos/base';

export class TransactionEventDto implements Partial<ITransactionEventDto> {
  eventType!: TransactionEventEnumType;
  meterValues?: IMeterValueDto[];
  triggerReason!: TriggerReasonEnumType;
}
