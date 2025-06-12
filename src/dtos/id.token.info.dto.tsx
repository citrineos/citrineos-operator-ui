// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { IIdTokenInfoDto } from '../../../citrineos-core/00_Base/src/interfaces/dto/id.token.info.dto';
import { AuthorizationStatusEnumType } from '@OCPP2_0_1';

export class IdTokenInfoDto implements Partial<IIdTokenInfoDto> {
  status!: AuthorizationStatusEnumType;
}
