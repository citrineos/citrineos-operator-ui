import { test, expect } from '../../fixtures';
import { TransactionsListPage } from '../../pages/transactions/list.page';
import {
  deleteTransaction,
  deleteStation,
  seedStation,
  seedTransaction,
} from '../../fixtures/seeded-data';
import { shortId } from '../../utils/random';

test.use({ storageState: 'playwright/.auth/admin.json' });

test.describe('transactions › list', () => {
  test('E2E-090: Transactions list renders with heading + search', async ({
    page,
  }) => {
    const list = new TransactionsListPage(page);
    await list.goto();
    await expect(list.heading).toBeVisible();
    await expect(list.searchInput).toBeVisible();
  });

  test('E2E-091: Search by stationId returns the matching row and filters decoys out', async ({
    page,
    seededLocation,
    seededTransaction,
    apiClient,
  }) => {
    // Decoy on a different station so the filter has something to exclude.
    const decoyStation = await seedStation(apiClient, seededLocation.id, {
      id: `e2e-${shortId()}-decoy-cp`,
    });
    const decoyTxn = await seedTransaction(apiClient, decoyStation.id);

    try {
      const list = new TransactionsListPage(page);
      await list.goto();
      await list.searchInput.fill(seededTransaction.stationId);

      await expect(
        list.rowByStationId(seededTransaction.stationId),
      ).toBeVisible({ timeout: 15_000 });
      await expect(list.rowByStationId(decoyStation.id)).toHaveCount(0);
    } finally {
      await deleteTransaction(apiClient, decoyTxn.transactionId).catch(
        () => undefined,
      );
      await deleteStation(apiClient, decoyStation.pkId).catch(() => undefined);
    }
  });

  test('E2E-092: Search by transactionId returns the matching row and filters decoys out', async ({
    page,
    seededTransaction,
    apiClient,
  }) => {
    // Decoy on the same station — a station-level filter would surface
    // both rows; a transactionId-level filter must isolate to one.
    const decoyTxn = await seedTransaction(
      apiClient,
      seededTransaction.stationId,
    );

    try {
      const list = new TransactionsListPage(page);
      await list.goto();
      await list.searchInput.fill(seededTransaction.transactionId);

      await expect(
        list.rowByTransactionId(seededTransaction.transactionId),
      ).toBeVisible({ timeout: 15_000 });
      await expect(
        list.rowByTransactionId(decoyTxn.transactionId),
      ).toHaveCount(0);
    } finally {
      await deleteTransaction(apiClient, decoyTxn.transactionId).catch(
        () => undefined,
      );
    }
  });
});
