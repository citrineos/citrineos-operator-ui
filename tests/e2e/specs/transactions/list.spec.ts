import { test, expect } from '../../fixtures';
import { TransactionsListPage } from '../../pages/transactions/list.page';

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

  test('E2E-091: Search by stationId filters the list', async ({
    page,
    seededTransaction,
  }) => {
    const list = new TransactionsListPage(page);
    await list.goto();
    await list.searchInput.fill(seededTransaction.stationId);
    await expect(list.rowByStationId(seededTransaction.stationId)).toBeVisible({
      timeout: 15_000,
    });
  });

  test('E2E-092: Search by transactionId filters the list', async ({
    page,
    seededTransaction,
  }) => {
    const list = new TransactionsListPage(page);
    await list.goto();
    await list.searchInput.fill(seededTransaction.transactionId);
    await expect(
      list.rowByTransactionId(seededTransaction.transactionId),
    ).toBeVisible({ timeout: 15_000 });
  });
});
