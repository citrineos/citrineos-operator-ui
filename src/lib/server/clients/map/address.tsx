import { Client } from "@googlemaps/google-maps-services-js";
import config from '@lib/utils/config';

const client = new Client();
const apiKey = config.googleMapsAddressApiKey;

/**
 * Get address autocomplete
 */
export async function getAddressAutocomplete(input: string, country?: string) {
  if (!input) throw new Error("Missing input for autocomplete");

  const params: any = {
    input,
    key: apiKey!,
    types: "address",
  };

  if (country) {
    params.components = `country:${country.toLowerCase()}`;
  }

  try {
    const response = await client.placeAutocomplete({ params });
    return response.data.predictions;
  } catch (err: any) {
    console.error("Google Maps Autocomplete error:", err.response?.data || err);
    throw new Error("Failed to fetch autocomplete suggestions");
  }
}

/**
 * Get place details by Place ID
 */
export async function getPlaceDetails(placeId: string) {
  if (!placeId) throw new Error("Missing placeId");

  try {
    const response = await client.placeDetails({
      params: {
        place_id: placeId,
        key: apiKey!,
        fields: ["formatted_address", "geometry", "address_component"],
      },
    });
    return response.data.result;
  } catch (err: any) {
    console.error("Google Maps Place Details error:", err.response?.data || err);
    throw new Error("Failed to fetch place details");
  }
}
