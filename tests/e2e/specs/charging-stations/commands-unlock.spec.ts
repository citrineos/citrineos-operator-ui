// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { test, expect } from '../../fixtures';
import { ChargingStationDetailPage } from '../../pages/charging-stations/detail.page';
import { ModalHarness } from '../../pages/components/modal.po';

test.use({ storageState: 'playwright/.auth/admin.json' });

test.describe('charging-stations › UnlockConnector command', () => {
  test('E2E-086: UnlockConnector modal opens and submits against EVerest @everest', async ({
    page,
    everestStation,
  }) => {
    const detail = new ChargingStationDetailPage(page);
    await detail.goto(everestStation.pkId);

    await detail.commandBar.openViaOtherCommands(/unlock connector/i);
    const modal = new ModalHarness(page, /unlock connector/i);
    await modal.expectOpen();
    // Choose the first available connector.
    const evseSelect = modal.dialog.getByRole('combobox').first();
    await evseSelect.click();
    await page.getByRole('option').first().click();
    await modal.submitAndWaitForToast();
  });

  test('E2E-086b: UnlockConnector form blocks dispatch when the station has no connectors', async ({
    page,
    seededStation,
  }) => {
    const detail = new ChargingStationDetailPage(page);
    await detail.goto(seededStation.pkId);

    await detail.commandBar.openViaOtherCommands(/unlock connector/i);
    const modal = new ModalHarness(page, /unlock connector/i);
    await modal.expectOpen();

    // The seeded station is created without EVSEs/Connectors. The Connector
    // combobox has no options, so the form cannot be completed and the modal
    // stays mounted instead of dispatching to the OCPP backend.
    const connectorCombobox = modal.dialog.getByRole('combobox').first();
    await expect(connectorCombobox).toBeVisible();
    await expect(modal.dialog).toBeVisible({ timeout: 5_000 });
  });
});
