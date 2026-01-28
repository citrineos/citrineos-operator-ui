// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0
'use server';

import config from '@lib/utils/config';

/**
 * Autocomplete for street addresses with strict country filtering
 * Uses Places API (New) Autocomplete with includedRegionCodes for reliable country restriction
 */
export async function autocompleteAddress(
  input: string,
  country: string = 'us',
  sessionToken?: string,
) {
  if (!input) throw new Error('Missing input for autocomplete');

  const body: Record<string, unknown> = {
    input,
    includedPrimaryTypes: ['street_address', 'premise', 'subpremise', 'route'],
    includedRegionCodes: [country.toUpperCase()],
    // Disable IP-based location bias to prevent results from being filtered by user's physical location
    // Without this, Google uses the user's IP to bias results regardless of includedRegionCodes
    locationBias: {
      circle: {
        center: {
          latitude: 0,
          longitude: 0,
        },
        radius: 1,
      },
    },
  };

  if (sessionToken) {
    body.sessionToken = sessionToken;
  }

  const response = await fetch(
    'https://places.googleapis.com/v1/places:autocomplete',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': config.googleMapsAddressApiKey!,
        'X-Goog-FieldMask':
          'suggestions.placePrediction.placeId,suggestions.placePrediction.text,suggestions.placePrediction.structuredFormat',
      },
      body: JSON.stringify(body),
    },
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error(
      'Failed to fetch autocomplete suggestions due to error:',
      errorText,
    );
    throw new Error('Failed to fetch autocomplete suggestions');
  }

  const data = await response.json();

  return (data.suggestions || [])
    .filter((s: any) => s.placePrediction)
    .map((s: any) => ({
      place_id: s.placePrediction.placeId,
      description: s.placePrediction.text.text,
      structured_formatting: s.placePrediction.structuredFormat
        ? {
            main_text: s.placePrediction.structuredFormat.mainText.text,
            secondary_text:
              s.placePrediction.structuredFormat.secondaryText?.text || '',
          }
        : undefined,
    }));
}
