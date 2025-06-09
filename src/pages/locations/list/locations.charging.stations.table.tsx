// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { LocationDto } from '../../../dtos/location.dto';
import { Flex, Row, Table } from 'antd';
import React, { useCallback, useMemo } from 'react';
import { ChargingStationDto } from '../../../dtos/charging.station.dto';
import { ArrowRightIcon } from '../../../components/icons/arrow.right.icon';
import { CanAccess, useNavigation } from '@refinedev/core';
import { formatDate } from '../../../components/timestamp-display';
import { MenuSection } from '../../../components/main-menu/main.menu';
import { ChargingStationStatusTag } from '../../charging-stations/charging.station.status.tag';
import { useDispatch } from 'react-redux';
import { instanceToPlain } from 'class-transformer';
import { ModalComponentType } from '../../../AppModal';
import { getChargingStationColumns } from '../../charging-stations/columns';
import { openModal } from '../../../redux/modal.slice';
import { ResourceType, ActionType, AccessDeniedFallback } from '@util/auth';

export interface LocationsChargingStationsTableProps {
  location: LocationDto;
  filteredStations?: ChargingStationDto[]; // Added prop for filtered stations
}

export const LocationsChargingStationsTable = ({
  location,
  filteredStations, // Accept filtered stations prop
}: LocationsChargingStationsTableProps) => {
  const { push } = useNavigation();
  const dispatch = useDispatch();

  // Use filteredStations if provided, otherwise use all stations from the location
  const stationsToDisplay = filteredStations || location.chargingStations;

  const showRemoteStartModal = useCallback(
    (station: ChargingStationDto) => {
      dispatch(
        openModal({
          title: 'Remote Start',
          modalComponentType: ModalComponentType.remoteStart,
          modalComponentProps: { station: instanceToPlain(station) },
        }),
      );
    },
    [dispatch],
  );

  const handleStopTransactionClick = useCallback(
    (station: ChargingStationDto) => {
      dispatch(
        openModal({
          title: 'Remote Stop',
          modalComponentType: ModalComponentType.remoteStop,
          modalComponentProps: {
            station: instanceToPlain(station),
          },
        }),
      );
    },
    [dispatch],
  );

  const showResetStartModal = useCallback(
    (station: ChargingStationDto) => {
      dispatch(
        openModal({
          title: 'Reset',
          modalComponentType: ModalComponentType.reset,
          modalComponentProps: { station: instanceToPlain(station) },
        }),
      );
    },
    [dispatch],
  );

  const columns = useMemo(
    () =>
      getChargingStationColumns(
        push,
        showRemoteStartModal,
        handleStopTransactionClick,
        showResetStartModal,
        { includeLocationColumn: false },
      ),
    [
      push,
      showRemoteStartModal,
      handleStopTransactionClick,
      showResetStartModal,
    ],
  );

  return (
    <CanAccess
      resource={ResourceType.CHARGING_STATIONS}
      action={ActionType.LIST}
      fallback={<AccessDeniedFallback />}
    >
      <Table
        rowKey="id"
        className="table nested"
        dataSource={stationsToDisplay}
        showHeader={true}
      >
        {columns}
      </Table>
    </CanAccess>
  );
};
