import { ResourceType } from '../../resource-type';
import { Route, Routes } from 'react-router-dom';
import React from 'react';
import {
  GenericParameterizedView,
  GenericView,
  GenericViewState,
} from '../../components/view';
import { useTable } from '@refinedev/antd';
import { ChargingStationsListQuery } from '../../graphql/types';
import { ChargingStation } from './ChargingStation';
import { DataModelTable, IDataModelListProps } from '../../components';
import { DEFAULT_SORTERS } from '../../components/defaults';
import {
  CHARGING_STATIONS_CREATE_MUTATION,
  CHARGING_STATIONS_DELETE_MUTATION,
  CHARGING_STATIONS_EDIT_MUTATION,
  CHARGING_STATIONS_GET_QUERY,
  CHARGING_STATIONS_LIST_QUERY,
} from './queries';
import { CHARGING_STATIONS_COLUMNS } from './table-config';
import { ChargingStations } from '../../graphql/schema.types';
import { ExpandableColumn } from '../../components/data-model-table/expandable-column';
import { FaChargingStation } from 'react-icons/fa';
import { GenericDataTable } from '../../components/data-model-table/editable';
import { CUSTOM_CHARGING_STATION_ACTIONS } from '../../message';

export const ChargingStationsView: React.FC = () => {
  return (
    <GenericView
      dtoClass={ChargingStation}
      gqlQuery={CHARGING_STATIONS_GET_QUERY}
      editMutation={CHARGING_STATIONS_EDIT_MUTATION}
      createMutation={CHARGING_STATIONS_CREATE_MUTATION}
      deleteMutation={CHARGING_STATIONS_DELETE_MUTATION}
      customActions={CUSTOM_CHARGING_STATION_ACTIONS}
    />
  );
};

export const ChargingStationsList = (props: IDataModelListProps) => {
  const { tableProps } = useTable<ChargingStationsListQuery>({
    resource: ResourceType.CHARGING_STATIONS,
    sorters: DEFAULT_SORTERS,
    filters: props.filters,
    metaData: {
      gqlQuery: CHARGING_STATIONS_LIST_QUERY,
    },
  });

  return (
    <>
      <DataModelTable<ChargingStations, ChargingStationsListQuery>
        tableProps={tableProps}
        columns={CHARGING_STATIONS_COLUMNS(
          !props.hideActions,
          props.parentView,
          CUSTOM_CHARGING_STATION_ACTIONS,
        )}
        hideCreateButton={props.hideCreateButton}
      />
      <GenericDataTable
        dtoClass={ChargingStation}
        customActions={CUSTOM_CHARGING_STATION_ACTIONS}
      />
    </>
  );
};

export const routes: React.FC = () => {
  return (
    <Routes>
      <Route index element={<ChargingStationsList />} />
      <Route path="/:id/*" element={<ChargingStationsView />} />
    </Routes>
  );
};

export const resources = [
  {
    name: ResourceType.CHARGING_STATIONS,
    list: '/charging-stations',
    create: '/charging-stations/new',
    show: '/charging-stations/:id',
    edit: '/charging-stations/:id/edit',
    meta: {
      canDelete: true,
    },
    icon: <FaChargingStation />,
  },
];

export const renderAssociatedStationId = (
  _: any,
  record: {
    stationId: string;
    [key: string]: any;
  },
) => {
  if (!record?.stationId) {
    return '';
  }
  const stationId = record.stationId;
  return (
    <ExpandableColumn
      initialContent={stationId}
      expandedContent={
        <>
          <GenericParameterizedView
            resourceType={ResourceType.CHARGING_STATIONS}
            id={stationId}
            state={GenericViewState.SHOW}
            dtoClass={ChargingStation}
            gqlQuery={CHARGING_STATIONS_GET_QUERY}
          />
        </>
      }
      viewTitle={`Charging Station linked with ID ${record.id}`}
    />
  );
};
