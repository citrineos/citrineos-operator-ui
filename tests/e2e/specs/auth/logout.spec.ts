import { test, expect } from '../../fixtures';
import { OverviewPage } from '../../pages/overview.page';
import { LoginPage } from '../../pages/login.page';

test.use({ storageState: 'playwright/.auth/admin.json' });

test.describe('auth › logout', () => {
  test('E2E-004: authenticated admin signs out and lands on /login', async ({
    page,
  }) => {
    const overview = new OverviewPage(page);
    const login = new LoginPage(page);

    await overview.goto();
    await overview.signOut();

    await page.waitForURL(/\/login(\?.*)?$/, { timeout: 30_000 });
    await expect(login.submitButton).toBeVisible();
  });

  test('E2E-005: when Keycloak is the auth provider, sign-out hits the realm logout endpoint', async ({
    page,
  }) => {
    test.skip(
      process.env.E2E_AUTH_PROVIDER !== 'keycloak',
      'Keycloak realm not provisioned; generic auth in use.',
    );

    const overview = new OverviewPage(page);
    const login = new LoginPage(page);

    const redirects: string[] = [];
    page.on('framenavigated', (frame) => {
      if (frame === page.mainFrame()) redirects.push(frame.url());
    });

    await overview.goto();
    await overview.signOut();

    await page.waitForURL(/\/login(\?.*)?$/, { timeout: 30_000 });
    await expect(login.submitButton).toBeVisible();
    expect(
      redirects.some((u) => /protocol\/openid-connect\/logout/.test(u)),
      'redirect chain should include Keycloak end_session endpoint',
    ).toBe(true);
  });
});
