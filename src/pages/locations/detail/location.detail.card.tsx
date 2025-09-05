// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { getFullAddress } from '@util/geocoding';
import { Button, Descriptions, Flex, Tag } from 'antd';
import { useLocation } from 'react-router-dom';
import { ArrowLeftIcon } from '../../../components/icons/arrow.left.icon';
import { MenuSection } from '../../../components/main-menu/main.menu';
import { CanAccess, useNavigation } from '@refinedev/core';
import { ActionType, ResourceType } from '@util/auth';
import { ILocationDto } from '@citrineos/base';

const createLocationItem = (label: string, value: string) => {
  return <Descriptions.Item label={label}>{value}</Descriptions.Item>;
};

export interface LocationDetailCardProps {
  location: ILocationDto;
}

export const LocationDetailCard = ({ location }: LocationDetailCardProps) => {
  const { goBack, push } = useNavigation();
  const pageLocation = useLocation();

  return (
    <Flex gap={16}>
      <Flex gap={16} vertical flex="1 1 auto">
        <Flex gap={12} align={'center'}>
          <ArrowLeftIcon
            onClick={() => {
              if (pageLocation.key === 'default') {
                push(`/${MenuSection.LOCATIONS}`);
              } else {
                goBack();
              }
            }}
            style={{ cursor: 'pointer' }}
          />
          <h3>{location.name}</h3>
          <CanAccess
            resource={ResourceType.LOCATIONS}
            action={ActionType.EDIT}
            params={{ id: location.id }}
          >
            <Button
              className="secondary"
              onClick={() =>
                push(`/${MenuSection.LOCATIONS}/${location.id}/edit`)
              }
            >
              Edit Location
            </Button>
          </CanAccess>
        </Flex>
        <Flex justify="space-between" gap={16}>
          <Flex vertical gap={32}>
            <Descriptions
              layout="vertical"
              colon={false}
              classNames={{
                label: 'description-label',
              }}
            >
              <Descriptions.Item label="Address">
                {getFullAddress(location)}
              </Descriptions.Item>
              <Descriptions.Item label="Coordinates">
                {location.coordinates
                  ? `${location.coordinates.coordinates[1]} ${location.coordinates.coordinates[0]}`
                  : 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Time Zone">
                {location.timeZone}
              </Descriptions.Item>
              <Descriptions.Item label="Parking Type">
                {location.parkingType ?? 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Facilities">
                {location.facilities
                  ? location.facilities.map((facility) => <Tag>{facility}</Tag>)
                  : 'N/A'}
              </Descriptions.Item>
            </Descriptions>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};
