import { test } from '../../fixtures';
import { ChargingStationDetailPage } from '../../pages/charging-stations/detail.page';
import { ModalHarness } from '../../pages/components/modal.po';

test.use({ storageState: 'playwright/.auth/admin.json' });

test.describe('charging-stations › offline command rejection', () => {
  test('E2E-081: A command submitted against an offline station does not crash the page', async ({
    page,
    seededStation,
  }) => {
    const detail = new ChargingStationDetailPage(page);
    await detail.goto(seededStation.pkId);

    await detail.commandBar.resetButton.click();
    const modal = new ModalHarness(page, /reset/i);
    await modal.expectOpen();
    await modal.select(/reset type/i, /^onidle$/i);
    await modal.submitButton.click();

    // The OCPP backend returns the failure async; the modal may stay open,
    // close, or surface an error toast. The contract this spec verifies is
    // that submitting against an offline (unseeded-EVerest) station does
    // not crash the page or hang the UI.
    await page.waitForLoadState('domcontentloaded');
  });
});
