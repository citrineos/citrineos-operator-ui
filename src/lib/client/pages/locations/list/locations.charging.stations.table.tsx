// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0
'use client';

import type { ChargingStationDto, LocationDto } from '@citrineos/base';
import { MenuSection } from '@lib/client/components/main-menu/main.menu';
import { ModalComponentType } from '@lib/client/components/modals/modal.types';
import { Table } from '@lib/client/components/table';
import { Button } from '@lib/client/components/ui/button';
import { getChargingStationColumns } from '@lib/client/pages/charging-stations/columns';
import { ActionType, ResourceType } from '@lib/utils/access.types';
import { AccessDeniedFallback } from '@lib/utils/AccessDeniedFallback';
import { openModal } from '@lib/utils/modal.slice';
import { CanAccess } from '@refinedev/core';
import { instanceToPlain } from 'class-transformer';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { heading3Style, pageFlex } from '@lib/client/styles/page';
import { cardHeaderFlex } from '@lib/client/styles/card';
import { buttonIconSize } from '@lib/client/styles/icon';

export interface LocationsChargingStationsTableProps {
  location: LocationDto;
  showHeader?: boolean;
}

export const LocationsChargingStationsTable = ({
  location,
  showHeader = false,
}: LocationsChargingStationsTableProps) => {
  const { push } = useRouter();
  const dispatch = useDispatch();

  // Use filteredStations if provided, otherwise use all stations from the location
  const stationsToDisplay = location.chargingPool || undefined;

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
    <div className={pageFlex}>
      {showHeader && (
        <div className={cardHeaderFlex}>
          <h3 className={heading3Style}>Charging Stations</h3>
          <CanAccess
            resource={ResourceType.CHARGING_STATIONS}
            action={ActionType.CREATE}
          >
            <Button
              variant="success"
              size="sm"
              onClick={() =>
                push(
                  `/${MenuSection.CHARGING_STATIONS}/new?locationId=${location.id}`,
                )
              }
            >
              <Plus className={buttonIconSize} />
              Add
            </Button>
          </CanAccess>
        </div>
      )}
      <CanAccess
        resource={ResourceType.CHARGING_STATIONS}
        action={ActionType.LIST}
        fallback={<AccessDeniedFallback />}
      >
        <Table data={stationsToDisplay || []} useClientData showToolbar={false}>
          {columns}
        </Table>
      </CanAccess>
    </div>
  );
};
