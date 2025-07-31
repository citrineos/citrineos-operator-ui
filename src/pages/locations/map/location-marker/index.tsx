// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { Button } from 'antd';
import { useNavigation } from '@refinedev/core';
import './style.scss';
import { ResourceType } from '@util/auth';
import { ILocationDto } from '@citrineos/base';

interface LocationMarkerProps {
  location: ILocationDto;
}

export const LocationMarker: React.FC<LocationMarkerProps> = ({ location }) => {
  const { show } = useNavigation();

  const handleShowClick = () => {
    show(ResourceType.LOCATIONS, location.id!); // Use non-null assertion
  };

  return (
    <div className="location-marker-content">
      <h4 className="location-name">{location.name}</h4>
      <p className="location-address">{location.address}</p>
      <p className="location-details">
        {location.city}, {location.state} {location.postalCode},{' '}
        {location.country}
      </p>
      <Button
        type="primary"
        onClick={handleShowClick}
        style={{ marginTop: '10px' }}
      >
        View Details
      </Button>
    </div>
  );
};
