import { Route, Routes } from 'react-router-dom';
import React from 'react';
import { LocationsList } from './list/locations.list';
import { LocationsUpsert } from './upsert/locations.upsert';
import { LocationsDetail } from './detail/locations.detail';
import { ResourceType } from '../../resource-type';
import { LocationsMap } from './map/locations.map';

export const routes: React.FC = () => {
  return (
    <Routes>
      <Route index element={<LocationsList />} />
      <Route path="/map" element={<LocationsMap />} />
      <Route path="/new" element={<LocationsUpsert />} />
      <Route path="/:id" element={<LocationsDetail />} />
      <Route path="/:id/edit" element={<LocationsUpsert />} />
    </Routes>
  );
};

export const resources = [
  {
    name: ResourceType.LOCATIONS,
    list: '/locations',
    create: '/locations/new',
    show: '/locations/:id',
    edit: '/locations/:id/edit',
  },
];
