// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import type {
  AuthorizationStatusEnumType,
  IdTokenEnumType,
} from '@citrineos/base';

export class LocalListAuthorizationClass {
  id!: number;
  authorizationId?: number | null;
  idToken!: string;
  idTokenType?: IdTokenEnumType | null;
  status!: AuthorizationStatusEnumType | string;
  cacheExpiryDateTime?: string | null;
  groupAuthorizationId?: number | null;
  chargingPriority?: number | null;
  language1?: string | null;
  language2?: string | null;
  allowedConnectorTypes?: string[];
  disallowedEvseIdPrefixes?: string[];
  groupAuthorization?: { id: number; idToken: string } | null;
}

export class LocalListVersionClass {
  id!: number;
  stationId!: string;
  versionNumber!: number;
  createdAt?: string;
  updatedAt?: string;
  LocalListAuthorizations?: LocalListAuthorizationClass[];
}
