// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { test as setup, expect } from '@playwright/test';
import { resolve } from 'node:path';
import { LoginPage } from '../pages/login.page';
import { OverviewPage } from '../pages/overview.page';
import { readEnv } from '../utils/env';

const ADMIN_STORAGE_STATE = resolve(
  __dirname,
  '..',
  '..',
  '..',
  'playwright',
  '.auth',
  'admin.json',
);

setup.use({ storageState: { cookies: [], origins: [] } });

setup('authenticate as admin and persist storage state', async ({ page }) => {
  const login = new LoginPage(page);
  const overview = new OverviewPage(page);

  await login.goto();
  await login.login(readEnv('E2E_ADMIN_EMAIL'), readEnv('E2E_ADMIN_PASSWORD'));

  await page.waitForURL(OverviewPage.urlGlob, {
    timeout: 45_000,
    waitUntil: 'domcontentloaded',
  });
  await overview.expectLoaded();

  const cookies = await page.context().cookies();
  expect(
    cookies.some((c) => /next-auth/.test(c.name)),
    'NextAuth session cookie should be set after login',
  ).toBe(true);

  await page.context().storageState({ path: ADMIN_STORAGE_STATE });
});
