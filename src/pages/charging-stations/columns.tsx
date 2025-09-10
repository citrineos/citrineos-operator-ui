// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { Button, Flex, Table, Tag, Typography } from 'antd';
import { CanAccess, CrudFilter } from '@refinedev/core';
import { MenuSection } from '../../components/main-menu/main.menu';
import { InfoCircleOutlined } from '@ant-design/icons';
import { ActionType, CommandType, ResourceType } from '@util/auth';
import {
  ChargingStationDtoProps,
  IChargingStationDto,
  LocationDtoProps,
  OCPPVersion,
} from '@citrineos/base';
import ProtocolTag from '../../components/protocol-tag';

export const getChargingStationColumns = (
  push: (path: string, ...rest: unknown[]) => void,
  showRemoteStartModal: (station: IChargingStationDto) => void,
  handleStopTransactionClick: (station: IChargingStationDto) => void,
  showResetStartModal: (station: IChargingStationDto) => void,
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
        className: 'hoverable-column',
        onClick: () => {
          const path = `/${MenuSection.CHARGING_STATIONS}/${record.id}`;
          window.open(path, '_blank');
        },
      })}
      render={(_: any, record: IChargingStationDto) => {
        return <strong>{record.id}</strong>;
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
          className: 'hoverable-column',
          onClick: () => {
            const path = `/${MenuSection.LOCATIONS}/${record.location?.id}`;
            window.open(path, '_blank');
          },
        })}
        render={(_: any, record: IChargingStationDto) => {
          return <strong>{record.location?.name}</strong>;
        }}
      />,
    );
  }

  // Add the remaining columns
  columns.push(
    <Table.Column
      key={ChargingStationDtoProps.statusNotifications}
      dataIndex={ChargingStationDtoProps.statusNotifications}
      title="Status"
      render={(_: any, record: IChargingStationDto) => {
        return (
          <span className={record.isOnline ? 'online' : 'offline'}>
            {record.isOnline ? 'Online' : 'Offline'}
          </span>
        );
      }}
    />,
    <Table.Column
      key={ChargingStationDtoProps.protocol}
      dataIndex={ChargingStationDtoProps.protocol}
      title="Protocol"
      render={(_: any, record: IChargingStationDto) => (
        <ProtocolTag protocol={record[ChargingStationDtoProps.protocol]} />
      )}
    />,
    <Table.Column
      key="actions"
      dataIndex="actions"
      title="Actions"
      render={(_: any, record: IChargingStationDto) => {
        const hasActiveTransactions = false; // transactions are not a direct property

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
                  <Button
                    type="primary"
                    className="btn-md"
                    onClick={() => showRemoteStartModal(record)}
                  >
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
                  <Button
                    className="error btn-md"
                    onClick={() => handleStopTransactionClick(record)}
                  >
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
                <Button
                  className="warning btn-md"
                  onClick={() => showResetStartModal(record)}
                >
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
