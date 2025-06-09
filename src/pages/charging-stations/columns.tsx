// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { Button, Flex, Table, Typography } from 'antd';
import {
  ChargingStationDto,
  ChargingStationDtoProps,
} from '../../dtos/charging.station.dto';
import React from 'react';
import { CanAccess, CrudFilter } from '@refinedev/core';
import { LocationDtoProps } from '../../dtos/location.dto';
import { MenuSection } from '../../components/main-menu/main.menu';
import { InfoCircleOutlined } from '@ant-design/icons';
import {
  AccessDeniedFallback,
  ActionType,
  ChargingStationAccessType,
  CommandType,
  ResourceType,
} from '@util/auth';

export const getChargingStationColumns = (
  push: (path: string, ...rest: unknown[]) => void,
  showRemoteStartModal: (station: ChargingStationDto) => void,
  handleStopTransactionClick: (station: ChargingStationDto) => void,
  showResetStartModal: (station: ChargingStationDto) => void,
  options?: {
    includeLocationColumn?: boolean;
  },
) => {
  // Default to showing the location column unless explicitly set to false
  const includeLocationColumn = options?.includeLocationColumn !== false;

  const columns = [
    <Table.Column
      key={ChargingStationDtoProps.id}
      dataIndex={ChargingStationDtoProps.id}
      title="ID"
      sorter={true}
      onCell={(record) => ({
        className: `column-${ChargingStationDtoProps.id}`,
        onClick: (event: React.MouseEvent) => {
          const path = `/${MenuSection.CHARGING_STATIONS}/${record.id}`;

          // If Ctrl key (or Command key on Mac) is pressed, open in new window/tab
          if (event.ctrlKey || event.metaKey) {
            window.open(path, '_blank');
          } else {
            // Default behavior - navigate in current window
            push(path);
          }
        },
        style: { cursor: 'pointer' },
      })}
      render={(_: any, record: ChargingStationDto) => {
        return <h4>{record.id}</h4>;
      }}
    />,
  ];

  // Conditionally add the location column
  if (includeLocationColumn) {
    columns.push(
      <Table.Column
        key={ChargingStationDtoProps.location}
        dataIndex={ChargingStationDtoProps.location}
        title="Location"
        onCell={(record) => ({
          className: `column-${LocationDtoProps.name}`,
          onClick: (event: React.MouseEvent) => {
            const path = `/${MenuSection.LOCATIONS}/${record.location?.id}`;

            // If Ctrl key (or Command key on Mac) is pressed, open in new window/tab
            if (event.ctrlKey || event.metaKey) {
              window.open(path, '_blank');
            } else {
              // Default behavior - navigate in current window
              push(path);
            }
          },
          style: { cursor: 'pointer' },
        })}
        render={(_: any, record: ChargingStationDto) => {
          return <h4>{record.location?.name}</h4>;
        }}
      />,
    );
  }

  // Add the remaining columns
  columns.push(
    <Table.Column
      key={ChargingStationDtoProps.latestStatusNotifications}
      dataIndex={ChargingStationDtoProps.latestStatusNotifications}
      title="Status"
      onCell={() => ({
        className: `column-${ChargingStationDtoProps.latestStatusNotifications}`,
      })}
      render={(_: any, record: ChargingStationDto) => {
        return (
          <span className={record.isOnline ? 'online' : 'offline'}>
            {record.isOnline ? 'Online' : 'Offline'}
          </span>
        );
      }}
    />,
    <Table.Column
      key="actions"
      dataIndex="actions"
      title="Actions"
      onCell={() => ({
        className: 'column-actions',
      })}
      render={(_: any, record: ChargingStationDto) => {
        const hasActiveTransactions =
          record.transactions && record.transactions.length > 0;

        return record.isOnline ? (
          <CanAccess
            resource={ResourceType.CHARGING_STATIONS}
            action={ActionType.COMMAND}
            params={{
              id: record.id,
            }}
          >
            <Flex gap={16} flex="1 1 auto">
              {!hasActiveTransactions && (
                <CanAccess
                  resource={ResourceType.CHARGING_STATIONS}
                  action={ActionType.COMMAND}
                  params={{
                    id: record.id,
                    commandType: CommandType.START_TRANSACTION,
                  }}
                >
                  <Button onClick={() => showRemoteStartModal(record)}>
                    Start Transaction
                  </Button>
                </CanAccess>
              )}
              {hasActiveTransactions && (
                <CanAccess
                  resource={ResourceType.CHARGING_STATIONS}
                  action={ActionType.COMMAND}
                  params={{
                    id: record.id,
                    commandType: CommandType.STOP_TRANSACTION,
                  }}
                >
                  <Button onClick={() => handleStopTransactionClick(record)}>
                    Stop Transaction
                  </Button>
                </CanAccess>
              )}
              <CanAccess
                resource={ResourceType.CHARGING_STATIONS}
                action={ActionType.COMMAND}
                params={{
                  id: record.id,
                  commandType: CommandType.RESET,
                }}
              >
                <Button onClick={() => showResetStartModal(record)}>
                  Reset
                </Button>
              </CanAccess>
            </Flex>
          </CanAccess>
        ) : (
          <Flex gap={16} flex="1 1 auto" align="center">
            <Typography.Text type="secondary">
              <InfoCircleOutlined style={{ marginRight: 8 }} />
              Station offline - commands unavailable
            </Typography.Text>
          </Flex>
        );
      }}
    />,
  );

  return columns;
};

export const getChargingStationsFilters = (value: string): CrudFilter[] => {
  return [
    {
      operator: 'or',
      value: [
        {
          field: ChargingStationDtoProps.id,
          operator: 'contains',
          value,
        },
        {
          field: `Location.${LocationDtoProps.name}`,
          operator: 'contains',
          value,
        },
      ],
    },
  ];
};
