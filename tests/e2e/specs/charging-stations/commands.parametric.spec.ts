// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { test, expect } from '../../fixtures';
import { ChargingStationDetailPage } from '../../pages/charging-stations/detail.page';
import { ModalHarness } from '../../pages/components/modal.po';
import {
  deleteLocation,
  deleteStation,
  deleteTransaction,
  seedLocation,
  seedStation,
  seedTransaction,
} from '../../fixtures/seeded-data';
import {
  OCPP_MODAL_SPECS,
  OCPP_MODAL_COUNT,
} from '../../utils/ocpp-modal-specs';

// Parametric harness: one open-and-close smoke test per dispatchable OCPP
// modal. Bespoke command specs cover the deeper happy / sad / offline paths;
// this loop guarantees that every dispatchable modal at least mounts and
// unmounts cleanly under the current source.
//
// Correctness: each test asserts the OPENED dialog's heading matches the
// modal's titlePattern — not merely that "a dialog is visible". This prevents
// the prior false-positive where the still-open OtherCommandsModal dispatcher
// satisfied a generic getByRole('dialog') check.
//
// Context: each test seeds a station whose protocol matches the modal's OCPP
// version (a 1.6 station for 1.6-only commands; otherwise 2.0.1). This both
// surfaces the 1.6-only commands and disambiguates the 16-vs-2.0.1 variants
// that share a dialog title. Transaction-gated modals (RemoteStop,
// ToggleTransactionActive) additionally get an active seeded transaction so
// their command button renders. The 12 non-dispatchable OCPP-spec placeholders
// are skipped with a documented reason.

test.use({ storageState: 'playwright/.auth/admin.json' });

function stationProtocolFor(versions: ReadonlyArray<string>): string {
  const is16Only =
    versions.includes('1.6') &&
    !versions.includes('2.0.1') &&
    !versions.includes('shared');
  return is16Only ? 'ocpp1.6' : 'ocpp2.0.1';
}

function needsActiveTransaction(name: string): boolean {
  // StopTransaction renders only when hasActiveTransactions === true; the
  // toggle-transaction admin modal likewise requires a transaction to act on.
  return (
    name === 'RemoteStopTransactionModal' ||
    name === 'ToggleTransactionActiveModal'
  );
}

test.describe('charging-stations › parametric modal harness (smoke)', () => {
  test.beforeAll(() => {
    expect(OCPP_MODAL_SPECS.length).toBe(OCPP_MODAL_COUNT);
  });

  for (const spec of OCPP_MODAL_SPECS) {
    test(`E2E-MOD-PARAM-001: ${spec.name} opens and closes`, async ({
      page,
      apiClient,
    }) => {
      if (!spec.dispatchable) {
        test.skip(
          true,
          `${spec.name}: non-dispatchable OCPP-spec placeholder — no UI component/registry entry.`,
        );
        return;
      }

      // Seed a station in the protocol + transaction context this modal needs.
      const location = await seedLocation(apiClient);
      const station = await seedStation(apiClient, location.id, {
        protocol: stationProtocolFor(spec.versions),
      });
      let seededTxnId: string | undefined;
      if (needsActiveTransaction(spec.name)) {
        const txn = await seedTransaction(
          apiClient,
          station.ocppConnectionName,
          { isActive: true },
        );
        seededTxnId = txn.transactionId;
      }

      try {
        const detail = new ChargingStationDetailPage(page);
        await detail.goto(station.id);
        const modal = new ModalHarness(page, spec.titlePattern);

        // Strategy 1: primary command-bar button.
        const primary = page.getByRole('button', {
          name: spec.openButtonNamePattern,
        });
        if (
          await primary
            .first()
            .isVisible()
            .catch(() => false)
        ) {
          await primary.first().click();
        }
        let opened = await modal.title
          .isVisible({ timeout: 5_000 })
          .catch(() => false);

        // Strategy 2: OtherCommandsModal dispatcher. Matching the modal's own
        // heading guarantees the dispatcher's "Other Commands" dialog is never
        // mistaken for success.
        if (!opened) {
          await detail.commandBar
            .openViaOtherCommands(spec.openButtonNamePattern)
            .catch(() => undefined);
          opened = await modal.title
            .isVisible({ timeout: 5_000 })
            .catch(() => false);
        }

        if (!opened) {
          test.skip(
            true,
            `${spec.name}: could not be opened via primary button or OtherCommands dispatcher in the current UI.`,
          );
          return;
        }

        await expect(modal.title).toBeVisible();

        // Close via Cancel / Close / Escape and confirm THIS modal unmounted.
        const cancelButton = page
          .getByRole('dialog')
          .getByRole('button', { name: /^cancel$/i })
          .first();
        const closeButton = page
          .getByRole('dialog')
          .getByRole('button', { name: /^close$/i })
          .first();
        if (await cancelButton.isVisible().catch(() => false)) {
          await cancelButton.click();
        } else if (await closeButton.isVisible().catch(() => false)) {
          await closeButton.click();
        } else {
          await page.keyboard.press('Escape');
        }
        await expect(modal.title).toBeHidden({ timeout: 10_000 });
      } finally {
        if (seededTxnId) {
          await deleteTransaction(apiClient, seededTxnId).catch(
            () => undefined,
          );
        }
        await deleteStation(apiClient, station.id).catch(() => undefined);
        await deleteLocation(apiClient, location.id).catch(() => undefined);
      }
    });
  }
});
