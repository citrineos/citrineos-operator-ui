// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { Button, Flex, GetProps, Input, Row, Table } from 'antd';
import React, { useMemo, useState, useEffect } from 'react';
import { LOCATIONS_LIST_QUERY } from '../queries';
import './style.scss';
import { ArrowDownIcon } from '../../../components/icons/arrow.down.icon';
import { LocationsChargingStationsTable } from './locations.charging.stations.table';
import { useTable } from '@refinedev/antd';
import { DEFAULT_SORTERS } from '../../../components/defaults';
import { CanAccess, useNavigation } from '@refinedev/core';
import { getPlainToInstanceOptions } from '@util/tables';
import { DebounceSearch } from '../../../components/debounce-search';
import { getLocationAndStationsFilters, getLocationsColumns } from '../columns';
import { EMPTY_FILTER } from '@util/consts';
import { MenuSection } from '../../../components/main-menu/main.menu';
import { AccessDeniedFallback, ActionType, ResourceType } from '@util/auth';
import { ILocationDto, IChargingStationDto } from '@citrineos/base';
import { LocationDto } from '../../../dtos/location.dto';
import { PlusOutlined } from '@ant-design/icons';

type SearchProps = GetProps<typeof Input.Search>;

export const LocationsList = () => {
  const [expandedRowByToggle, setExpandedRowByToggle] = useState<number>();
  const [searchValue, setSearchValue] = useState<string>('');
  const [filteredStationsByLocation, setFilteredStationsByLocation] = useState<
    Record<string, IChargingStationDto[]>
  >({});
  const [expandedRowKeys, setExpandedRowKeys] = useState<React.Key[]>([]);
  const { push } = useNavigation();

  const { tableProps, setFilters } = useTable<ILocationDto>({
    resource: ResourceType.LOCATIONS,
    sorters: DEFAULT_SORTERS,
    meta: {
      gqlQuery: LOCATIONS_LIST_QUERY,
    },
    queryOptions: getPlainToInstanceOptions(LocationDto),
  });

  const handleExpandToggle = (record: ILocationDto) => {
    const isCurrentlyExpanded = expandedRowKeys.includes(record.id!);

    if (isCurrentlyExpanded) {
      // Remove this location from expanded rows
      setExpandedRowKeys((prevKeys) =>
        prevKeys.filter((key) => key !== record.id),
      );
      setExpandedRowByToggle(undefined);
    } else {
      // Add this location to expanded rows
      setExpandedRowKeys((prevKeys) => [...prevKeys, record.id!]);
      setExpandedRowByToggle(record.id!);
    }
  };

  const onSearch: SearchProps['onSearch'] = (value, _e?, _info?) => {
    setSearchValue(value);

    if (!value || value === '') {
      setFilters(EMPTY_FILTER);
      setFilteredStationsByLocation({});
      // Reset expansion state when search is cleared
      setExpandedRowKeys([]);
      setExpandedRowByToggle(undefined);

      // Ensure all rows are collapsed when search is reset
      if (tableProps.dataSource) {
        const allLocations = tableProps.dataSource as ILocationDto[];
        setExpandedRowKeys([]);
      }
    } else {
      // Use Hasura's nested filtering capabilities through the backend
      setFilters(getLocationAndStationsFilters(value));

      // Update matching stations and expand relevant rows
      updateMatchingStations(value);
    }
  };

  // Find and highlight matching charging stations and expand their locations
  const updateMatchingStations = (value: string | undefined) => {
    if (!value) {
      setFilteredStationsByLocation({});
      setExpandedRowKeys([]);
      return;
    }

    const matchedStations: Record<string, IChargingStationDto[]> = {};
    const newExpandedKeys: React.Key[] = [];
    const lowercaseValue = value.toLowerCase();

    // Find matching stations for each location
    tableProps.dataSource?.forEach((location: ILocationDto) => {
      if (!location.chargingPool?.length) return;

      const matchingStations = location.chargingPool.filter(
        (station: IChargingStationDto) =>
          // Match against station ID
          (station.id && station.id.toLowerCase().includes(lowercaseValue)) ||
          // Match against online status
          (typeof station.isOnline === 'boolean' &&
            (station.isOnline ? 'online' : 'offline').includes(
              lowercaseValue,
            )) ||
          // Match against status notifications if available
          station.statusNotifications?.[0]?.connectorStatus
            ?.toLowerCase()
            .includes(lowercaseValue),
      );

      if (matchingStations.length > 0 && location.id !== undefined) {
        matchedStations[location.id] = matchingStations;
        // Automatically expand locations with matching stations
        newExpandedKeys.push(location.id);
      }
    });

    setFilteredStationsByLocation(matchedStations);
    setExpandedRowKeys(newExpandedKeys);
  };

  // Update highlighted stations when data changes
  useEffect(() => {
    if (searchValue) {
      updateMatchingStations(searchValue);
    } else {
      // If there's no search value, ensure nothing is expanded
      setExpandedRowKeys([]);
      setFilteredStationsByLocation({});
    }
  }, [searchValue]);

  // Determine if a location should be highlighted based on search results
  const shouldHighlightLocation = (record: ILocationDto): boolean => {
    return !!filteredStationsByLocation[record.id!]?.length;
  };

  // With backend filtering, all returned locations should be shown
  // This function is kept for compatibility but is simplified
  const shouldShowLocation = (record: ILocationDto): boolean => {
    return true; // Backend filtering handles which locations to show
  };

  // Get expanded row keys
  const getExpandedRowKeys = (): React.Key[] => {
    const keys: React.Key[] = [];

    // Include manually expanded row
    if (expandedRowByToggle) {
      keys.push(expandedRowByToggle);
    }

    // Include rows with matching charging stations
    Object.keys(filteredStationsByLocation).forEach((locationId) => {
      if (!keys.includes(locationId)) {
        keys.push(locationId);
      }
    });

    return keys;
  };

  const columns = useMemo(() => getLocationsColumns(push), []);

  return (
    <Flex vertical>
      <Flex justify="space-between" align="middle" className="header-row">
        <h2>Locations</h2>
        <Flex>
          <CanAccess
            resource={ResourceType.LOCATIONS}
            action={ActionType.CREATE}
          >
            <Button
              className="success"
              icon={<PlusOutlined />}
              iconPosition="end"
              style={{ marginRight: '20px' }}
              onClick={() => push(`/${MenuSection.LOCATIONS}/new`)}
            >
              Add Location
            </Button>
          </CanAccess>
          <DebounceSearch onSearch={onSearch} placeholder="Search Locations" />
        </Flex>
      </Flex>
      <CanAccess
        resource={ResourceType.LOCATIONS}
        action={ActionType.LIST}
        fallback={<AccessDeniedFallback />}
      >
        <Table
          rowKey="id"
          {...tableProps}
          showHeader={true}
          expandable={{
            expandIconColumnIndex: -1,
            expandedRowRender: (record: ILocationDto) => {
              return (
                <LocationsChargingStationsTable
                  location={record}
                  filteredStations={filteredStationsByLocation[record.id!]}
                />
              );
            },
            expandedRowKeys: expandedRowKeys,
            onExpandedRowsChange: (expandedRows) => {
              setExpandedRowKeys([...expandedRows]);

              // Clear the toggle state if the previously toggled row is collapsed
              if (
                expandedRowByToggle &&
                !expandedRows.includes(expandedRowByToggle)
              ) {
                setExpandedRowByToggle(undefined);
              }
            },
          }}
          rowClassName={(record: ILocationDto) =>
            shouldHighlightLocation(record) ? 'selected-row' : ''
          }
        >
          {columns}
          <Table.Column
            key="actions"
            dataIndex="actions"
            title=""
            width="15%"
            onCell={() => ({
              className: 'column-actions',
            })}
            render={(_: any, record: ILocationDto) => (
              <Row
                className="view-charging-stations"
                justify="end"
                align="middle"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent event propagation
                  handleExpandToggle(record);
                }}
              >
                View Stations
                <ArrowDownIcon
                  className={
                    expandedRowKeys.includes(record.id!)
                      ? 'arrow rotate'
                      : 'arrow'
                  }
                />
              </Row>
            )}
          />
        </Table>
      </CanAccess>
    </Flex>
  );
};
