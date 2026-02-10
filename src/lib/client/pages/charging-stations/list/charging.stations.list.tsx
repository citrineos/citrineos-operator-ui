// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0
'use client';

import type { ChargingStationDto } from '@citrineos/base';
import { MenuSection } from '@lib/client/components/main-menu/main.menu';
import { ModalComponentType } from '@lib/client/components/modals/modal.types';
import { Table } from '@lib/client/components/table';
import { Button } from '@lib/client/components/ui/button';
import {
  getChargingStationColumns,
  getChargingStationsFilters,
} from '@lib/client/pages/charging-stations/columns';
import { ChargingStationClass } from '@lib/cls/charging.station.dto';
import { CHARGING_STATIONS_LIST_QUERY } from '@lib/queries/charging.stations';
import { ActionType, ResourceType } from '@lib/utils/access.types';
import { AccessDeniedFallback } from '@lib/utils/AccessDeniedFallback';
import { DEFAULT_SORTERS, EMPTY_FILTER } from '@lib/utils/consts';
import { openModal } from '@lib/utils/modal.slice';
import { getPlainToInstanceOptions } from '@lib/utils/tables';
import { CanAccess, useTranslate } from '@refinedev/core';
import { instanceToPlain } from 'class-transformer';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { heading2Style, pageMargin } from '@lib/client/styles/page';
import {
  tableHeaderWrapperFlex,
  tableSearchFlex,
  tableWrapperStyle,
} from '@lib/client/styles/table';
import { buttonIconSize } from '@lib/client/styles/icon';
import { DebounceSearch } from '@lib/client/components/debounce-search';

export const ChargingStationsList = () => {
  const { push } = useRouter();
  const dispatch = useDispatch();
  const translate = useTranslate();

  const [filters, setFilters] = useState<any>(EMPTY_FILTER);

  const showRemoteStartModal = useCallback(
    (station: ChargingStationDto) => {
      dispatch(
        openModal({
          title: translate('ChargingStations.remoteStart'),
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
          title: translate('ChargingStations.remoteStop'),
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
          title: translate('ChargingStations.reset'),
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
      ),
    [
      push,
      showRemoteStartModal,
      handleStopTransactionClick,
      showResetStartModal,
    ],
  );

  const onSearch = (value: string) => {
    setFilters(value ? getChargingStationsFilters(value) : EMPTY_FILTER);
  };

  return (
    <div className={`${pageMargin} ${tableWrapperStyle}`}>
      <div className={tableHeaderWrapperFlex}>
        <h2 className={heading2Style}>
          {translate('ChargingStations.ChargingStations')}
        </h2>
        <div className={tableSearchFlex}>
          <CanAccess
            resource={ResourceType.CHARGING_STATIONS}
            action={ActionType.CREATE}
          >
            <Button
              variant="success"
              onClick={() => push(`/${MenuSection.CHARGING_STATIONS}/new`)}
            >
              <Plus className={buttonIconSize} />
              {translate('buttons.add')}{' '}
              {translate('ChargingStations.chargingStation')}
            </Button>
          </CanAccess>
          <CanAccess
            resource={ResourceType.CHARGING_STATIONS}
            action={ActionType.LIST}
          >
            <DebounceSearch
              onSearch={onSearch}
              placeholder={`${translate('placeholders.search')} ${translate('ChargingStations.ChargingStations')}`}
            />
          </CanAccess>
        </div>
      </div>
      <CanAccess
        resource={ResourceType.CHARGING_STATIONS}
        action={ActionType.LIST}
        fallback={<AccessDeniedFallback />}
      >
        <Table<ChargingStationDto>
          refineCoreProps={{
            resource: ResourceType.CHARGING_STATIONS,
            sorters: DEFAULT_SORTERS,
            filters: {
              permanent: filters,
            },
            meta: {
              gqlQuery: CHARGING_STATIONS_LIST_QUERY,
            },
            queryOptions: {
              ...getPlainToInstanceOptions(ChargingStationClass),
              select: (data: any) => {
                return data;
              },
            },
          }}
          enableSorting
          enableFilters
          showHeader
        >
          {columns}
        </Table>
      </CanAccess>
    </div>
  );
};
