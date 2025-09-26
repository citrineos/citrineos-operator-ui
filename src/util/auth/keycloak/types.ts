// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { User } from '../types';

export enum KeycloakRole {
  ADMIN = 'admin',
  USER = 'user',
}

/**
 * Extended user identity with Keycloak-specific fields
 */
export interface KeycloakUserIdentity extends User {
  tenantId?: string;
  avatar?: string;
}

export interface KeycloakPermissions {
  roles: KeycloakRole[];
  tenants?: string[];
  resources?: Record<string, string[]>;
}
