import { type Locator, type Page, expect } from '@playwright/test';

// LocationFormPage — the Locations upsert form lives on /locations/new and
// /locations/:id/edit; the same component renders both. submit() waits for
// navigation to the detail route OR a success toast before returning,
// eliminating Refine submit-redirect races. State field is conditional on
// country.usesAdministrativeAreas, exposed via the optional `stateField()`
// accessor (used by E2E-031).

export interface LocationFormPayload {
  readonly name: string;
  readonly country?: string; // country NAME as shown in combobox (e.g., "United States")
  readonly state?: string;
  readonly address?: string;
  readonly city?: string;
  readonly postalCode?: string;
  readonly latitude?: number;
  readonly longitude?: number;
  readonly timeZone?: string;
}

export class LocationFormPage {
  static readonly newPath = '/locations/new';
  static editPath(id: number | string): string {
    return `/locations/${id}/edit`;
  }

  readonly heading: Locator;
  readonly nameInput: Locator;
  readonly countryCombobox: Locator;
  readonly addressInput: Locator;
  readonly cityInput: Locator;
  readonly postalCodeInput: Locator;
  readonly latitudeInput: Locator;
  readonly longitudeInput: Locator;
  readonly timeZoneInput: Locator;
  readonly submitButton: Locator;

  constructor(private readonly page: Page) {
    this.heading = page.getByRole('heading', {
      name: /(create|edit) location/i,
    });
    // FormField labels render in <span>; the input's accessible name comes
    // from id/htmlFor wiring on FormField, OR from placeholder. Anchor on
    // the surrounding <Field role="group"> for robustness against either.
    // Required-field labels render as "Label *" so we drop end-anchors and
    // use word-boundary patterns where ambiguity could arise.
    this.nameInput = this.fieldGroup('Name').getByRole('textbox').first();
    this.countryCombobox = this.fieldGroup('Country')
      .getByRole('combobox')
      .first();
    this.addressInput = this.fieldGroup('Address').getByRole('textbox').first();
    this.cityInput = this.fieldGroup('City').getByRole('textbox').first();
    // ZIP Code label is US-specific; CA uses "Postal Code". Test specs
    // pass the country-specific label via fieldGroup directly when needed.
    this.postalCodeInput = this.fieldGroup('ZIP Code')
      .getByRole('textbox')
      .first();
    this.latitudeInput = page.locator('input#latitude');
    this.longitudeInput = page.locator('input#longitude');
    this.timeZoneInput = this.fieldGroup('Time Zone')
      .getByRole('textbox')
      .first();
    this.submitButton = page.getByRole('button', { name: /^(save|submit)/i });
  }

  // Field-group helper that anchors STRICTLY on the label text (not on any
  // descendant content like the selected value of a combobox). The form
  // renders each field as `<group> [label][asterisk] <input/combobox> </group>`,
  // so we filter groups whose first-child generic exactly contains the
  // label text.
  fieldGroup(labelText: string): Locator {
    return this.page
      .getByRole('group')
      .filter({ has: this.page.getByText(labelText, { exact: true }) });
  }

  stateField(): Locator {
    // Administrative-area combobox label varies by country: "State" for US,
    // "Province" for CA. Try US first; CA case is handled separately by
    // E2E-031. Anchored exact-string to avoid matching "United States".
    return this.fieldGroup('State');
  }

  async gotoNew(): Promise<void> {
    await this.page.goto(LocationFormPage.newPath);
    await this.expectLoaded();
  }

  async gotoEdit(id: number | string): Promise<void> {
    await this.page.goto(LocationFormPage.editPath(id));
    await this.expectLoaded();
  }

  async expectLoaded(): Promise<void> {
    await expect(this.heading).toBeVisible({ timeout: 30_000 });
    await expect(this.nameInput).toBeVisible({ timeout: 30_000 });
  }

  async fill(payload: LocationFormPayload): Promise<void> {
    if (payload.name !== undefined) {
      await this.nameInput.fill(payload.name);
    }
    if (payload.country !== undefined) {
      await this.selectCountry(payload.country);
    }
    if (payload.state !== undefined) {
      await this.selectState(payload.state);
    }
    if (payload.address !== undefined) {
      await this.addressInput.fill(payload.address);
    }
    if (payload.city !== undefined) {
      await this.cityInput.fill(payload.city);
    }
    if (payload.postalCode !== undefined) {
      await this.postalCodeInput.fill(payload.postalCode);
    }
    if (payload.latitude !== undefined) {
      await this.latitudeInput.fill(String(payload.latitude));
    }
    if (payload.longitude !== undefined) {
      await this.longitudeInput.fill(String(payload.longitude));
    }
    if (payload.timeZone !== undefined) {
      await this.timeZoneInput.fill(payload.timeZone);
    }
  }

  async selectCountry(countryName: string): Promise<void> {
    await this.countryCombobox.click();
    await this.page
      .getByRole('option', { name: new RegExp(`^${countryName}$`, 'i') })
      .first()
      .click();
  }

  async selectState(stateName: string): Promise<void> {
    // The state combobox waits on getAdministrativeAreas() to populate; on
    // initial mount it briefly shows "Loading..." and is disabled. Wait for
    // it to be enabled (no `aria-disabled="true"`) before clicking.
    const trigger = this.stateField().getByRole('combobox').first();
    await expect(trigger).toBeEnabled({ timeout: 15_000 });
    await trigger.click();
    const option = this.page
      .getByRole('option', { name: new RegExp(`^${stateName}$`, 'i') })
      .first();
    await option.waitFor({ state: 'visible', timeout: 15_000 });
    await option.click();
  }

  // Never return while Refine is in-flight. We wait for either the
  // success-redirect to the detail route OR a success toast.
  async submit(): Promise<void> {
    // The success-toast wait is the canonical signal — Refine fires the
    // toast on the mutation's onSuccess BEFORE redirecting. URL-based
    // waits race with the current route (/locations/:id/edit can match
    // a permissive `/locations/\d+` regex on entry).
    await this.submitButton.click();
    await this.page
      .getByRole('region', { name: /notifications/i })
      .getByText(/(success|created|updated|saved)/i)
      .first()
      .waitFor({ state: 'visible', timeout: 30_000 });
  }

  async cancel(): Promise<void> {
    // Header chevron button calls router.back(); fall through if absent.
    const back = this.page
      .getByRole('button', { name: /(back|cancel)/i })
      .first();
    if (await back.isVisible().catch(() => false)) {
      await back.click();
    }
  }

  validationErrors(): Locator {
    return this.page.locator('[role="alert"], [data-slot="form-message"]');
  }
}
