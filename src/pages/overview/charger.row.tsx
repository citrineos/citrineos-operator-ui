// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { Flex } from 'antd';
import { useNavigation } from '@refinedev/core';
import { Circle, CircleStatusEnum } from './circle/circle';
import React from 'react';
import { ChargingStationDto } from '../../dtos/charging.station.dto';
import { EvseDto } from 'src/dtos/evse.dto';
import { MenuSection } from '../../components/main-menu/main.menu';

export interface ChargerRowProps {
  chargingStation: ChargingStationDto;
  evse?: EvseDto;
  circleColor?: string;
}

export const ChargerRow: React.FC<ChargerRowProps> = ({
  chargingStation,
  evse,
  circleColor,
}) => {
  const { push } = useNavigation();
  const label = evse
    ? `${chargingStation.id}:EVSE ${evse.connectorId}`
    : chargingStation.id;

  return (
    <Flex>
      <Flex vertical flex={1}>
        <Flex
          justify="space-between"
          onClick={() =>
            push(`/${MenuSection.CHARGING_STATIONS}/${chargingStation.id}`)
          }
        >
          <Flex align="center">
            <strong>
              Station: <span className="link">{label}</span>
            </strong>
            <div style={{ width: '8px' }} />
            <Circle color={circleColor} status={CircleStatusEnum.ERROR} />
          </Flex>
        </Flex>
        <Flex
          justify="space-between"
          onClick={() =>
            push(`/${MenuSection.LOCATIONS}/${chargingStation.Location?.id}`)
          }
        >
          <div>
            Location:{' '}
            <span className="link">{chargingStation.Location?.name}</span>
          </div>
        </Flex>
      </Flex>
    </Flex>
  );
};
