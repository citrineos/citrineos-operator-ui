'use server';

import config from '@lib/utils/config';

export async function getPlaceDetails(placeId: string) {
  if (!placeId) throw new Error("Missing placeId");

  const params = new URLSearchParams({
    place_id: placeId,
    key: config.googleMapsApiKey!,
  });

  const url = `https://maps.googleapis.com/maps/api/place/details/json?${params.toString()}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch place details");
    const data = await response.json();
    if (data.status !== "OK") throw new Error(data.error_message || "Place details lookup failed");
    return data.result;
  } catch (err: any) {
    console.error("Google Maps Place Details error:", err);
    throw new Error("Failed to fetch place details");
  }
}


