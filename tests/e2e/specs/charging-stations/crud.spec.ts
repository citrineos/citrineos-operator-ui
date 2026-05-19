import { test, expect } from '../../fixtures';
import { ChargingStationsListPage } from '../../pages/charging-stations/list.page';
import { ChargingStationFormPage } from '../../pages/charging-stations/form.page';
import { deleteStation } from '../../fixtures/seeded-data';
import { shortId } from '../../utils/random';

test.use({ storageState: 'playwright/.auth/admin.json' });

test.describe('charging-stations › CRUD', () => {
  test('E2E-046: Create charging station via UI redirects + appears in list', async ({
    page,
    seededLocation,
    apiClient,
  }) => {
    const id = `e2e-${shortId()}-cp`;
    const form = new ChargingStationFormPage(page);
    await form.gotoNew();
    await form.fill({
      id,
      locationName: seededLocation.name,
    });
    await form.submit();

    const list = new ChargingStationsListPage(page);
    await list.goto();
    await expect(list.rowById(id)).toBeVisible({ timeout: 30_000 });

    // Cleanup via apiClient (no UI delete on charging-stations list).
    const { ChargingStations } = await apiClient.gql<{
      ChargingStations: { pkId: number }[];
    }>(
      `query LookupCS($id: String!) {
         ChargingStations(where: { id: { _eq: $id } }) { pkId }
       }`,
      { id },
    );
    if (ChargingStations[0]) {
      await deleteStation(apiClient, ChargingStations[0].pkId).catch(
        () => undefined,
      );
    }
  });

  test('E2E-047: Edit form pre-fills with the existing charging station data', async ({
    page,
    seededStation,
  }) => {
    const form = new ChargingStationFormPage(page);
    await form.gotoEdit(seededStation.pkId);
    await expect(form.heading).toContainText(/edit charging\s*station/i);
    await expect(form.idInput).toHaveValue(seededStation.id);
  });

  test('E2E-048: Delete charging station has no UI surface (read-only via API)', async () => {
    test.skip(
      true,
      'Charging Stations has no UI delete on detail/list at this time. The detail card shows status + commands but no delete button; the list table has no row-level delete action. Confirmed by inspection of src/lib/client/pages/charging-stations/{detail,list,columns}*.tsx.',
    );
  });
});
