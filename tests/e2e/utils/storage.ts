import type { Page } from '@playwright/test';

const FIRST_LOGIN_KEY_PREFIX = 'firstLoginHelp:';

export async function clearWelcomeFlag(page: Page): Promise<void> {
  await page.evaluate((prefix) => {
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i += 1) {
      const key = localStorage.key(i);
      if (key && key.startsWith(prefix)) keys.push(key);
    }
    for (const key of keys) localStorage.removeItem(key);
  }, FIRST_LOGIN_KEY_PREFIX);
}

export async function setWelcomeFlag(
  page: Page,
  userId: string,
  value: boolean,
): Promise<void> {
  await page.evaluate(
    ([prefix, id, v]) => {
      localStorage.setItem(`${prefix}${id}`, String(v));
    },
    [FIRST_LOGIN_KEY_PREFIX, userId, value] as const,
  );
}

export async function clearAllStorage(page: Page): Promise<void> {
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
}
