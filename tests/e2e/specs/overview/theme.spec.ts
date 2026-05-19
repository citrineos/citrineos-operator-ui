// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { test, expect } from '../../fixtures';
import { OverviewPage } from '../../pages/overview.page';

test.use({ storageState: 'playwright/.auth/admin.json' });

test.setTimeout(90_000);

test.describe('overview › theme', () => {
  test('E2E-017: theme toggle flips html data-theme and persists across reload', async ({
    page,
  }) => {
    const overview = new OverviewPage(page);
    await overview.goto();

    const html = page.locator('html');
    const initialTheme = await html.getAttribute('data-theme');
    const expectedAfterToggle = initialTheme === 'dark' ? 'light' : 'dark';

    await overview.toggleTheme();

    await expect(html).toHaveAttribute('data-theme', expectedAfterToggle);

    await page.reload();
    await overview.expectLoaded();

    await expect(html).toHaveAttribute('data-theme', expectedAfterToggle);

    // Reset to the initial theme so subsequent runs are deterministic.
    await overview.toggleTheme();
    if (initialTheme) {
      await expect(html).toHaveAttribute('data-theme', initialTheme);
    }
  });
});
