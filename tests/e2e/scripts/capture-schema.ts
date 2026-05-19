// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import dotenv from 'dotenv';
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { makeApiClient } from '../fixtures/api-client';
import { captureHasuraIntrospection } from '../utils/schema-drift';

// Regenerates tests/e2e/data/schema-snapshot.json from the running Hasura.
// Run when an intentional upstream schema change (renamed operation, new
// tracked table, dropped column) needs to land — globalSetup's schema-drift
// guard will block tests until the snapshot matches the new shape.
//
// Usage:
//   npx tsx tests/e2e/scripts/capture-schema.ts
//
// Requires .env.test to be populated; Hasura must be reachable at HASURA_URL.

dotenv.config({ path: resolve(__dirname, '..', '..', '..', '.env.test') });

const OUTPUT_PATH = resolve(__dirname, '..', 'data', 'schema-snapshot.json');

async function main(): Promise<void> {
  const apiClient = await makeApiClient();
  try {
    const snapshot = await captureHasuraIntrospection(apiClient);
    writeFileSync(
      OUTPUT_PATH,
      JSON.stringify(snapshot, null, 2) + '\n',
      'utf8',
    );
    console.info(
      `[capture-schema] wrote ${snapshot.operations.length} operations + ${Object.keys(snapshot.columnsByType).length} tables to ${OUTPUT_PATH}`,
    );
  } finally {
    await apiClient.dispose();
  }
}

main().catch((err) => {
  console.error('[capture-schema] failed:', err);
  process.exit(1);
});
