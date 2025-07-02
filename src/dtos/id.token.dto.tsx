// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { IIdTokenDto } from '@citrineos/base';
import { IdTokenEnumType } from '@OCPP2_0_1';

export class IdTokenDto implements Partial<IIdTokenDto> {
  type?: IdTokenEnumType;
}
