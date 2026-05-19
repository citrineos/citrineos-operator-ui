import type { Page, Route } from '@playwright/test';

const HASURA_GLOB = '**/v1/graphql';

async function fulfillJson(
  route: Route,
  status: number,
  body: Record<string, unknown>,
): Promise<void> {
  await route.fulfill({
    status,
    contentType: 'application/json',
    body: JSON.stringify(body),
  });
}

export async function forceHasura401(page: Page): Promise<void> {
  await page.route(HASURA_GLOB, (route) =>
    fulfillJson(route, 401, {
      errors: [
        { message: 'Unauthorized', extensions: { code: 'unauthorized' } },
      ],
    }),
  );
}

export async function forceHasura500(page: Page): Promise<void> {
  await page.route(HASURA_GLOB, (route) =>
    fulfillJson(route, 500, {
      errors: [{ message: 'Internal server error' }],
    }),
  );
}

export async function restoreAllRoutes(page: Page): Promise<void> {
  await page.unrouteAll({ behavior: 'wait' });
}

// Block Google Maps SDK + Places API requests so the dev server doesn't
// surface an InvalidKeyMapError overlay that crashes downstream form
// interactions. Routes return an empty 200 so the SDK's promise resolves
// quietly rather than rejecting. Used by location/map specs which exercise
// the form without needing real maps.
export async function blockGoogleMaps(page: Page): Promise<void> {
  await page.route('**/maps.googleapis.com/**', (route) =>
    route.fulfill({ status: 200, contentType: 'text/javascript', body: '' }),
  );
  await page.route('**/maps.gstatic.com/**', (route) =>
    route.fulfill({ status: 200, contentType: 'text/javascript', body: '' }),
  );
}
