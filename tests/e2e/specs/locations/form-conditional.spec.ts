import { test, expect } from '../../fixtures';
import { LocationFormPage } from '../../pages/locations/form.page';
import { blockGoogleMaps } from '../../utils/route-overrides';

test.use({ storageState: 'playwright/.auth/admin.json' });

test.beforeEach(async ({ page }) => {
  await blockGoogleMaps(page);
});

test.describe('locations › form conditional render', () => {
  test('E2E-031: Administrative-area combobox renders with country-specific label', async ({
    page,
  }) => {
    // The country-config.json ships only US + CA; both have
    // administrative areas. The conditional is exercised by checking the
    // label text changes when the operator switches between US
    // (label="State") and CA (label="Province").
    const form = new LocationFormPage(page);
    await form.gotoNew();

    // Default country is US (first entry in all-countries.json) — the
    // State group is visible with its US label.
    await expect(form.fieldGroup('State')).toBeVisible();

    // Switch to Canada → label flips to Province.
    await form.selectCountry('Canada');
    await expect(form.fieldGroup('Province')).toBeVisible({ timeout: 15_000 });

    // Switch back to US → label returns to State.
    await form.selectCountry('United States');
    await expect(form.fieldGroup('State')).toBeVisible({ timeout: 15_000 });
  });
});
