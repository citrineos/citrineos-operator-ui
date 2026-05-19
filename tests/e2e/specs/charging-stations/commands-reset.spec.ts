// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { test, expect } from '../../fixtures';
import { ChargingStationDetailPage } from '../../pages/charging-stations/detail.page';
import { ModalHarness } from '../../pages/components/modal.po';

test.use({ storageState: 'playwright/.auth/admin.json' });

test.describe('charging-stations › Reset command @everest', () => {
  test('E2E-070: Reset Hard happy path against EVerest station', async ({
    page,
    everestStation,
  }) => {
    const detail = new ChargingStationDetailPage(page);
    await detail.goto(everestStation.pkId);

    await detail.commandBar.resetButton.click();
    const modal = new ModalHarness(page, /reset/i);
    await modal.expectOpen();
    await modal.select(/reset type/i, /^immediate$/i);
    await modal.submitAndWaitForToast();
  });

  test('E2E-071: Reset OnIdle variant against EVerest station', async ({
    page,
    everestStation,
  }) => {
    const detail = new ChargingStationDetailPage(page);
    await detail.goto(everestStation.pkId);

    await detail.commandBar.resetButton.click();
    const modal = new ModalHarness(page, /reset/i);
    await modal.expectOpen();
    await modal.select(/reset type/i, /^onidle$/i);
    await modal.submitAndWaitForToast();
  });
});

test.describe('charging-stations › Reset validation + offline', () => {
  test('E2E-072: Reset modal blocks submit when type is unselected', async ({
    page,
    seededStation,
  }) => {
    const detail = new ChargingStationDetailPage(page);
    await detail.goto(seededStation.pkId);

    await detail.commandBar.resetButton.click();
    const modal = new ModalHarness(page, /reset/i);
    await modal.expectOpen();

    await modal.submitButton.click();
    // Reset type is required; the form blocks dispatch and keeps the modal
    // mounted so the operator can pick a value.
    await expect(modal.dialog).toBeVisible({ timeout: 5_000 });
  });

  test('E2E-073: Reset against an offline (unseeded-EVerest) station fails gracefully', async ({
    page,
    seededStation,
  }) => {
    const detail = new ChargingStationDetailPage(page);
    await detail.goto(seededStation.pkId);

    await detail.commandBar.resetButton.click();
    const modal = new ModalHarness(page, /reset/i);
    await modal.expectOpen();
    await modal.select(/reset type/i, /^onidle$/i);

    // Without an active OCPP session, the command pipeline returns a failure.
    // The modal stays open and an error toast appears.
    await modal.submitExpectingError();
  });
});
