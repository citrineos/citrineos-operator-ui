// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import dotenv from 'dotenv';
import { resolve } from 'node:path';
import { makeApiClient } from '../fixtures/api-client';
import { purgeAllE2eRows } from '../fixtures/seeded-data';
import { stopManagedServer } from '../utils/managed-server';

dotenv.config({ path: resolve(__dirname, '..', '..', '..', '.env.test') });

export default async function globalTeardown(): Promise<void> {
  // Best-effort sweep of any rows left behind by failed teardowns.
  const apiClient = await makeApiClient();
  try {
    await purgeAllE2eRows(apiClient);
    console.info('[e2e:globalTeardown] e2e rows purged.');
  } catch (err) {
    console.warn('[e2e:globalTeardown] purge failed:', err);
  } finally {
    await apiClient.dispose();
  }
  // Stop the production server iff globalSetup spawned one. No-op when
  // an existing server (e.g., `npm run dev`) was reused.
  await stopManagedServer().catch((err) =>
    console.warn('[e2e:globalTeardown] stopManagedServer failed:', err),
  );
}
