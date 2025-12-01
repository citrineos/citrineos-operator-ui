// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0
'use server';

import config from '@lib/utils/config';

export async function autocompleteAddress(
  input: string,
  country: string = 'us',
) {
  if (!input) throw new Error('Missing input for autocomplete');

  const params = new URLSearchParams({
    input,
    key: config.googleMapsApiKey!,
    types: 'address',
    components: `country:${country.toLowerCase()}`,
  });

  const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?${params.toString()}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch autocomplete suggestions');
    }

    const data = await response.json();
    return data.predictions;
  } catch (err: any) {
    console.error('Google Maps Autocomplete error:', err);
    throw new Error('Failed to fetch autocomplete suggestions');
  }
}
