// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { Flex } from 'antd';
import { ArrowRightIcon } from '../../../components/icons/arrow.right.icon';
import { ChargingStationDto } from '../../../dtos/charging.station.dto';
import { ResourceType } from '@util/auth';
import { FAULTED_CHARGING_STATIONS_LIST_QUERY } from '../../charging-stations/queries';
import { getPlainToInstanceOptions } from '@util/tables';
import { useList, useNavigation } from '@refinedev/core';
import { BaseDtoProps } from '../../../dtos/base.dto';
import React from 'react';
import { MenuSection } from '../../../components/main-menu/main.menu';
import { ChargerRow } from '../charger.row';

export const FaultedChargersCard = () => {
  const { push } = useNavigation();

  const { data, isLoading, isError } = useList<ChargingStationDto>({
    resource: ResourceType.CHARGING_STATIONS,
    meta: {
      gqlQuery: FAULTED_CHARGING_STATIONS_LIST_QUERY,
      gqlVariables: {
        offset: 0,
        limit: 10,
      },
    },
    queryOptions: getPlainToInstanceOptions(ChargingStationDto),
    sorters: [{ field: BaseDtoProps.updatedAt, order: 'desc' }],
    pagination: {
      mode: 'off',
    },
  });

  const chargingStations: ChargingStationDto[] = data?.data ?? [];

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Something went wrong!</div>;
  }

  return (
    <Flex vertical gap={16}>
      <Flex justify="space-between">
        <h4>Faulted Chargers</h4>
        <Flex
          className="link"
          onClick={() => push(`/${MenuSection.CHARGING_STATIONS}`)}
        >
          View all <ArrowRightIcon />
        </Flex>
      </Flex>
      <Flex vertical gap={16}>
        {chargingStations.map((chargingStation: ChargingStationDto) => (
          <ChargerRow
            chargingStation={chargingStation}
            key={chargingStation.id}
          />
        ))}
      </Flex>
    </Flex>
  );
};
