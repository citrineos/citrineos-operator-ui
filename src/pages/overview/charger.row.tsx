// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { Flex } from 'antd';
import { useNavigation } from '@refinedev/core';
import { Circle, CircleStatusEnum } from './circle/circle';
import React from 'react';
import { MenuSection } from '../../components/main-menu/main.menu';
import { IChargingStationDto } from '../../../../citrineos-core/00_Base/src/interfaces/dto/charging.station.dto';
import { IEvseDto } from '../../../../citrineos-core/00_Base/src/interfaces/dto/evse.dto';

export interface ChargerRowProps {
  chargingStation: IChargingStationDto;
  evse?: IEvseDto;
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
            push(`/${MenuSection.LOCATIONS}/${chargingStation.location?.id}`)
          }
        >
          <div>
            Location:{' '}
            <span className="link">{chargingStation.location?.name}</span>
          </div>
        </Flex>
      </Flex>
    </Flex>
  );
};
