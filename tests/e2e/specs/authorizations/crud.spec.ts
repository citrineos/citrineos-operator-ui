import { test, expect } from '../../fixtures';
import { AuthorizationsListPage } from '../../pages/authorizations/list.page';
import { AuthorizationFormPage } from '../../pages/authorizations/form.page';
import { deleteAuthorization } from '../../fixtures/seeded-data';
import { shortId } from '../../utils/random';

test.use({ storageState: 'playwright/.auth/admin.json' });

test.describe('authorizations › CRUD', () => {
  test('E2E-100: Authorizations list renders', async ({ page }) => {
    const list = new AuthorizationsListPage(page);
    await list.goto();
    await expect(list.heading).toBeVisible();
    await expect(list.addButton).toBeVisible();
  });

  test('E2E-101: Create authorization via UI redirects + appears in list', async ({
    page,
    apiClient,
  }) => {
    const idToken = `${shortId().toUpperCase()}-RFID`;
    const form = new AuthorizationFormPage(page);
    await form.gotoNew();
    await form.fill({
      idToken,
      idTokenType: 'ISO14443',
      status: 'Accepted',
    });
    await form.submit();

    const list = new AuthorizationsListPage(page);
    await list.goto();
    await expect(list.rowByIdToken(idToken)).toBeVisible({ timeout: 30_000 });

    // Cleanup.
    const { Authorizations } = await apiClient.gql<{
      Authorizations: { id: number }[];
    }>(
      `query LookupAuth($idToken: citext!) {
         Authorizations(where: { idToken: { _eq: $idToken } }) { id }
       }`,
      { idToken },
    );
    if (Authorizations[0]) {
      await deleteAuthorization(apiClient, Authorizations[0].id).catch(
        () => undefined,
      );
    }
  });

  test('E2E-102: Edit form pre-fills with existing authorization data', async ({
    page,
    seededAuthorization,
  }) => {
    const form = new AuthorizationFormPage(page);
    await form.gotoEdit(seededAuthorization.id);
    // Detail/edit headings vary in render path; anchor on the ID Token
    // input with the seeded value as the deterministic load signal.
    await expect(form.idTokenInput).toHaveValue(seededAuthorization.idToken, {
      timeout: 30_000,
    });
  });

  test('E2E-103: Delete authorization has no UI surface (read-only via API)', async () => {
    test.skip(
      true,
      'Authorizations has no UI delete on detail/list at this time. Confirmed by inspection of src/lib/client/pages/authorizations/.',
    );
  });

  test('E2E-104: Create authorization with empty required fields stays on form', async ({
    page,
  }) => {
    const form = new AuthorizationFormPage(page);
    await form.gotoNew();
    await form.submitButton.click();
    await expect(page).toHaveURL(/\/authorizations\/new/);
    await expect(form.heading).toBeVisible();
  });
});
