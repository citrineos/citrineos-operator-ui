// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { getFullAddress } from '@util/geocoding';
import { Button, Descriptions, Flex, Tag } from 'antd';
import { useLocation } from 'react-router-dom';
import { ArrowLeftIcon } from '../../../components/icons/arrow.left.icon';
import { MenuSection } from '../../../components/main-menu/main.menu';
import { CanAccess, useNavigation } from '@refinedev/core';
import { ActionType, ResourceType } from '@util/auth';
import { ILocationDto } from '@citrineos/base';
import { EditOutlined } from '@ant-design/icons';
import { NOT_APPLICABLE } from '@util/consts';

export interface LocationDetailCardProps {
  location: ILocationDto;
}

export const LocationDetailCard = ({ location }: LocationDetailCardProps) => {
  const { goBack, push } = useNavigation();
  const pageLocation = useLocation();

  return (
    <Flex gap={16}>
      <Flex gap={16} vertical flex="1 1 auto">
        <Flex gap={16} align={'center'}>
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
              className="secondary btn-md"
              icon={<EditOutlined />}
              iconPosition="end"
              onClick={() =>
                push(`/${MenuSection.LOCATIONS}/${location.id}/edit`)
              }
            >
              Edit
            </Button>
          </CanAccess>
        </Flex>
        <Descriptions
          layout="vertical"
          column={{ xs: 1, sm: 2, md: 3, lg: 3, xl: 4, xxl: 5 }}
          colon={false}
          classNames={{
            label: 'description-label',
          }}
        >
          <Descriptions.Item label="Address">
            {getFullAddress(location)}
          </Descriptions.Item>
          <Descriptions.Item label="Latitude">
            {location?.coordinates
              ? location.coordinates.coordinates[1].toFixed(4)
              : NOT_APPLICABLE}
          </Descriptions.Item>
          <Descriptions.Item label="Longitude">
            {location?.coordinates
              ? location.coordinates.coordinates[0].toFixed(4)
              : NOT_APPLICABLE}
          </Descriptions.Item>
          <Descriptions.Item label="Time Zone">
            {location.timeZone}
          </Descriptions.Item>
          <Descriptions.Item label="Parking Type">
            {location.parkingType ?? NOT_APPLICABLE}
          </Descriptions.Item>
          <Descriptions.Item label="Facilities">
            {location.facilities
              ? location.facilities.map((facility) => <Tag>{facility}</Tag>)
              : NOT_APPLICABLE}
          </Descriptions.Item>
          <Descriptions.Item label="Total Chargers">
            {location.chargingPool?.length ?? 0}
          </Descriptions.Item>
        </Descriptions>
      </Flex>
    </Flex>
  );
};
