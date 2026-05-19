// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { test as base } from '@playwright/test';
import { makeApiClient, type ApiClient } from './api-client';
import {
  deleteAuthorization,
  deleteLocation,
  deleteStation,
  deleteTransaction,
  seedAuthorization,
  seedLocation,
  seedStation,
  seedTransaction,
  type SeededAuthorization,
  type SeededLocation,
  type SeededStation,
  type SeededTransaction,
} from './seeded-data';
import { startEverest, type EverestHandle } from './everest';

interface E2EFixtures {
  apiClient: ApiClient;
  seededLocation: SeededLocation;
  seededStation: SeededStation;
  seededTransaction: SeededTransaction;
  seededAuthorization: SeededAuthorization;
  everestStation: EverestHandle;
}

export const test = base.extend<E2EFixtures>({
  apiClient: async ({}, use) => {
    const client = await makeApiClient();
    await use(client);
    await client.dispose();
  },

  seededLocation: async ({ apiClient }, use) => {
    const location = await seedLocation(apiClient);
    await use(location);
    await deleteLocation(apiClient, location.id).catch(() => undefined);
  },

  seededStation: async ({ apiClient, seededLocation }, use) => {
    const station = await seedStation(apiClient, seededLocation.id);
    await use(station);
    await deleteStation(apiClient, station.pkId).catch(() => undefined);
  },

  seededTransaction: async ({ apiClient, seededStation }, use) => {
    const transaction = await seedTransaction(apiClient, seededStation.id);
    await use(transaction);
    await deleteTransaction(apiClient, transaction.transactionId).catch(
      () => undefined,
    );
  },

  seededAuthorization: async ({ apiClient }, use) => {
    const authorization = await seedAuthorization(apiClient);
    await use(authorization);
    await deleteAuthorization(apiClient, authorization.id).catch(
      () => undefined,
    );
  },

  // EVerest is expensive: docker-compose up of multiple containers, then a
  // 60–90s wait for the OCPP BootNotification to flow into Hasura. Specs
  // that need a real OCPP responder request this fixture; specs that test
  // offline / validation paths use seededStation instead.
  everestStation: async ({}, use) => {
    const handle = await startEverest();
    await use(handle);
    await handle.stop();
  },
});

export { expect } from '@playwright/test';
