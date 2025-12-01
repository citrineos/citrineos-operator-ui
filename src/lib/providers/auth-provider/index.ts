// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0
'use client';

import { createGenericAuthProvider } from '@lib/providers/auth-provider/generic-auth-provider';
import { createKeycloakAuthProvider } from '@lib/providers/auth-provider/keycloak-auth-provider';
import config from '@lib/utils/config';

const KEYCLOAK_URL = config.keycloakUrl;
const KEYCLOAK_REALM = config.keycloakRealm;
if (KEYCLOAK_URL && KEYCLOAK_REALM) {
  console.log(
    `Keycloak Auth Provider configured with URL: ${KEYCLOAK_URL} and Realm: ${KEYCLOAK_REALM}`,
  );
} else {
  console.log('Generic Auth Provider configured');
}
export const authProvider =
  KEYCLOAK_URL && KEYCLOAK_REALM
    ? createKeycloakAuthProvider()
    : createGenericAuthProvider();
