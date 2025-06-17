// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { getFullAddress } from '@util/geocoding';
import { Button, Flex } from 'antd';
import { useLocation } from 'react-router-dom';
import { ArrowLeftIcon } from '../../../components/icons/arrow.left.icon';
import { MenuSection } from '../../../components/main-menu/main.menu';
import { LocationIcon } from '../../../components/map';
import { CanAccess, useNavigation } from '@refinedev/core';
import { LocationDto } from '../../../dtos/location.dto';
import { PlusIcon } from '../../../components/icons/plus.icon';
import { ActionType, ResourceType } from '@util/auth';

export interface LocationDetailCardProps {
  location: LocationDto;
}

export const LocationDetailCard = ({ location }: LocationDetailCardProps) => {
  const { goBack, push } = useNavigation();
  const pageLocation = useLocation();

  return (
    <Flex gap={16}>
      <Flex
        vertical
        flex={'0 0 25%'}
        align={'center'}
        justify={'center'}
        style={{
          background: '#D9D9D9',
          color: '#C3BDB9',
          borderRadius: 8,
        }}
      >
        <div className="image-placeholder">
          <LocationIcon width={100} height={100} />
        </div>
      </Flex>
      <Flex vertical flex="1 1 auto">
        <Flex gap={8} align={'center'} style={{ marginBottom: 16 }}>
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
        </Flex>
        <Flex justify="space-between" gap={16}>
          <Flex vertical gap={32}>
            <table className="location-details-table">
              <tbody>
                <tr>
                  <td>
                    <strong>Address</strong>
                  </td>
                  <td>{getFullAddress(location)}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Geocoordinates</strong>
                  </td>
                  <td>
                    {location.coordinates
                      ? `${location.coordinates.latitude} ${location.coordinates.longitude}`
                      : 'Not available'}
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>Tenant</strong>
                  </td>
                  <td>Tenant</td>
                </tr>
                <tr>
                  <td>
                    <strong>Hours of Operation</strong>
                  </td>
                  <td>Hours of Operation</td>
                </tr>
                <tr>
                  <td>
                    <strong>Location Type</strong>
                  </td>
                  <td>Location Type</td>
                </tr>
                <tr>
                  <td>
                    <strong>Commissioning Status</strong>
                  </td>
                  <td>Needs Configurations</td>
                </tr>
              </tbody>
            </table>
          </Flex>
        </Flex>
        <Flex style={{ marginTop: '32px' }}>
          <Flex gap={16} justify="space-between" align="center" flex="1 1 auto">
            <Flex>
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
                  Edit Charging Location
                </Button>
              </CanAccess>
            </Flex>
          </Flex>
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
