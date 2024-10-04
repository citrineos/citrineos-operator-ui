import React from 'react';
import { Button } from 'antd';
import { useNavigation } from '@refinedev/core';
import './style.scss';
import { ResourceType } from '../../../resource-type';
import { Locations } from '../../../graphql/schema.types';

interface LocationMarkerProps {
  location: Locations;
}

export const LocationMarker: React.FC<LocationMarkerProps> = ({ location }) => {
  const { show } = useNavigation();

  const handleShowClick = () => {
    show(ResourceType.LOCATIONS, location.id);
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
