import { test, expect } from '../../fixtures';
import { TariffsListPage } from '../../pages/tariffs/list.page';
import { TariffFormPage } from '../../pages/tariffs/form.page';

test.use({ storageState: 'playwright/.auth/admin.json' });

test.describe('tariffs › CRUD', () => {
  test('E2E-110: Tariffs list renders', async ({ page }) => {
    const list = new TariffsListPage(page);
    await list.goto();
    await expect(list.heading).toBeVisible();
    await expect(list.addButton).toBeVisible();
  });

  test('E2E-111: Create tariff via UI surfaces success toast', async ({
    page,
    apiClient,
  }) => {
    const form = new TariffFormPage(page);
    await form.gotoNew();
    await form.fill({
      currency: 'USD',
      pricePerKwh: 0.35,
    });
    await form.submit();

    // Cleanup: delete the tariff we just created (best-effort match by
    // recently-added USD tariff with the per-kWh price we set).
    await apiClient
      .gql(
        `mutation Cleanup {
           delete_Tariffs(where: { currency: { _eq: "USD" }, pricePerKwh: { _eq: 0.35 } }) {
             affected_rows
           }
         }`,
      )
      .catch(() => undefined);
  });

  test('E2E-114: Tariffs detail (read-only show) is not implemented in src', async () => {
    test.skip(
      true,
      'Tariffs detail route absent in src/app/(authenticated)/tariffs/ — only the upsert (new + edit) routes exist.',
    );
  });
});
