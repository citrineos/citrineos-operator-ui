// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { IAuthorizationDto } from '../../../citrineos-core/00_Base/src/interfaces/dto/authorization.dto';
import { AllowedConnectorTypes, DisallowedEvseIdPrefixes } from '@enums';
import { Expose } from 'class-transformer';
import * as idTokenDto from '../../../citrineos-core/00_Base/src/interfaces/dto/id.token.dto';
import * as idTokenInfoDto from '../../../citrineos-core/00_Base/src/interfaces/dto/id.token.info.dto';

export class AuthorizationDto implements Partial<IAuthorizationDto> {
  allowedConnectorTypes!: AllowedConnectorTypes[];
  disallowedEvseIdPrefixes!: DisallowedEvseIdPrefixes[];
  @Expose({ name: 'IdToken' })
  idToken?: idTokenDto.IIdTokenDto;

  @Expose({ name: 'IdTokenInfo' })
  idTokenInfo?: idTokenInfoDto.IIdTokenInfoDto;
}
