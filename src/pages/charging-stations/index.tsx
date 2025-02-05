import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { ResourceType } from '../../resource-type';
import { GenericParameterizedView } from '../../components/view';
import { ChargingStation } from './ChargingStation';
import { ExpandableColumn } from '../../components/data-model-table/expandable-column';

import { CHARGING_STATIONS_GET_QUERY } from './queries';
import { GenericViewState } from '@enums';
import { ChargingStationsList } from './list/charging.stations.list';
import { ChargingStationDetail } from './detail/charging.station.detail';

export const routes: React.FC = () => {
  return (
    <Routes>
      <Route index element={<ChargingStationsList />} />
      <Route path="/:id/*" element={<ChargingStationDetail />} />
    </Routes>
  );
};

export const renderAssociatedStationId = (
  _: any,
  record: { stationId: string; [key: string]: any },
) => {
  return record?.stationId ? (
    <ExpandableColumn
      initialContent={record.stationId}
      expandedContent={
        <GenericParameterizedView
          resourceType={ResourceType.CHARGING_STATIONS}
          id={record.stationId}
          state={GenericViewState.SHOW}
          dtoClass={ChargingStation}
          gqlQuery={CHARGING_STATIONS_GET_QUERY}
        />
      }
      viewTitle={`Charging Station linked with ID ${record.id}`}
    />
  ) : (
    ''
  );
};
