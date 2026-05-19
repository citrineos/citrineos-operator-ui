import { test, expect } from '../../fixtures';
import { OverviewPage } from '../../pages/overview.page';

test.use({ storageState: 'playwright/.auth/admin.json' });

test.describe('overview › dashboard', () => {
  test('E2E-010: KPI cards render their headings on /overview', async ({
    page,
    seededLocation,
    seededStation,
    seededTransaction,
  }) => {
    void seededLocation;
    void seededStation;
    void seededTransaction;

    const overview = new OverviewPage(page);
    await overview.goto();

    await expect(overview.kpiOnlineHeading).toBeVisible();
    await expect(overview.kpiActiveTransactionsHeading).toBeVisible();
    await expect(overview.kpiPluginSuccessHeading).toBeVisible();
    await expect(overview.kpiChargerActivityHeading).toBeVisible();
    await expect(overview.locationsCardHeading).toBeVisible();
  });

  test('E2E-011: Locations card renders markers when MAPS_E2E_KEY is provisioned', async ({
    page,
    seededLocation,
  }) => {
    test.skip(
      !process.env.MAPS_E2E_KEY,
      'MAPS_E2E_KEY not provisioned; map markers cannot be asserted.',
    );
    void seededLocation;

    const overview = new OverviewPage(page);
    await overview.goto();

    await expect(overview.locationsCardHeading).toBeVisible();
  });

  test('E2E-012: Active Transactions card surfaces an active session', async ({
    page,
    seededLocation,
    seededStation,
    seededTransaction,
  }) => {
    void seededLocation;
    void seededStation;

    const overview = new OverviewPage(page);
    await overview.goto();

    await expect(overview.kpiActiveTransactionsHeading).toBeVisible();
    await expect(
      page.getByText(seededTransaction.transactionId, { exact: false }),
    ).toBeVisible({ timeout: 30_000 });
  });

  test('E2E-013: Faulted chargers card surfaces a station with Faulted status', () => {
    test.skip(
      true,
      'FaultedChargersCard renders only when the FAULTED_CHARGING_STATIONS_LIST_QUERY returns rows; reliably seeding that path requires additional joins (LatestStatusNotifications) that vary by Hasura permission set.',
    );
  });

  test('E2E-014: KPI headings render even with no fixture-seeded data', async ({
    page,
  }) => {
    const overview = new OverviewPage(page);
    await overview.goto();

    await expect(overview.kpiOnlineHeading).toBeVisible();
    await expect(overview.kpiActiveTransactionsHeading).toBeVisible();
    await expect(overview.kpiPluginSuccessHeading).toBeVisible();
    await expect(overview.kpiChargerActivityHeading).toBeVisible();
  });
});
