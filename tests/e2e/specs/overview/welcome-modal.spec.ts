import { test, expect } from '../../fixtures';
import { OverviewPage } from '../../pages/overview.page';
import { clearWelcomeFlag } from '../../utils/storage';

test.use({ storageState: 'playwright/.auth/admin.json' });

test.describe('overview › welcome modal', () => {
  test('E2E-015: first sign-in shows the welcome modal; dismissal persists across reload', async ({
    page,
  }) => {
    const overview = new OverviewPage(page);

    // Goto first to obtain origin context, then clear localStorage so the modal
    // re-appears as if this were the first visit.
    await page.goto(OverviewPage.path);
    await clearWelcomeFlag(page);
    await page.reload({ waitUntil: 'domcontentloaded', timeout: 60_000 });

    await expect(overview.welcomeDialog).toBeVisible({ timeout: 15_000 });
    await overview.welcomeCloseButton.click();
    await expect(overview.welcomeDialog).toBeHidden();

    await page.reload({ waitUntil: 'domcontentloaded', timeout: 60_000 });
    await overview.expectLoaded();
    await expect(overview.welcomeDialog).toBeHidden();
  });

  test('E2E-016: welcome modal does not reappear when navigating between routes', async ({
    page,
  }) => {
    const overview = new OverviewPage(page);
    await overview.goto();
    await expect(overview.welcomeDialog).toBeHidden();

    await page.goto('/charging-stations');
    await page.waitForURL(/\/charging-stations(\?.*)?$/);

    await overview.goto();
    await expect(overview.welcomeDialog).toBeHidden();
  });
});
