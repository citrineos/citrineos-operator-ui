// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

/**
 * Country configuration for address forms
 * This uses ISO 3166-1 alpha-2 country codes
 *
 * Configuration is loaded from JSON files in the config/countries directory.
 * To customize for your deployment, edit the JSON files directly or set
 * environment variables to point to custom configuration files.
 */

import allCountriesDefault from '../../../config/countries/all-countries.json';
import countryConfigsDefault from '../../../config/countries/country-configs.json';
import countryAreasDefault from '../../../config/countries/country-areas.json';

export type CountryCode = string;

export interface CountryConfig {
  code: CountryCode;
  name: string;
  usesAdministrativeAreas: boolean; // Whether country uses states/provinces
  administrativeAreaLabel: string; // "State", "Province", "Region", etc.
  postalCodeLabel: string;
  postalCodeRequired: boolean;
  postalCodePattern?: RegExp;
}

/**
 * JSON structure for country-specific config
 */
interface CountryConfigJson {
  administrativeAreaLabel?: string;
  postalCodeLabel?: string;
  postalCodePattern?: string;
  postalCodeRequired?: boolean;
  usesAdministrativeAreas?: boolean;
}

export interface AdministrativeArea {
  name: string;
  shortName: string;
}

export const PREDEFINED_AREAS: Record<string, AdministrativeArea[]> =
  countryAreasDefault as Record<string, AdministrativeArea[]>;

/**
 * Get administrative areas for a country from predefined list
 */
export async function getAdministrativeAreas(
  countryCode: string,
): Promise<AdministrativeArea[]> {
  const upperCode = countryCode.toUpperCase();

  return PREDEFINED_AREAS[upperCode];
}

/**
 * Country-specific configurations
 * Loaded from config/countries/country-configs.json
 * Override by editing the JSON file directly
 */
const countryConfigsJson: Record<string, CountryConfigJson> =
  countryConfigsDefault as Record<string, CountryConfigJson>;

/**
 * Convert JSON config to runtime config with RegExp patterns
 */
export const COUNTRY_CONFIGS: Record<
  string,
  Partial<CountryConfig>
> = Object.fromEntries(
  Object.entries(countryConfigsJson).map(([code, config]) => [
    code,
    {
      ...config,
      postalCodePattern: config.postalCodePattern
        ? new RegExp(config.postalCodePattern, 'i')
        : undefined,
    },
  ]),
);

/**
 * Get configuration for a country with fallback defaults
 */
export function getCountryConfig(countryCode: CountryCode): CountryConfig {
  const customConfig = COUNTRY_CONFIGS[countryCode] || {};

  return {
    code: countryCode,
    name: countryCode,
    usesAdministrativeAreas: customConfig.usesAdministrativeAreas ?? true,
    administrativeAreaLabel:
      customConfig.administrativeAreaLabel || 'State/Province',
    postalCodeLabel: customConfig.postalCodeLabel || 'Postal Code',
    postalCodeRequired: customConfig.postalCodeRequired ?? true,
    postalCodePattern: customConfig.postalCodePattern,
  };
}

/**
 * Comprehensive list of countries with ISO codes
 * Loaded from config/countries/all-countries.json
 * Override by editing the JSON file directly
 */
export const ALL_COUNTRIES: Array<{ code: CountryCode; name: string }> =
  allCountriesDefault as Array<{ code: CountryCode; name: string }>;

/**
 * Get sorted country list with popular countries first
 */
export function getCountryList(): Array<{ code: CountryCode; name: string }> {
  return ALL_COUNTRIES;
}
