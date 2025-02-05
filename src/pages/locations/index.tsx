import { Route, Routes } from 'react-router-dom';
import React from 'react';
import { LocationsMap } from './map/locations.map';
import { LocationsList } from './list/locations.list';
import { LocationsCreate } from './create/locations.create';
import { LocationsEdit } from './edit/locations.edit';
import { LocationsDetail } from './detail/locations.detail';

export const routes: React.FC = () => {
  return (
    <Routes>
      <Route index element={<LocationsList />} />
      <Route path="/map" element={<LocationsMap />} />
      <Route path="/create" element={<LocationsCreate />} />
      <Route path="/:id" element={<LocationsDetail />} />
      <Route path="/:id/edit" element={<LocationsEdit />} />
    </Routes>
  );
};
