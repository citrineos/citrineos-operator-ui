import { Flex } from 'antd';
import { useNavigation } from '@refinedev/core';
import { Circle, CircleStatusEnum } from './circle/circle';
import React from 'react';
import { ChargingStationDto } from '../../dtos/charging.station.dto';
import { MenuSection } from '../../components/main-menu/main.menu';

export interface ChargerRowProps {
  chargingStation: ChargingStationDto;
  circleColor?: string;
}

export const ChargerRow = ({
  chargingStation,
  circleColor,
}: ChargerRowProps) => {
  const { push } = useNavigation();

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
              Station: <span className="link">{chargingStation.id}</span>
            </strong>
            <div style={{ width: '8px' }} />
            <Circle
              color={circleColor}
              status={
                CircleStatusEnum.ERROR
                // TODO: implement different possible status colors, such as CircleStatusEnum.WARNING
              }
            />
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
