// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { AiFillDatabase } from 'react-icons/ai';
import { Route, Routes } from 'react-router-dom';
import { IDataModelListProps } from '../../model/interfaces';
import { GenericView } from '../../components/view';
import { ResourceType } from '@util/auth';
import { ChargingStationSequence } from './ChargingStationSequence';
import {
  CHARGING_STATION_SEQUENCES_CREATE_MUTATION,
  CHARGING_STATION_SEQUENCES_DELETE_MUTATION,
  CHARGING_STATION_SEQUENCES_EDIT_MUTATION,
  CHARGING_STATION_SEQUENCES_GET_QUERY,
} from './queries';
import { GenericDataTable } from '../../components/data-model-table/editable';

export const ChargingStationSequencesView: React.FC = () => {
  return (
    <GenericView
      dtoClass={ChargingStationSequence}
      gqlQuery={CHARGING_STATION_SEQUENCES_GET_QUERY}
      editMutation={CHARGING_STATION_SEQUENCES_EDIT_MUTATION}
      createMutation={CHARGING_STATION_SEQUENCES_CREATE_MUTATION}
      deleteMutation={CHARGING_STATION_SEQUENCES_DELETE_MUTATION}
    />
  );
};

export const ChargingStationSequencesList = (_props: IDataModelListProps) => {
  return (
    <>
      <GenericDataTable dtoClass={ChargingStationSequence} />
    </>
  );
};

export const routes: React.FC = () => {
  return (
    <Routes>
      <Route index element={<ChargingStationSequencesList />} />
      <Route path="/:id/*" element={<ChargingStationSequencesView />} />
    </Routes>
  );
};

export const resources = [
  {
    name: ResourceType.CHARGING_STATION_SEQUENCES,
    list: '/charging-station-sequences',
    create: '/charging-station-sequences/new',
    show: '/charging-station-sequences/:id',
    edit: '/charging-station-sequences/:id/edit',
    meta: {
      canDelete: true,
    },
    icon: <AiFillDatabase />,
  },
];
