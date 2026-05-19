import { test, expect } from '../../fixtures';
import { ChargingStationDetailPage } from '../../pages/charging-stations/detail.page';
import { ModalHarness } from '../../pages/components/modal.po';

test.use({ storageState: 'playwright/.auth/admin.json' });

test.describe('charging-stations › admin toggles', () => {
  test('E2E-055: ToggleStationOnline modal opens via OtherCommands dispatcher', async () => {
    test.skip(
      true,
      "ToggleStationOnline is exercised by parametric harness E2E-MOD-PARAM-001 ('ToggleStationOnlineModal opens and closes'). The OtherCommands dispatcher in detail-card surfaces it inconsistently across builds (label/icon-only variations).",
    );
  });

  test('E2E-056: ForceDisconnect button visible on detail @everest', async ({
    page,
    everestStation,
  }) => {
    const detail = new ChargingStationDetailPage(page);
    await detail.goto(everestStation.pkId);
    // ForceDisconnect is rendered as a primary command-bar button.
    await expect(detail.commandBar.forceDisconnectButton).toBeVisible({
      timeout: 30_000,
    });
  });
});
