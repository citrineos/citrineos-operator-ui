// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { type Locator, type Page, expect } from '@playwright/test';
import { CommandBar } from '../components/command-bar.po';

interface DetailTabs {
  readonly evses: Locator;
  readonly connectors: Locator;
  readonly messages: Locator;
  readonly configuration: Locator;
}

export class ChargingStationDetailPage {
  // Refine's hasura-default data provider is configured with `idType: 'Int'`
  // so the detail route param is the numeric pkId, not the station's business
  // id string. Specs receive the seeded station object and pass `.pkId`.
  static path(pkId: number | string): string {
    return `/charging-stations/${pkId}`;
  }
  static readonly urlGlob = '**/charging-stations/*';

  readonly heading: Locator;
  readonly statusTag: Locator;
  readonly commandBar: CommandBar;
  readonly tabs: DetailTabs;

  constructor(private readonly page: Page) {
    // The detail card uses the station id as its visible heading.
    this.heading = page.getByRole('heading').first();
    this.statusTag = page.getByText(/^(online|offline)$/i).first();
    this.commandBar = new CommandBar(page);
    this.tabs = {
      evses: page.getByRole('tab', { name: /^evses$/i }),
      connectors: page.getByRole('tab', { name: /^connectors$/i }),
      messages: page.getByRole('tab', { name: /(ocpp )?messages/i }),
      configuration: page.getByRole('tab', { name: /configuration/i }),
    };
  }

  async goto(pkId: number | string): Promise<void> {
    await this.page.goto(ChargingStationDetailPage.path(pkId), {
      waitUntil: 'domcontentloaded',
    });
    await this.expectLoaded();
  }

  async expectLoaded(): Promise<void> {
    // Detail page is interactive when the command bar's Reset button (always
    // rendered for any non-deleted station) becomes visible. The 60s budget
    // covers cold-route Next.js compilation + the useOne(ChargingStation)
    // query. On heavy concurrency the dev server can hang for the full
    // window without finishing its response — a one-shot reload unsticks it.
    // The two attempts cap the wait at 120s but in practice the first
    // attempt resolves in 5–20s.
    try {
      await expect(this.commandBar.resetButton).toBeVisible({
        timeout: 60_000,
      });
    } catch {
      await this.page.reload({
        waitUntil: 'domcontentloaded',
        timeout: 60_000,
      });
      await expect(this.commandBar.resetButton).toBeVisible({
        timeout: 60_000,
      });
    }
  }

  // EVSE tab — open and verify rows are listed. Row identification is by
  // the EVSE Type ID column (left-most), which is unique per station.
  async openEvsesTab(): Promise<void> {
    await this.tabs.evses.click();
    await expect(
      this.page.getByRole('button', { name: /add new evse/i }),
    ).toBeVisible({ timeout: 30_000 });
  }

  evseRowByTypeId(evseTypeId: number | string): Locator {
    return this.page.getByRole('row').filter({ hasText: String(evseTypeId) });
  }

  // Connector add via the EVSE row's "Add Connector" button. Clicks open
  // a Radix Dialog with the ConnectorsUpsert form.
  async clickAddConnectorOnEvse(evseTypeId: number | string): Promise<void> {
    await this.evseRowByTypeId(evseTypeId)
      .getByRole('button', { name: /add connector/i })
      .click();
  }

  // OCPP Messages tab — verify it surfaces the latest BootNotification or
  // StatusNotification for an EVerest-attached station.
  async openMessagesTab(): Promise<void> {
    await this.tabs.messages.click();
  }
}
