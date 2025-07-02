// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { Table } from 'antd';
import React from 'react';
import {
  TransactionDto,
  TransactionDtoProps,
} from '../../dtos/transaction.dto';
import { TimestampDisplay } from '../../components/timestamp-display';
import GenericTag from '../../components/tag';
import { StatusIcon } from '../../components/status-icon';
import { CanAccess } from '@refinedev/core';
import { ResourceType, ActionType, AccessDeniedFallback } from '@util/auth';
import { MenuSection } from '../../components/main-menu/main.menu';
import { ChargingStateEnumType, TransactionEventEnumType } from '@OCPP2_0_1';
import { BaseDtoProps } from '../../dtos/base.dto';
import { IdTokenProps } from '../id-tokens/id-token';
import { CrudFilters } from '@refinedev/core';
import { LocationDtoProps } from '../../dtos/location.dto';
import { ChargingStationDtoProps } from '../../dtos/charging.station.dto';
import { TransactionEventDtoProps } from '../../dtos/transaction.event.dto';
import { IdTokenDtoProps } from '../../dtos/id.token.dto';
import { StartTransactionDtoProps } from '../../dtos/start.transaction.dto';

export const getTransactionsFilters = (value: string): CrudFilters => {
  return [
    {
      operator: 'or',
      value: [
        {
          field: TransactionDtoProps.transactionId,
          operator: 'contains',
          value,
        },
        {
          field: `${TransactionDtoProps.chargingStation}.${ChargingStationDtoProps.location}.${LocationDtoProps.name}`,
          operator: 'contains',
          value,
        },
        {
          field: TransactionDtoProps.stationId,
          operator: 'contains',
          value,
        },
        {
          field: TransactionDtoProps.chargingState,
          operator: 'contains',
          value,
        },
        {
          field: `${TransactionDtoProps.transactionEvents}.${TransactionEventDtoProps.idToken}.${IdTokenDtoProps.idToken}`,
          operator: 'contains',
          value,
        },
        {
          field: `${TransactionDtoProps.startTransaction}.${StartTransactionDtoProps.idToken}.${IdTokenDtoProps.idToken}`,
          operator: 'contains',
          value,
        },
      ],
    },
  ];
};

export const getTransactionColumns = (
  push: (path: string, ...rest: unknown[]) => void,
) => {
  return (
    <>
      <Table.Column
        key={TransactionDtoProps.transactionId}
        dataIndex={TransactionDtoProps.transactionId}
        title="Transaction ID"
        sorter={true}
        onCell={(record: TransactionDto) => ({
          className: `column-${TransactionDtoProps.transactionId}`,
          onClick: (e: React.MouseEvent) => {
            const path = `/${MenuSection.TRANSACTIONS}/${record.id}`;
            if (e.ctrlKey || e.metaKey) {
              window.open(path, '_blank');
            } else {
              push(path);
            }
          },
          style: { cursor: 'pointer' },
        })}
        render={(_: any, record: TransactionDto) => (
          <h4>{record.transactionId}</h4>
        )}
      />
      <Table.Column
        key={TransactionDtoProps.isActive}
        dataIndex={TransactionDtoProps.isActive}
        title="Active"
        onCell={() => ({
          className: `column-${TransactionDtoProps.isActive}`,
        })}
        render={(_: any, record: TransactionDto) => (
          <StatusIcon value={record.isActive} />
        )}
      />
      <Table.Column
        key="chargingStation"
        dataIndex="chargingStation"
        title="Station ID"
        sorter={true}
        onCell={(record: TransactionDto) => ({
          className: `column-${ChargingStationDtoProps.id}`,
          onClick: (e: React.MouseEvent) => {
            const path = `/${MenuSection.CHARGING_STATIONS}/${record.chargingStation?.id}`;
            if (e.ctrlKey || e.metaKey) {
              window.open(path, '_blank');
            } else {
              push(path);
            }
          },
          style: { cursor: 'pointer' },
        })}
        render={(_: any, record: TransactionDto) => (
          <h4>{record.chargingStation?.id}</h4>
        )}
      />
      <Table.Column
        key="location"
        dataIndex="location"
        title="Location Name"
        sorter={true}
        onCell={(record: TransactionDto) => ({
          className: `column-${LocationDtoProps.name}`,
          onClick: (e: React.MouseEvent) => {
            const path = `/${MenuSection.LOCATIONS}/${record.chargingStation?.location?.id}`;
            if (e.ctrlKey || e.metaKey) {
              window.open(path, '_blank');
            } else {
              push(path);
            }
          },
          style: { cursor: 'pointer' },
        })}
        render={(_: any, record: TransactionDto) => (
          <h4>{record.chargingStation?.location?.name}</h4>
        )}
      />
      <Table.Column
        key={IdTokenProps.idToken}
        dataIndex={IdTokenProps.idToken}
        title="ID Token"
        onCell={() => ({
          className: `column-${IdTokenProps.idToken}`,
        })}
        render={(_: any, record: TransactionDto) => {
          if (record.transactionEvents) {
            const startedEvent = record.transactionEvents.find(
              (event) => event.eventType === TransactionEventEnumType.Started,
            );
            if (startedEvent && startedEvent.idToken) {
              return <h4>{startedEvent.idToken.idToken}</h4>;
            }
          } else if (record.startTransaction) {
            if (record.startTransaction.idToken) {
              return <h4>{record.startTransaction.idToken.idToken}</h4>;
            }
          }
          return '';
        }}
      />
      <Table.Column
        key={TransactionDtoProps.totalKwh}
        dataIndex={TransactionDtoProps.totalKwh}
        title="Total kWh"
        sorter={true}
        onCell={() => ({
          className: `column-${TransactionDtoProps.totalKwh}`,
        })}
        render={(_: any, record: TransactionDto) => (
          <>{record.totalKwh?.toFixed(2)} kWh</>
        )}
      />
      <Table.Column
        key="status"
        dataIndex="status"
        title="Status"
        onCell={() => ({
          className: 'column-status',
        })}
        render={(_: any, record: TransactionDto) =>
          record.chargingState ? (
            <GenericTag
              enumValue={record.chargingState}
              enumType={ChargingStateEnumType}
            />
          ) : null
        }
      />
      <Table.Column
        key={BaseDtoProps.createdAt}
        dataIndex={BaseDtoProps.createdAt}
        title="Created At"
        sorter={true}
        onCell={() => ({
          className: `column-${BaseDtoProps.createdAt}`,
        })}
        render={(createdAt) => <TimestampDisplay isoTimestamp={createdAt} />}
      />
      <Table.Column
        key={BaseDtoProps.updatedAt}
        dataIndex={BaseDtoProps.updatedAt}
        title="Updated At"
        sorter={true}
        onCell={() => ({
          className: `column-${BaseDtoProps.updatedAt}`,
        })}
        render={(updatedAt) => <TimestampDisplay isoTimestamp={updatedAt} />}
      />
    </>
  );
};
