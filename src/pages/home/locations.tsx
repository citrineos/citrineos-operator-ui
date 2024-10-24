import React from 'react';
import { LocationsList } from '../locations';

export const HomeLocations: React.FC = () => {
  return (
    <>
      <LocationsList viewMode="map" />
    </>
  );
};
