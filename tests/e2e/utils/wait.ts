// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { expect, type APIRequestContext } from '@playwright/test';

export interface HealthcheckTarget {
  readonly name: string;
  readonly url: string;
}

export async function waitForBackendHealthy(
  request: APIRequestContext,
  targets: readonly HealthcheckTarget[],
  timeoutMs = 60_000,
): Promise<void> {
  for (const target of targets) {
    await expect
      .poll(
        async () => {
          try {
            const res = await request.get(target.url, { timeout: 5_000 });
            return res.ok();
          } catch {
            return false;
          }
        },
        {
          message: `Backend not healthy: ${target.name} at ${target.url}`,
          timeout: timeoutMs,
          intervals: [500, 1_000, 2_000],
        },
      )
      .toBe(true);
  }
}
