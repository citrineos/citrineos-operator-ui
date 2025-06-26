// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { Button, Col, GetProps, Input, Row, Table } from 'antd';
import React, { useCallback, useMemo } from 'react';
import { CHARGING_STATIONS_LIST_QUERY } from '../queries';
import './style.scss';
import { useTable } from '@refinedev/antd';
import { AccessDeniedFallback, ResourceType } from '@util/auth';
import { DEFAULT_SORTERS } from '../../../components/defaults';
import { PlusIcon } from '../../../components/icons/plus.icon';
import { CanAccess, useNavigation } from '@refinedev/core';
import { ChargingStationDto } from '../../../dtos/charging.station.dto';
import { getPlainToInstanceOptions } from '@util/tables';
import {
  getChargingStationColumns,
  getChargingStationsFilters,
} from '../columns';
import { DebounceSearch } from '../../../components/debounce-search';
import { EMPTY_FILTER } from '@util/consts';
import { MenuSection } from '../../../components/main-menu/main.menu';
import { instanceToPlain } from 'class-transformer';
import { ModalComponentType } from '../../../AppModal';
import { useDispatch } from 'react-redux';
import { openModal } from '../../../redux/modal.slice';
import { ActionType } from '@util/auth';

type SearchProps = GetProps<typeof Input.Search>;

export const ChargingStationsList = () => {
  const { push } = useNavigation();
  const dispatch = useDispatch();

  const { tableProps, setFilters } = useTable<ChargingStationDto>({
    resource: ResourceType.CHARGING_STATIONS,
    sorters: DEFAULT_SORTERS,
    metaData: {
      gqlQuery: CHARGING_STATIONS_LIST_QUERY,
    },
    queryOptions: getPlainToInstanceOptions(ChargingStationDto),
  });

  const onSearch: SearchProps['onSearch'] = (value, _e?, _info?) => {
    if (!value || value === '') {
      setFilters(EMPTY_FILTER);
    } else {
      setFilters(getChargingStationsFilters(value));
    }
  };

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
      <Col>
        <Row justify="space-between" align="middle" className="header-row">
          <h2>Charging Stations</h2>
          <Row>
            <CanAccess
              resource={ResourceType.CHARGING_STATIONS}
              action={ActionType.CREATE}
            >
              <Button
                type="primary"
                style={{ marginRight: '20px' }}
                onClick={() => push(`/${MenuSection.CHARGING_STATIONS}/new`)}
              >
                Add New Charging Station
                <PlusIcon />
              </Button>
            </CanAccess>
            <DebounceSearch
              onSearch={onSearch}
              placeholder="Search Charging Stations"
            />
          </Row>
        </Row>
        <Table rowKey="id" {...tableProps}>
          {columns}
        </Table>
      </Col>
    </CanAccess>
  );
};
