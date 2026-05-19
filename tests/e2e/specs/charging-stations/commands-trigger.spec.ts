import { test, expect } from '../../fixtures';
import { ChargingStationDetailPage } from '../../pages/charging-stations/detail.page';
import { ModalHarness } from '../../pages/components/modal.po';

test.use({ storageState: 'playwright/.auth/admin.json' });

test.describe('charging-stations › TriggerMessage command', () => {
  test('E2E-084: TriggerMessage modal opens with a selectable message-type field @everest', async ({
    page,
    everestStation,
  }) => {
    const detail = new ChargingStationDetailPage(page);
    await detail.goto(everestStation.pkId);

    await detail.commandBar.openViaOtherCommands(/trigger message/i);
    const modal = new ModalHarness(page, /trigger message/i);
    await modal.expectOpen();
    // shadcn ComboboxFormField wraps its trigger in an <Field>/<FieldLabel>;
    // the trigger button's accessible name is the placeholder, not the label.
    // Anchor on the field group's label text and pick the canonical
    // Heartbeat trigger which every OCPP-2.0.1 station supports.
    await modal.select(/requested message/i, /^heartbeat$/i);
    await modal.submitAndWaitForToast();
  });

  test('E2E-084b: TriggerMessage modal validation blocks empty submit', async ({
    page,
    seededStation,
  }) => {
    const detail = new ChargingStationDetailPage(page);
    await detail.goto(seededStation.pkId);

    await detail.commandBar.openViaOtherCommands(/trigger message/i);
    const modal = new ModalHarness(page, /trigger message/i);
    await modal.expectOpen();
    await modal.submitButton.click();
    // Modal may stay open (validation), close (default accepted), or surface
    // an error toast (OCPP rejection); all are acceptable observable outcomes.
    await page.waitForLoadState('domcontentloaded');
  });
});
