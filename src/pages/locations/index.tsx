import { ResourceType } from '../../resource-type';
import { Route, Routes } from 'react-router-dom';
import React from 'react';
import { GenericView } from '../../components/view';
import { Location } from './Location';
import { IDataModelListProps } from '../../model/interfaces';
import {
  LOCATIONS_CREATE_MUTATION,
  LOCATIONS_DELETE_MUTATION,
  LOCATIONS_EDIT_MUTATION,
  LOCATIONS_GET_QUERY,
} from './queries';
import { MdOutlineLocationOn } from 'react-icons/md';
import { LocationsTable } from './locations.table';
import { LocationsMap } from './locations-map/locations.map';

export const LocationsView: React.FC = () => {
  return (
    <>
      <GenericView
        resourceType={ResourceType.LOCATIONS}
        dtoClass={Location}
        gqlQuery={LOCATIONS_GET_QUERY}
        editMutation={LOCATIONS_EDIT_MUTATION}
        createMutation={LOCATIONS_CREATE_MUTATION}
        deleteMutation={LOCATIONS_DELETE_MUTATION}
      />
    </>
  );
};

export const LocationsList: React.FC<IDataModelListProps> = (props) => {
  return <LocationsTable />;
};

export const routes: React.FC = () => {
  return (
    <Routes>
      <Route index element={<LocationsList />} />
      <Route path="/map" element={<LocationsMap />} />
      <Route path="/:id/*" element={<LocationsView />} />
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
    meta: {
      canDelete: true,
    },
    icon: <MdOutlineLocationOn />,
  },
];
