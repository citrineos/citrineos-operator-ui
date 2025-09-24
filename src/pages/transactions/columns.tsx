// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { Table } from 'antd';
import React from 'react';
import { TimestampDisplay } from '../../components/timestamp-display';
import GenericTag from '../../components/tag';
import { StatusIcon } from '../../components/status-icon';
import { MenuSection } from '../../components/main-menu/main.menu';
import { ChargingStateEnumType } from '@OCPP2_0_1';
import { CrudFilters } from '@refinedev/core';
import { ITransactionDto, TransactionDtoProps } from '@citrineos/base';
import { IdTokenDtoProps } from '@citrineos/base';
import { LocationDtoProps } from '@citrineos/base';
import { NOT_APPLICABLE } from '@util/consts';

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
          field: `${TransactionDtoProps.location}.${LocationDtoProps.name}`,
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
          field: `${TransactionDtoProps.authorization}.${IdTokenDtoProps.idToken}`,
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
        onCell={(record: ITransactionDto) => ({
          className: 'hoverable-value',
          onClick: (e: React.MouseEvent) => {
            const path = `/${MenuSection.TRANSACTIONS}/${record.id}`;
            if (e.ctrlKey || e.metaKey) {
              window.open(path, '_blank');
            } else {
              push(path);
            }
          },
        })}
        render={(_: any, record: ITransactionDto) => (
          <span>{record.transactionId}</span>
        )}
      />
      <Table.Column
        key={TransactionDtoProps.isActive}
        dataIndex={TransactionDtoProps.isActive}
        title="Active"
        onCell={() => ({
          className: `column-${TransactionDtoProps.isActive}`,
        })}
        render={(_: any, record: ITransactionDto) => (
          <StatusIcon value={record.isActive} />
        )}
      />
      <Table.Column
        key="chargingStation"
        dataIndex="chargingStation"
        title="Station ID"
        sorter={true}
        onCell={(record: ITransactionDto) => ({
          className: window.location.pathname.includes(
            MenuSection.CHARGING_STATIONS,
          )
            ? ''
            : 'hoverable-value',
          onClick: (e: React.MouseEvent) => {
            if (window.location.pathname.includes('chargingStation')) {
              return;
            }

            const path = `/${MenuSection.CHARGING_STATIONS}/${record.chargingStation?.id}`;
            if (e.ctrlKey || e.metaKey) {
              window.open(path, '_blank');
            } else {
              push(path);
            }
          },
          style: { cursor: 'pointer' },
        })}
        render={(_: any, record: ITransactionDto) => (
          <span>{record.chargingStation?.id}</span>
        )}
      />
      <Table.Column
        key="location"
        dataIndex="location"
        title="Location"
        sorter={true}
        onCell={(record: ITransactionDto) => ({
          className: 'hoverable-value',
          onClick: (e: React.MouseEvent) => {
            const path = `/${MenuSection.LOCATIONS}/${record.location?.id}`;
            if (e.ctrlKey || e.metaKey) {
              window.open(path, '_blank');
            } else {
              push(path);
            }
          },
          style: { cursor: 'pointer' },
        })}
        render={(_: any, record: ITransactionDto) => (
          <span>{record.location?.name}</span>
        )}
      />
      <Table.Column
        key={IdTokenDtoProps.idToken}
        dataIndex={IdTokenDtoProps.idToken}
        title="ID Token"
        onCell={() => ({
          className: `column-${IdTokenDtoProps.idToken}`,
        })}
        render={(_: any, record: ITransactionDto) => {
          const idToken = record.authorization?.idToken;
          return idToken ? <span>{idToken ?? NOT_APPLICABLE}</span> : '';
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
        render={(_: any, record: ITransactionDto) => (
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
        render={(_: any, record: ITransactionDto) =>
          record.chargingState ? (
            <GenericTag
              enumValue={record.chargingState}
              enumType={ChargingStateEnumType}
            />
          ) : null
        }
      />
      <Table.Column
        key={TransactionDtoProps.startTime}
        dataIndex={TransactionDtoProps.startTime}
        title="Start Time"
        sorter={true}
        onCell={() => ({
          className: `column-${TransactionDtoProps.startTime}`,
        })}
        render={(startTime) => <TimestampDisplay isoTimestamp={startTime} />}
      />
      <Table.Column
        key={TransactionDtoProps.endTime}
        dataIndex={TransactionDtoProps.endTime}
        title="Updated At"
        sorter={true}
        onCell={() => ({
          className: `column-${TransactionDtoProps.endTime}`,
        })}
        render={(endTime) => <TimestampDisplay isoTimestamp={endTime} />}
      />
    </>
  );
};
