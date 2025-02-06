import React from 'react';
import { ResourceType } from '../../../resource-type';
import {
  CHARGING_STATIONS_CREATE_MUTATION,
  CHARGING_STATIONS_DELETE_MUTATION,
  CHARGING_STATIONS_EDIT_MUTATION,
  CHARGING_STATIONS_GET_QUERY,
} from '../queries';
import { GenericView } from '../../../components/view';
import { ChargingStation } from '../ChargingStation';

export const ChargingStationEdit = () => {
  return (
    <GenericView
      resourceType={ResourceType.CHARGING_STATIONS}
      dtoClass={ChargingStation}
      gqlQuery={CHARGING_STATIONS_GET_QUERY}
      editMutation={CHARGING_STATIONS_EDIT_MUTATION}
      createMutation={CHARGING_STATIONS_CREATE_MUTATION}
      deleteMutation={CHARGING_STATIONS_DELETE_MUTATION}
    />
  );
};
