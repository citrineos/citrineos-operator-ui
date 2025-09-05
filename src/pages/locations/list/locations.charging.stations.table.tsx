// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { Button, Flex, Table } from 'antd';
import React, { useCallback, useMemo } from 'react';
import { CanAccess, useNavigation } from '@refinedev/core';
import { useDispatch } from 'react-redux';
import { instanceToPlain } from 'class-transformer';
import { ModalComponentType } from '../../../AppModal';
import { getChargingStationColumns } from '../../charging-stations/columns';
import { openModal } from '../../../redux/modal.slice';
import { ResourceType, ActionType, AccessDeniedFallback } from '@util/auth';
import { ILocationDto, IChargingStationDto } from '@citrineos/base';
import { MenuSection } from '../../../components/main-menu/main.menu';
import { PlusIcon } from '../../../components/icons/plus.icon';

export interface LocationsChargingStationsTableProps {
  location: ILocationDto;
  filteredStations?: IChargingStationDto[]; // Added prop for filtered stations
}

export const LocationsChargingStationsTable = ({
  location,
  filteredStations, // Accept filtered stations prop
}: LocationsChargingStationsTableProps) => {
  const { push } = useNavigation();
  const dispatch = useDispatch();

  // Use filteredStations if provided, otherwise use all stations from the location
  const stationsToDisplay = filteredStations || location.chargingPool;

  const showRemoteStartModal = useCallback(
    (station: IChargingStationDto) => {
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
    (station: IChargingStationDto) => {
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
    (station: IChargingStationDto) => {
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
    <Flex vertical gap={16}>
      <Flex gap={12} align={'center'}>
        <h4>Charging Stations</h4>
        <CanAccess
          resource={ResourceType.CHARGING_STATIONS}
          action={ActionType.CREATE}
        >
          <Button
            className="secondary"
            onClick={() =>
              push(
                `/${MenuSection.CHARGING_STATIONS}/new?locationId=${location.id}`,
              )
            }
          >
            <Flex gap={4} align={'center'}>
              Add New Charging Station
              <PlusIcon />
            </Flex>
          </Button>
        </CanAccess>
      </Flex>
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
    </Flex>
  );
};
