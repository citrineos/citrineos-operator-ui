'use client';

import { useGetIdentity } from '@refinedev/core';
import type { KeycloakUserIdentity } from '@lib/providers/auth-provider/keycloak-auth-provider';
import config from '@lib/utils/config';

export const useTenantId = () => {
  const { data: identity } = useGetIdentity<KeycloakUserIdentity>();
  return Number(identity?.tenantId) || config.tenantId;
};
