// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0
'use server';

import config from '@lib/utils/config';

export interface PlaceDetailsResponse {
  id: string;
  displayName: {
    text: string;
    languageCode: string;
  };
  formattedAddress: string;
  addressComponents: Array<{
    longText: string;
    shortText: string;
    types: string[];
    languageCode?: string;
  }>;
  location: {
    latitude: number;
    longitude: number;
  };
  plusCode?: {
    globalCode: string;
    compoundCode?: string;
  };
  types?: string[];
}

/**
 * Get detailed information about a place using its place_id
 * Uses the new Places API (New) - Place Details endpoint
 *
 * @param placeId - The place_id from autocomplete results
 * @param sessionToken - Optional session token for cost optimization
 * @returns Place details including address components and coordinates
 */
export async function getPlaceDetails(
  placeId: string,
  sessionToken?: string,
): Promise<PlaceDetailsResponse> {
  if (!placeId) {
    throw new Error('Place ID is required');
  }

  // Construct URL with optional session token
  let url = `https://places.googleapis.com/v1/places/${placeId}`;
  if (sessionToken) {
    url += `?sessionToken=${sessionToken}`;
  }

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': config.googleMapsAddressApiKey!,
      'X-Goog-FieldMask':
        'id,displayName,formattedAddress,addressComponents,location,plusCode,types',
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Failed to fetch place details:', response.status, errorText);
    throw new Error(`Failed to fetch place details: ${response.status}`);
  }

  const data = await response.json();
  return data as PlaceDetailsResponse;
}
