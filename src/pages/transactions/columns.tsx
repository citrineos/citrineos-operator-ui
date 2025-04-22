import { Flex, Table } from 'antd';
import {
  TransactionDto,
  TransactionDtoProps,
} from '../../dtos/transaction.dto';
import {
  ChargingStationDto,
  ChargingStationDtoProps,
} from '../../dtos/charging.station.dto';
import { ArrowRightIcon } from '../../components/icons/arrow.right.icon';
import React from 'react';
import { IdTokenProps } from '../id-tokens/id-token';
import { ChargingStateEnumType, TransactionEventEnumType } from '@OCPP2_0_1';
import { BaseDtoProps } from '../../dtos/base.dto';
import { TimestampDisplay } from '../../components/timestamp-display';
import GenericTag from '../../components/tag';
import { StatusIcon } from '../../components/status-icon';
import { CanAccess, CrudFilter } from '@refinedev/core';
import { MenuSection } from '../../components/main-menu/main.menu';
import {
  ResourceType,
  ActionType,
  AccessDeniedFallback,
} from '@util/auth';

export const getTransactionColumns = (
  push: (path: string, ...rest: unknown[]) => void,
  includeActions = true,
) => {
  return (
    <CanAccess
      resource={ResourceType.TRANSACTIONS}
      action={ActionType.LIST}
      fallback={<AccessDeniedFallback />}
    >
      <Table.Column
        key={TransactionDtoProps.transactionId}
        dataIndex={TransactionDtoProps.transactionId}
        title="Transaction ID"
        sorter={true}
        onCell={() => ({
          className: `column-${TransactionDtoProps.transactionId}`,
        })}
      />
      <Table.Column
        key={TransactionDtoProps.isActive}
        dataIndex={TransactionDtoProps.isActive}
        title="Active"
        onCell={() => ({
          className: `column-${TransactionDtoProps.isActive}`,
        })}
        render={(_: any, record: TransactionDto) => {
          return <StatusIcon value={record.isActive} />;
        }}
      />
      <Table.Column
        key={ChargingStationDtoProps.locationId}
        dataIndex={ChargingStationDtoProps.locationId}
        title="Location ID"
        sorter={true}
        onCell={() => ({
          className: `column-${ChargingStationDtoProps.locationId}`,
        })}
        render={(_: any, record: TransactionDto) => {
          return record.chargingStation?.location?.name;
        }}
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
              return startedEvent.idToken.idToken;
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
        render={(_: any, record: TransactionDto) => {
          return `${record.totalKwh?.toFixed(2)} kWh`;
        }}
      />
      {/* TODO removing for now, return one day when timeSpentCharging is available */}
      {/* or another method of calculating time is found */}
      {/*<Table.Column*/}
      {/*  key={TransactionDtoProps.timeSpentCharging}*/}
      {/*  dataIndex={TransactionDtoProps.timeSpentCharging}*/}
      {/*  title="Total Time"*/}
      {/*  sorter={true}*/}
      {/*  onCell={() => ({*/}
      {/*    className: `column-${TransactionDtoProps.timeSpentCharging}`,*/}
      {/*  })}*/}
      {/*  render={(_: any, record: TransactionDto) => {*/}
      {/*    // return `${record.timeSpentCharging} min`;*/}
      {/*    return '120 min';*/}
      {/*  }}*/}
      {/*/>*/}
      <Table.Column
        key={TransactionDtoProps.chargingState}
        dataIndex={TransactionDtoProps.chargingState}
        title="Status"
        onCell={() => ({
          className: `column-${TransactionDtoProps.chargingState}`,
        })}
        render={(_: any, record: TransactionDto) => {
          return (
            record.chargingState && (
              <GenericTag
                enumValue={record.chargingState}
                enumType={ChargingStateEnumType}
              />
            )
          );
        }}
      />
      <Table.Column
        key={BaseDtoProps.createdAt}
        dataIndex={BaseDtoProps.createdAt}
        title="Created At"
        sorter={true}
        onCell={() => ({
          className: `column-${BaseDtoProps.createdAt}`,
        })}
        render={(createdAt) => {
          return <TimestampDisplay isoTimestamp={createdAt} />;
        }}
      />
      <Table.Column
        key={BaseDtoProps.updatedAt}
        dataIndex={BaseDtoProps.updatedAt}
        title="Updated At"
        sorter={true}
        onCell={() => ({
          className: `column-${BaseDtoProps.updatedAt}`,
        })}
        render={(updatedAt) => {
          return <TimestampDisplay isoTimestamp={updatedAt} />;
        }}
      />
      {includeActions && (
        <Table.Column
          key="actions"
          dataIndex="actions"
          title="Actions"
          onCell={() => ({
            className: 'column-actions',
          })}
          render={(_: any, record: ChargingStationDto) => (
            <Flex
              onClick={() => push(`/${MenuSection.TRANSACTIONS}/${record.id}`)}
              className="pointer"
              align={'center'}
            >
              View Detail <ArrowRightIcon />
            </Flex>
          )}
        />
      )}
    </CanAccess>
  );
};

export const getTransactionsFilters = (value: string): CrudFilter[] => {
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
          field: 'ChargingStation.Location.name',
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
          field: 'TransactionEvents.IdToken.idToken',
          operator: 'contains',
          value,
        },
      ],
    },
  ];
};
