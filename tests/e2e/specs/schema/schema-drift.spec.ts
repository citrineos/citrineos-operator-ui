import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { test, expect } from '../../fixtures';
import {
  captureHasuraIntrospection,
  validateSchemaDrift,
  type SchemaSnapshot,
} from '../../utils/schema-drift';

// Schema-drift guard proof. The actual guard runs in
// tests/e2e/auth/global-setup.ts before any test executes; this spec
// asserts the guard's *function* — that validateSchemaDrift detects a
// rename and that the live Hasura schema still matches our snapshot.
//
// We deliberately do NOT mutate the on-disk snapshot — that would race
// the parallel runs and could corrupt the baseline. Instead we mutate
// an in-memory copy.

test.use({ storageState: 'playwright/.auth/admin.json' });

test.describe('schema › drift guard', () => {
  test('E2E-SCHEMA-DRIFT-001: validateSchemaDrift rejects a deliberate operation rename', async ({
    apiClient,
  }) => {
    const snapshotPath = resolve(
      __dirname,
      '..',
      '..',
      'data',
      'schema-snapshot.json',
    );
    const baseline = JSON.parse(
      readFileSync(snapshotPath, 'utf-8'),
    ) as SchemaSnapshot;

    const current = await captureHasuraIntrospection(apiClient);

    // (a) live schema currently matches the on-disk baseline — sanity check.
    const liveReport = validateSchemaDrift(current, baseline);
    expect(liveReport.valid, JSON.stringify(liveReport, null, 2)).toBe(true);

    // (b) deliberate in-memory mutation: drop a tracked operation.
    const trackedOp = baseline.operations.find((op) =>
      op.startsWith('ChargingStations'),
    );
    expect(trackedOp).toBeDefined();
    const mutatedBaseline: SchemaSnapshot = {
      ...baseline,
      operations: [...baseline.operations, '__pretend_renamed_op__'],
    };

    // (c) validate against the mutated baseline — the guard must report drift.
    const driftReport = validateSchemaDrift(current, mutatedBaseline);
    expect(driftReport.valid).toBe(false);
    expect(driftReport.missingOperations).toContain('__pretend_renamed_op__');
  });

  test('E2E-SCHEMA-DRIFT-002: validateSchemaDrift detects a missing tracked column', async ({
    apiClient,
  }) => {
    const snapshotPath = resolve(
      __dirname,
      '..',
      '..',
      'data',
      'schema-snapshot.json',
    );
    const baseline = JSON.parse(
      readFileSync(snapshotPath, 'utf-8'),
    ) as SchemaSnapshot;

    const current = await captureHasuraIntrospection(apiClient);

    const mutatedBaseline: SchemaSnapshot = {
      operations: baseline.operations,
      columnsByType: {
        ...baseline.columnsByType,
        ChargingStations: [
          ...(baseline.columnsByType['ChargingStations'] ?? []),
          '__pretend_added_col__',
        ],
      },
    };

    const report = validateSchemaDrift(current, mutatedBaseline);
    expect(report.valid).toBe(false);
    expect(
      report.missingColumns.some(
        (c) =>
          c.type === 'ChargingStations' && c.column === '__pretend_added_col__',
      ),
    ).toBe(true);
  });
});
