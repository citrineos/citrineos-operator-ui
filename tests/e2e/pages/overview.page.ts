// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { type Locator, type Page, expect } from '@playwright/test';

export class OverviewPage {
  static readonly path = '/overview';
  static readonly urlGlob = '**/overview';

  readonly heading: Locator;
  readonly welcomeDialog: Locator;
  readonly welcomeCloseButton: Locator;

  readonly kpiOnlineHeading: Locator;
  readonly kpiActiveTransactionsHeading: Locator;
  readonly kpiPluginSuccessHeading: Locator;
  readonly kpiChargerActivityHeading: Locator;
  readonly faultedChargersHeading: Locator;
  readonly locationsCardHeading: Locator;

  readonly expandSidebarButton: Locator;
  readonly collapseSidebarButton: Locator;
  readonly themeToggleLightLabel: Locator;
  readonly themeToggleDarkLabel: Locator;
  readonly logoutButton: Locator;

  constructor(private readonly page: Page) {
    this.heading = page.getByRole('heading', {
      name: /charger online status/i,
    });
    this.welcomeDialog = page.getByRole('dialog', {
      name: /welcome to citrineos/i,
    });
    this.welcomeCloseButton = this.welcomeDialog.getByRole('button', {
      name: /close/i,
    });

    this.kpiOnlineHeading = page.getByRole('heading', {
      name: /charger online status/i,
    });
    this.kpiActiveTransactionsHeading = page.getByRole('heading', {
      name: /active transactions/i,
    });
    this.kpiPluginSuccessHeading = page.getByRole('heading', {
      name: /plug-?in success rate/i,
    });
    this.kpiChargerActivityHeading = page.getByRole('heading', {
      name: /charger activity/i,
    });
    this.faultedChargersHeading = page.getByRole('heading', {
      name: /faulted chargers/i,
    });
    this.locationsCardHeading = page.getByRole('heading', {
      name: /^locations$/i,
    });

    this.expandSidebarButton = page.getByRole('button', {
      name: /expand sidebar/i,
    });
    this.collapseSidebarButton = page.getByRole('button', {
      name: /collapse sidebar/i,
    });
    this.themeToggleLightLabel = page.getByRole('button', {
      name: /^light mode$/i,
    });
    this.themeToggleDarkLabel = page.getByRole('button', {
      name: /^dark mode$/i,
    });
    this.logoutButton = page.getByRole('button', { name: /^logout$/i });
  }

  async goto(): Promise<void> {
    await this.page.goto(OverviewPage.path);
    await this.expectLoaded();
  }

  async expectLoaded(): Promise<void> {
    // Anchor on the Locations card heading which is rendered statically
    // without a Hasura query dependency. The Charger Online Status heading
    // sits inside a query-bound skeleton and times out when the dev server
    // is under sustained load. The 60s budget covers Next.js dev-server
    // cold-route compilation. Tests that need to assert specific KPI
    // headings do so individually in their own expectations, not via this
    // load gate. A one-shot reload retry catches the rare case where the
    // dev server stalls a /overview compile under sustained multi-spec load.
    try {
      await Promise.race([
        this.locationsCardHeading.waitFor({
          state: 'visible',
          timeout: 60_000,
        }),
        this.welcomeDialog.waitFor({ state: 'visible', timeout: 60_000 }),
      ]);
      await this.dismissWelcomeIfPresent();
      await expect(this.locationsCardHeading).toBeVisible({ timeout: 60_000 });
    } catch {
      await this.page.reload({
        waitUntil: 'domcontentloaded',
        timeout: 60_000,
      });
      await Promise.race([
        this.locationsCardHeading.waitFor({
          state: 'visible',
          timeout: 60_000,
        }),
        this.welcomeDialog.waitFor({ state: 'visible', timeout: 60_000 }),
      ]);
      await this.dismissWelcomeIfPresent();
      await expect(this.locationsCardHeading).toBeVisible({ timeout: 60_000 });
    }
  }

  async dismissWelcomeIfPresent(): Promise<void> {
    if (await this.welcomeDialog.isVisible().catch(() => false)) {
      await this.welcomeCloseButton.click();
      await expect(this.welcomeDialog).toBeHidden();
    }
  }

  async expandSidebar(): Promise<void> {
    if (await this.expandSidebarButton.isVisible().catch(() => false)) {
      await this.expandSidebarButton.click();
      await expect(this.collapseSidebarButton).toBeVisible();
    }
  }

  async toggleTheme(): Promise<void> {
    await this.expandSidebar();
    const lightVisible = await this.themeToggleLightLabel
      .isVisible()
      .catch(() => false);
    const target = lightVisible
      ? this.themeToggleLightLabel
      : this.themeToggleDarkLabel;
    await target.click();
  }

  async signOut(): Promise<void> {
    await this.expandSidebar();
    await this.logoutButton.click();
  }
}
