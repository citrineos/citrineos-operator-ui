// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0
'use client';

import { createGenericAuthProvider } from '@lib/providers/auth-provider/generic-auth-provider';
import { createKeycloakAuthProvider } from '@lib/providers/auth-provider/keycloak-auth-provider';
import config from '@lib/utils/config';

if (config.authProvider === 'keycloak') {
  console.log(`Keycloak Auth Provider configured`);
} else {
  console.log('Generic Auth Provider configured');
}

export const authProvider =
  config.authProvider === 'keycloak'
    ? createKeycloakAuthProvider()
    : createGenericAuthProvider();
