import React from 'react';
import { ResourceType } from '../../../resource-type';
import { Location } from '../Location';
import {
  LOCATIONS_CREATE_MUTATION,
  LOCATIONS_DELETE_MUTATION,
  LOCATIONS_EDIT_MUTATION,
  LOCATIONS_GET_QUERY,
} from '../queries';
import { GenericView } from '../../../components/view';

export interface LocationsEditProps {}

export const LocationsEdit = (props: LocationsEditProps) => {
  return (
    <GenericView
      resourceType={ResourceType.LOCATIONS}
      dtoClass={Location}
      gqlQuery={LOCATIONS_GET_QUERY}
      editMutation={LOCATIONS_EDIT_MUTATION}
      createMutation={LOCATIONS_CREATE_MUTATION}
      deleteMutation={LOCATIONS_DELETE_MUTATION}
    />
  );
};
