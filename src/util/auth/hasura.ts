// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

export enum HasuraRole {
  ADMIN = 'admin',
  USER = 'user',
}

export enum HasuraClaimType {
  X_HARSURA_DEFAULT_ROLE = 'x-hasura-default-role',
  X_HARSURA_TENANT_ID = 'x-hasura-tenant-id',
  X_HARSURA_ALLOWED_ROLES = 'x-hasura-allowed-roles',
}

export enum HasuraHeader {
  X_AUTH_TOKEN = 'x-auth-token',
  X_HASURA_ROLE = 'x-hasura-role',
  X_HASURA_TENANT_ID = 'x-hasura-tenant-id',
}
