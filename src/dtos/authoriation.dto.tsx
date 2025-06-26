// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import * as base from '@citrineos/base';
import { AllowedConnectorTypes, DisallowedEvseIdPrefixes } from '@enums';
import { Expose } from 'class-transformer';
import { IAuthorizationDto } from '@citrineos/base';

export class AuthorizationDto implements Partial<IAuthorizationDto> {
  allowedConnectorTypes!: AllowedConnectorTypes[];
  disallowedEvseIdPrefixes!: DisallowedEvseIdPrefixes[];
  @Expose({ name: 'IdToken' })
  idToken?: base.IIdTokenDto;

  @Expose({ name: 'IdTokenInfo' })
  idTokenInfo?: base.IIdTokenInfoDto;
}
