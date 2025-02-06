import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { ChargingStationsList } from './list/charging.stations.list';
import { ChargingStationDetail } from './detail/charging.station.detail';
import { ChargingStationEdit } from './edit/charging.station.edit';
import { ChargingStationCreate } from './create/charging.stations.create';

export const routes: React.FC = () => {
  return (
    <Routes>
      <Route index element={<ChargingStationsList />} />
      <Route path="/new" element={<ChargingStationCreate />} />
      <Route path="/:id" element={<ChargingStationDetail />} />
      <Route path="/:id/edit" element={<ChargingStationEdit />} />
    </Routes>
  );
};
