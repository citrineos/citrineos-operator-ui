import { type Locator, type Page, expect } from '@playwright/test';

// ChargingStationFormPage — the CS upsert form lives on
// /charging-stations/new and /charging-stations/:id/edit. submit() awaits a
// Refine success toast before returning. ID and Location are required;
// everything else is optional. The Location combobox is disabled in
// edit-from-location-context paths.

export interface ChargingStationFormPayload {
  readonly id?: string;
  readonly locationName?: string; // Location combobox option label
  readonly floorLevel?: string;
}

export class ChargingStationFormPage {
  static readonly newPath = '/charging-stations/new';
  static editPath(id: number | string): string {
    return `/charging-stations/${id}/edit`;
  }

  readonly heading: Locator;
  readonly idInput: Locator;
  readonly locationCombobox: Locator;
  readonly floorLevelInput: Locator;
  readonly submitButton: Locator;

  constructor(private readonly page: Page) {
    this.heading = page.getByRole('heading', {
      name: /(create|edit) charging\s*station/i,
    });
    this.idInput = this.fieldGroup('ID').getByRole('textbox').first();
    this.locationCombobox = this.fieldGroup('Location')
      .getByRole('combobox')
      .first();
    this.floorLevelInput = this.fieldGroup('Floor Level')
      .getByRole('textbox')
      .first();
    this.submitButton = page.getByRole('button', { name: /^(save|submit)/i });
  }

  fieldGroup(labelText: string): Locator {
    return this.page
      .getByRole('group')
      .filter({ has: this.page.getByText(labelText, { exact: true }) });
  }

  async gotoNew(): Promise<void> {
    await this.page.goto(ChargingStationFormPage.newPath);
    await this.expectLoaded();
  }

  async gotoEdit(id: number | string): Promise<void> {
    await this.page.goto(ChargingStationFormPage.editPath(id));
    await this.expectLoaded();
  }

  async expectLoaded(): Promise<void> {
    await expect(this.heading).toBeVisible({ timeout: 30_000 });
    await expect(this.idInput).toBeVisible({ timeout: 30_000 });
  }

  async fill(payload: ChargingStationFormPayload): Promise<void> {
    if (payload.id !== undefined) {
      await this.idInput.fill(payload.id);
    }
    if (payload.locationName !== undefined) {
      await this.selectLocation(payload.locationName);
    }
    if (payload.floorLevel !== undefined) {
      await this.floorLevelInput.fill(payload.floorLevel);
    }
  }

  async selectLocation(locationName: string): Promise<void> {
    const trigger = this.locationCombobox;
    await expect(trigger).toBeEnabled({ timeout: 15_000 });
    await trigger.click();
    const option = this.page
      .getByRole('option', { name: new RegExp(`^${locationName}\\b`, 'i') })
      .first();
    await option.waitFor({ state: 'visible', timeout: 15_000 });
    await option.click();
  }

  async submit(): Promise<void> {
    await this.submitButton.click();
    await this.page
      .getByRole('region', { name: /notifications/i })
      .getByText(/(success|created|updated|saved)/i)
      .first()
      .waitFor({ state: 'visible', timeout: 30_000 });
  }
}
