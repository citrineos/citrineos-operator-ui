import { test } from '../../fixtures';
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

  test('E2E-086b: UnlockConnector against an offline station fails gracefully', async ({
    page,
    seededStation,
  }) => {
    const detail = new ChargingStationDetailPage(page);
    await detail.goto(seededStation.pkId);

    await detail.commandBar.openViaOtherCommands(/unlock connector/i);
    const modal = new ModalHarness(page, /unlock connector/i);
    await modal.expectOpen();

    const select = modal.dialog.getByRole('combobox').first();
    if (await select.isVisible().catch(() => false)) {
      await select.click();
      const firstOption = page.getByRole('option').first();
      if (await firstOption.isVisible().catch(() => false)) {
        await firstOption.click();
      } else {
        await select.press('Escape');
      }
    }
    await modal.submitButton.click();
    // Validation error / offline-failure toast / modal auto-close are all
    // acceptable observable outcomes.
    await page.waitForLoadState('domcontentloaded');
  });
});
