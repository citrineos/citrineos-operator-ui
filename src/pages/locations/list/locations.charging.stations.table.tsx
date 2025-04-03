import { LocationDto } from '../../../dtos/location.dto';
import { Flex, Row, Table } from 'antd';
import React, { useCallback, useMemo } from 'react';
import { ChargingStationDto } from '../../../dtos/charging.station.dto';
import { ArrowRightIcon } from '../../../components/icons/arrow.right.icon';
import { useNavigation } from '@refinedev/core';
import { formatDate } from '../../../components/timestamp-display';
import { MenuSection } from '../../../components/main-menu/main.menu';
import { ChargingStationStatusTag } from '../../charging-stations/charging.station.status.tag';
import { useDispatch } from 'react-redux';
import { instanceToPlain } from 'class-transformer';
import { ModalComponentType } from '../../../AppModal';
import { getChargingStationColumns } from '../../charging-stations/columns';
import { openModal } from '../../../redux/modal.slice';

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
    <Table
      rowKey="id"
      className="table nested"
      dataSource={stationsToDisplay}
      showHeader={true} // Show headers for improved usability
    >
     {columns}
    </Table>
  );
};
