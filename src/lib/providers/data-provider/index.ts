// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0
'use client';

import { authProvider } from '@lib/providers/auth-provider';
import { ResourceType } from '@lib/utils/access.types';
import config from '@lib/utils/config';
import { HasuraHeader } from '@lib/utils/hasura.types';
import dataProviderHasura, {
  GraphQLClient,
  type HasuraDataProviderOptions,
} from '@refinedev/hasura';
import { getHasuraAdminSecretAction } from '@lib/server/actions/getHasuraAdminSecretAction';

const requestMiddleware = async (request: any) => {
  const requestHeaders = {
    ...request.headers,
  };

  const hasuraAdminSecret = await getHasuraAdminSecretAction().then((result) =>
    result.success ? result.data : '',
  );

  if (hasuraAdminSecret) {
    console.debug('Authorizing to Hasura via Hasura Admin Secret');
    requestHeaders[HasuraHeader.X_HASURA_ADMIN_SECRET] = hasuraAdminSecret;
  } else if (authProvider) {
    console.debug('Authorizing to Hasura via configured Auth Provider');
    const token = await authProvider.getToken();
    if (token) {
      requestHeaders['Authorization'] = 'Bearer ' + token;
    }
    const hasuraHeaders = await authProvider.getHasuraHeaders();
    if (hasuraHeaders) {
      const hasuraRole = hasuraHeaders.get(HasuraHeader.X_HASURA_ROLE);
      if (hasuraRole) {
        requestHeaders[HasuraHeader.X_HASURA_ROLE] = hasuraRole;
      }
    }
  }
  return {
    ...request,
    headers: requestHeaders,
  };
};

const API_URL = config.apiUrl;

const client = new GraphQLClient(API_URL, {
  requestMiddleware,
});

const hasuraProviderOptions = {
  idType: (resource: string) => {
    if (resource === ResourceType.CHARGING_STATIONS) return 'String';
    return 'Int';
  },
  namingConvention: 'hasura-default',
};

const baseDataProvider = dataProviderHasura(
  client,
  hasuraProviderOptions as HasuraDataProviderOptions,
);

// Bridge: ChargingStations are identified in the UI by `ocppConnectionName`
// (the stable OCPP string id, e.g. "cp001"), not by the numeric primary key.
// Hasura's `_by_pk` is bound to the numeric PK, so single-record reads/writes
// for this resource are translated to `where: { ocppConnectionName: { _eq } }`
// filters. This keeps the app working regardless of whether the underlying id
// is a string or a number. The corresponding queries/mutations return the
// resource keyed by `id: ocppConnectionName`, so `id` carries the string.
const isChargingStations = (resource?: string) =>
  resource === ResourceType.CHARGING_STATIONS;

const dataProvider: typeof baseDataProvider = {
  ...baseDataProvider,
  getOne: async (params) => {
    if (isChargingStations(params.resource) && params.meta?.gqlQuery) {
      const variables = { id: params.id, ...(params.meta.gqlVariables ?? {}) };
      const response: any = await client.request(
        params.meta.gqlQuery,
        variables,
      );
      const rows = response?.ChargingStations ?? [];
      return { data: rows[0] ?? null };
    }
    return baseDataProvider.getOne(params);
  },
  update: async (params) => {
    const mutation = params.meta?.gqlMutation ?? params.meta?.gqlQuery;
    if (isChargingStations(params.resource) && mutation) {
      const variables = {
        id: params.id,
        object: params.variables ?? {},
        ...(params.meta?.gqlVariables ?? {}),
      };
      const response: any = await client.request(mutation, variables);
      const returning = response?.update_ChargingStations?.returning ?? [];
      return { data: returning[0] ?? null };
    }
    return baseDataProvider.update(params);
  },
  deleteOne: async (params) => {
    const mutation = params.meta?.gqlMutation ?? params.meta?.gqlQuery;
    if (isChargingStations(params.resource) && mutation) {
      const variables = {
        id: params.id,
        ...(params.meta?.gqlVariables ?? {}),
      };
      const response: any = await client.request(mutation, variables);
      const returning = response?.delete_ChargingStations?.returning ?? [];
      return { data: returning[0] ?? null };
    }
    return baseDataProvider.deleteOne(params);
  },
};

dataProvider.getApiUrl = () => {
  return API_URL;
};

export default dataProvider;
