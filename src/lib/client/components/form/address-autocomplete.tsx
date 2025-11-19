// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Input } from '../ui/input';
import debounce from 'lodash.debounce';
import { Country } from '@lib/utils/country.state.data';
import { AUTO_COMPLETE_ADDRESS, GET_ADDRESS_DETAILS } from '@lib/utils/consts';

type Prediction = {
  description: string;
  place_id: string;
};

type PlaceDetails = {
  address: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  coordinates: { lat: number; lng: number };
};

type Props = {
  value: string;
  onChangeAction: (value: string) => void;
  onSelectPlaceAction: (placeId: string, placeDetails: PlaceDetails) => void;
  country?: Country;
};

const countryCodes = {
  [Country.USA]: 'US',
  [Country.Canada]: 'CA',
};

export const AddressAutocomplete: React.FC<Props> = ({
  value,
  onChangeAction,
  onSelectPlaceAction,
  country = Country.USA,
}) => {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Autocomplete address and fetch details
  const fetchPredictions = debounce(async (input: string) => {
    if (!input) {
      setPredictions([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(
        `${AUTO_COMPLETE_ADDRESS}?input=${encodeURIComponent(input)}&country=${countryCodes[country]}`,
      );
      const data = await res.json();
      setPredictions(data);
    } catch (err) {
      console.error(err);
      setPredictions([]);
    } finally {
      setLoading(false);
    }
  }, 300);

  useEffect(() => {
    fetchPredictions(value);
  }, [value, fetchPredictions]);

  // Handle clicks outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = async (prediction: Prediction) => {
    setShowDropdown(false);
    onChangeAction(prediction.description);

    try {
      // Fetch place details
      const res = await fetch(
        `${GET_ADDRESS_DETAILS}?placeId=${prediction.place_id}`,
      );
      const details = await res.json();

      const location = details.geometry.location;
      const components = details.address_components;
      const getComponent = (type: string) =>
        components.find((c: any) => c.types.includes(type))?.long_name;

      // Extract street number + route
      const streetNumber = getComponent('street_number') || '';
      const route = getComponent('route') || '';
      const streetAddress = `${streetNumber} ${route}`.trim();

      const fullDetails = {
        address: streetAddress,
        city: getComponent('locality') || getComponent('sublocality') || '',
        state: getComponent('administrative_area_level_1') || '',
        postalCode: getComponent('postal_code'),
        country: getComponent('country'),
        coordinates: {
          lat: location.lat,
          lng: location.lng,
        },
      };

      // Update input and form
      onChangeAction(fullDetails.address);
      onSelectPlaceAction(prediction.place_id, fullDetails);
    } catch (err) {
      console.error('Failed to fetch place details', err);
    }
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      <Input
        value={value}
        onChange={(e) => {
          onChangeAction(e.target.value);
          setShowDropdown(true);
        }}
        placeholder="Enter address"
      />
      {showDropdown && predictions.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border rounded shadow max-h-60 overflow-auto">
          {predictions.map((p) => (
            <li
              key={p.place_id}
              className="p-2 cursor-pointer hover:bg-gray-100"
              onClick={() => handleSelect(p)}
            >
              {p.description}
            </li>
          ))}
          {loading && <li className="p-2 text-gray-500">Loading...</li>}
        </ul>
      )}
    </div>
  );
};
