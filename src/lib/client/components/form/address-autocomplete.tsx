// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0
'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Input } from '../ui/input';
import debounce from 'lodash.debounce';
import { autocompleteAddress } from '@lib/server/actions/map/autocompleteAddress';
import { getPlaceDetails } from '@lib/server/actions/map/getPlaceDetails';

type Prediction = {
  description: string;
  place_id: string;
};

export type PlaceDetails = {
  address: string;
  city?: string;
  state?: string;
  postalCode?: string;
  countryCode?: string;
  countryName?: string;
  coordinates: { lat: number; lng: number };
};

type Props = {
  value: string;
  onChangeAction: (value: string) => void;
  onSelectPlaceAction: (placeId: string, placeDetails: PlaceDetails) => void;
  countryCode?: string;
  placeholder?: string;
  sessionToken?: string;
};

export const AddressAutocomplete: React.FC<Props> = ({
  value,
  onChangeAction,
  onSelectPlaceAction,
  countryCode,
  placeholder = 'Enter address',
  sessionToken,
}) => {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const fetchPredictions = debounce((input: string) => {
    if (!input) {
      setPredictions([]);
      return;
    }
    setLoading(true);

    const searchCountryCode = countryCode?.toUpperCase() || 'US';

    autocompleteAddress(input, searchCountryCode, sessionToken)
      .then((data) => setPredictions(data))
      .catch((err) => {
        console.log(err);
        setPredictions([]);
      })
      .finally(() => setLoading(false));
  }, 300);

  useEffect(() => {
    fetchPredictions(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

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

  const handleSelect = (prediction: Prediction) => {
    setShowDropdown(false);
    onChangeAction(prediction.description);

    getPlaceDetails(prediction.place_id, sessionToken)
      .then((details) => {
        const location = details.location;
        const components = details.addressComponents;

        const getComponent = (type: string) =>
          components?.find((c) => c.types.includes(type))?.longText;

        const getComponentShort = (type: string) =>
          components?.find((c) => c.types.includes(type))?.shortText;

        const streetNumber = getComponent('street_number') || '';
        const route = getComponent('route') || '';
        const streetAddress = `${streetNumber} ${route}`.trim();

        const adminArea =
          getComponent('administrative_area_level_1') ||
          getComponent('administrative_area_level_2') ||
          '';

        const fullDetails: PlaceDetails = {
          address: streetAddress,
          city:
            getComponent('locality') ||
            getComponent('sublocality') ||
            getComponent('administrative_area_level_2') ||
            '',
          state: adminArea,
          postalCode: getComponent('postal_code') || '',
          countryCode: getComponentShort('country') || '',
          countryName: getComponent('country') || '',
          coordinates: {
            lat: location.latitude,
            lng: location.longitude,
          },
        };

        onChangeAction(fullDetails.address);
        onSelectPlaceAction(prediction.place_id, fullDetails);
      })
      .catch((err) => {
        console.error('Failed to fetch place details', err);
      });
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      <Input
        value={value}
        onChange={(e) => {
          onChangeAction(e.target.value);
          setShowDropdown(true);
        }}
        onFocus={() => {
          if (predictions.length > 0) {
            setShowDropdown(true);
          }
        }}
        placeholder={placeholder}
      />
      {showDropdown && (predictions.length > 0 || loading) && (
        <ul className="absolute z-10 w-full bg-white border rounded shadow max-h-60 overflow-auto">
          {loading && predictions.length === 0 && (
            <li className="p-2 text-gray-500">Loading...</li>
          )}
          {predictions.map((p) => (
            <li
              key={p.place_id}
              className="p-2 cursor-pointer hover:bg-gray-100"
              onClick={() => handleSelect(p)}
            >
              {p.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
