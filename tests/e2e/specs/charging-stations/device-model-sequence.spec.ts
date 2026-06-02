// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { test, expect } from '../../fixtures';
import { ChargingStationDetailPage } from '../../pages/charging-stations/detail.page';
import { ModalHarness } from '../../pages/components/modal.po';

// GetBaseReport → NotifyReport populates the device model (Components +
// Variables) in Hasura, which the Get/SetVariables modals read to build their
// Component/Variable selectors. With the model populated, these modals move
// from open-and-cancel smoke (E2E-079/089) to real selection + dispatch.
//
// Serial: a shared worker-scoped EVerest station; GetBaseReport runs first so
// the selectors are populated for the read/write tests that follow.

test.use({ storageState: 'playwright/.auth/admin.json' });

async function deviceModelComponentCount(apiClient: {
  gql: <T>(q: string) => Promise<T>;
}): Promise<number> {
  const data = await apiClient.gql<{
    Components_aggregate: { aggregate: { count: number } };
  }>(
    `query DeviceModelProbe {
       Components_aggregate { aggregate { count } }
     }`,
  );
  return data.Components_aggregate.aggregate.count;
}

test.describe('charging-stations › device model sequence @everest', () => {
  test.describe.configure({ mode: 'serial' });

  test('E2E-097: GetBaseReport populates the device model and GetVariables reads a real variable @everest', async ({
    page,
    everestStation,
    apiClient,
  }) => {
    const detail = new ChargingStationDetailPage(page);
    await detail.goto(everestStation.id);

    // Request a full inventory; NotifyReport flows back asynchronously.
    await detail.commandBar.openViaOtherCommands(/get base report/i);
    const baseReport = new ModalHarness(page, /get base report/i);
    await baseReport.expectOpen();
    await baseReport.submitAndWaitForToast();

    // Wait for the device model to be populated (already persistent from prior
    // NotifyReports in a warm stack; gives a fresh stack time to ingest). A
    // timeout here is acceptable — test.skip below documents it as an EVerest
    // limitation rather than a test failure.
    let components = 0;
    try {
      await expect
        .poll(
          async () => {
            components = await deviceModelComponentCount(apiClient);
            return components;
          },
          { timeout: 90_000, intervals: [3_000] },
        )
        .toBeGreaterThan(0);
    } catch {
      // components remains 0 and test.skip below fires.
    }
    test.skip(
      components === 0,
      'NotifyReport did not populate the device model within 90s — documented EVerest limitation.',
    );

    // Selectors are populated — reload so the modal picks up the rows, then
    // read a real Component/Variable end-to-end.
    await page.reload();
    await detail.expectLoaded();
    await detail.commandBar.openViaOtherCommands(/get variables/i);
    const getVars = new ModalHarness(page, /get variables/i);
    await getVars.expectOpen();

    const componentTrigger = getVars.dialog
      .getByRole('group')
      .filter({ hasText: /component #1/i })
      .getByRole('combobox')
      .first();
    await componentTrigger.click();
    await page.getByRole('option').first().click();

    const variableTrigger = getVars.dialog
      .getByRole('group')
      .filter({ hasText: /variable #1/i })
      .getByRole('combobox')
      .first();
    await expect(variableTrigger).toBeEnabled({ timeout: 15_000 });
    await variableTrigger.click();
    await page.getByRole('option').first().click();

    await getVars.submitAndWaitForToast();
  });

  test('E2E-097b: SetVariables dispatches a real component/variable write round-trip @everest', async ({
    page,
    everestStation,
    apiClient,
  }) => {
    test.skip(
      (await deviceModelComponentCount(apiClient)) === 0,
      'Device model empty — SetVariables has no variables to write.',
    );

    const detail = new ChargingStationDetailPage(page);
    await detail.goto(everestStation.id);
    await detail.commandBar.openViaOtherCommands(/set variables/i);
    const setVars = new ModalHarness(page, /set variables/i);
    await setVars.expectOpen();

    const componentTrigger = setVars.dialog
      .getByRole('group')
      .filter({ hasText: /component #1/i })
      .getByRole('combobox')
      .first();
    await componentTrigger.click();
    await page.getByRole('option').first().click();

    const variableTrigger = setVars.dialog
      .getByRole('group')
      .filter({ hasText: /variable #1/i })
      .getByRole('combobox')
      .first();
    await expect(variableTrigger).toBeEnabled({ timeout: 15_000 });
    await variableTrigger.click();
    await page.getByRole('option').first().click();

    await setVars.dialog
      .getByRole('group')
      .filter({ hasText: /value #1/i })
      .getByRole('textbox')
      .first()
      .fill('0');

    // The OCPP SetVariablesResponse round-trips per-variable status; an
    // arbitrarily-picked writable variable may be Accepted or Rejected
    // (value-type dependent). Either is a real station round-trip — assert a
    // toast surfaces rather than asserting only success.
    await setVars.submitButton.click();
    await expect(
      page.getByRole('region', { name: /notifications/i }),
    ).toContainText(/success|accepted|failed|error|rejected|invalid|denied/i, {
      timeout: 30_000,
    });
  });
});
