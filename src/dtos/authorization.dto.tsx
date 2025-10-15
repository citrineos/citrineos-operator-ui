// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import {
  IAuthorizationDto,
  AdditionalInfo,
  AuthorizationStatusType,
  IdTokenType,
  AuthorizationWhitelistType,
  ITenantPartnerDto,
} from '@citrineos/base';

export class AuthorizationDto implements Partial<IAuthorizationDto> {
  id?: number;
  allowedConnectorTypes?: string[];
  disallowedEvseIdPrefixes?: string[];
  idToken!: string;
  idTokenType?: IdTokenType | null;
  additionalInfo?: [AdditionalInfo, ...AdditionalInfo[]] | null;
  status!: AuthorizationStatusType;
  cacheExpiryDateTime?: string | null;
  chargingPriority?: number | null;
  language1?: string | null;
  language2?: string | null;
  personalMessage?: any | null;
  groupAuthorizationId?: number | null;
  groupAuthorization?: IAuthorizationDto;
  concurrentTransaction?: boolean;
  realTimeAuth?: AuthorizationWhitelistType;
  realTimeAuthUrl?: string;
  tenantPartner?: ITenantPartnerDto;
}
