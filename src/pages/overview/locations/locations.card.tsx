// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { AutoComplete, Flex, Input } from 'antd';
import { ArrowRightIcon } from '../../../components/icons/arrow.right.icon';
import { useNavigation } from '@refinedev/core';
import { MenuSection } from '../../../components/main-menu/main.menu';
import { useSelect } from '@refinedev/antd';
import { ResourceType } from '@util/auth';
import { BaseDtoProps } from '../../../dtos/base.dto';
import React from 'react';
import { LOCATIONS_LIST_QUERY } from '../../locations/queries';
import { LocationDto } from '../../../dtos/location.dto';
import { getLocationsFilters } from '../../locations/columns';
import { LocationsMap } from '../../../pages/locations/map/locations.map';

const { Search } = Input;

export const LocationsCard = () => {
  const { push } = useNavigation();

  const { selectProps: locationsSelectProps } = useSelect<LocationDto>({
    resource: ResourceType.LOCATIONS,
    optionLabel: (location) => location.name,
    optionValue: (location) => `${location.id}`,
    meta: {
      gqlQuery: LOCATIONS_LIST_QUERY,
      gqlVariables: {
        offset: 0,
        limit: 5,
      },
    },
    sorters: [{ field: BaseDtoProps.updatedAt, order: 'desc' }],
    pagination: { mode: 'off' },
    onSearch: (value) => getLocationsFilters(value),
  });

  return (
    <Flex
      vertical
      style={{
        height: '100%',
      }}
    >
      <Flex justify="space-between" style={{ padding: '24px 16px' }}>
        <h4>Locations</h4>
        <Flex
          className="link"
          onClick={() => push(`/${MenuSection.LOCATIONS}`)}
        >
          View all <ArrowRightIcon />
        </Flex>
      </Flex>
      {/* <Flex style={{ marginBottom: '24px', padding: '0 16px' }}>
        <Flex flex={7}>
          <AutoComplete
            className="full-width"
            onSelect={(id) => push(`/${MenuSection.TRANSACTIONS}/${id}`)}
            filterOption={false}
            placeholder="Search Transaction"
            {...locationsSelectProps}
          />
        </Flex>
        <Flex flex={3}>
          <span></span>
        </Flex>
      </Flex> */}
      <Flex
        style={{
          height: '100%',
          borderRadius: '0 0 8px 8px',
          overflow: 'hidden',
        }}
      >
        <LocationsMap />
      </Flex>
    </Flex>
  );
};
