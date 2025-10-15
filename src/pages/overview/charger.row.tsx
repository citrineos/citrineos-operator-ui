// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { Flex } from 'antd';
import { useNavigation } from '@refinedev/core';
import { Circle } from './circle/circle';
import React from 'react';
import { MenuSection } from '../../components/main-menu/main.menu';
import { IChargingStationDto } from '@citrineos/base';
import { IEvseDto } from '@citrineos/base';
import { ChargerStatusEnum } from './charger-activity/charger.activity.card';

export interface ChargerRowProps {
  chargingStation: IChargingStationDto;
  evse?: IEvseDto;
  lastStatus?: ChargerStatusEnum;
  circleColor?: string;
}

export const ChargerRow: React.FC<ChargerRowProps> = ({
  chargingStation,
  evse,
  lastStatus,
  circleColor,
}) => {
  const { push } = useNavigation();
  const label = evse
    ? `${chargingStation.id}:EVSE ${evse.id}`
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
            <Circle color={circleColor} status={lastStatus} />
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
