// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { getFullAddress } from '@util/geocoding';
import { Button, Descriptions, Flex } from 'antd';
import { useLocation } from 'react-router-dom';
import { ArrowLeftIcon } from '../../../components/icons/arrow.left.icon';
import { MenuSection } from '../../../components/main-menu/main.menu';
import { CanAccess, useNavigation } from '@refinedev/core';
import { PlusIcon } from '../../../components/icons/plus.icon';
import { ActionType, ResourceType } from '@util/auth';
import { ILocationDto } from '@citrineos/base';

const createLocationItem = (label: string, value: string) => {
  return (
    <Descriptions.Item label={<strong>{label}</strong>}>
      {value}
    </Descriptions.Item>
  );
};

export interface LocationDetailCardProps {
  location: ILocationDto;
}

export const LocationDetailCard = ({ location }: LocationDetailCardProps) => {
  const { goBack, push } = useNavigation();
  const pageLocation = useLocation();

  return (
    <Flex gap={16}>
      <Flex vertical flex="1 1 auto">
        <Flex gap={12} align={'center'} style={{ marginBottom: 16 }}>
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
            <Descriptions size="small" layout="vertical">
              {createLocationItem('Address', getFullAddress(location))}
              {createLocationItem(
                'Coordinates',
                location.coordinates
                  ? `${location.coordinates.coordinates[1]} ${location.coordinates.coordinates[0]}`
                  : 'N/A',
              )}
              {createLocationItem('Time Zone', location.timeZone)}
            </Descriptions>
          </Flex>
        </Flex>
        <Flex style={{ marginTop: '32px' }}>
          <Flex>
            <CanAccess
              resource={ResourceType.CHARGING_STATIONS}
              action={ActionType.CREATE}
            >
              <Button
                className="secondary"
                onClick={() =>
                  push(
                    `/${MenuSection.CHARGING_STATIONS}/new?locationId=${location.id}`,
                  )
                }
              >
                Add New Charging Station
                <PlusIcon />
              </Button>
            </CanAccess>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};
