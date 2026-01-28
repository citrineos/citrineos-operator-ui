// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

/**
 * Type definitions and schemas for country configuration JSON files
 */

/**
 * Schema for all-countries.json
 * An array of country objects with code and name
 */
export type AllCountriesSchema = Array<{
  code: string;
  name: string;
}>;

/**
 * Schema for country-configs.json
 * A record of country codes to their specific configurations
 */
export type CountryConfigsSchema = Record<
  string,
  {
    administrativeAreaLabel?: string;
    postalCodeLabel?: string;
    postalCodePattern?: string;
    postalCodeRequired?: boolean;
    usesAdministrativeAreas?: boolean;
  }
>;

/**
 * Validates all countries JSON structure
 */
export function validateAllCountries(
  data: unknown,
): data is AllCountriesSchema {
  return (
    Array.isArray(data) &&
    data.every(
      (item) =>
        typeof item === 'object' &&
        item !== null &&
        'code' in item &&
        'name' in item &&
        typeof item.code === 'string' &&
        typeof item.name === 'string',
    )
  );
}

/**
 * Validates country configs JSON structure
 */
export function validateCountryConfigs(
  data: unknown,
): data is CountryConfigsSchema {
  if (typeof data !== 'object' || data === null) {
    return false;
  }

  return Object.values(data).every(
    (config) =>
      typeof config === 'object' &&
      config !== null &&
      (config.administrativeAreaLabel === undefined ||
        typeof config.administrativeAreaLabel === 'string') &&
      (config.postalCodeLabel === undefined ||
        typeof config.postalCodeLabel === 'string') &&
      (config.postalCodePattern === undefined ||
        typeof config.postalCodePattern === 'string') &&
      (config.postalCodeRequired === undefined ||
        typeof config.postalCodeRequired === 'boolean') &&
      (config.usesAdministrativeAreas === undefined ||
        typeof config.usesAdministrativeAreas === 'boolean'),
  );
}
