import { TableColumnsType } from 'antd';
import { ActionsColumn } from '../../components/data-model-table/actions-column';
import { TRANSACTION_DELETE_MUTATION } from './queries';
import { ResourceType } from '../../resource-type';
import { Transaction } from './Transaction';
import { StatusIcon } from '../../components/status-icon';
import { ChargingStateEnumType, ReasonEnumType } from '@citrineos/base';
import GenericTag, { DefaultColors } from '../../components/tag';
import { TruncateDisplay } from '../../components/truncate-display';
import { ValueDisplay } from '../../components/value-display';

import React from 'react';
import { renderAssociatedStationId } from '../charging-stations';
import { TimestampDisplay } from '../../components/timestamp-display';
import { ExpandableColumn } from '../../components/data-model-table/expandable-column';
import { DEFAULT_EXPANDED_DATA_FILTER } from '../../components/defaults';
import { TransactionEventList } from '../transaction-events';
import { Transactions } from '../../graphql/schema.types';

export const TRANSACTION_COLUMNS = (
  withActions: boolean,
  _parentView?: ResourceType,
): TableColumnsType<Transactions> => {
  const baseColumns: TableColumnsType<any> = [
    {
      dataIndex: 'transactionId',
      title: 'Transaction ID',
      sorter: true,
      render: (_: any, record: Transactions) => (
        <TruncateDisplay id={record.transactionId as string} />
      ),
    },
    {
      dataIndex: 'stationId',
      title: 'Station ID',
      sorter: true,
      render: renderAssociatedStationId as any,
    },
    {
      dataIndex: 'evseDatabaseId',
      title: 'Evse ID',
      sorter: true,
    },
    {
      dataIndex: 'isActive',
      title: 'Is Active',
      sorter: true,
      render: (_: any, record: Transactions) => (
        <StatusIcon value={record?.isActive} />
      ),
    },
    {
      dataIndex: 'AssociatedTransactionEvents',
      title: 'Events',
      render: ((_: any, record: Transactions) => {
        const filter = DEFAULT_EXPANDED_DATA_FILTER(
          'transactionDatabaseId',
          'eq',
          record.id,
        );
        return (
          <ExpandableColumn
            expandedContent={
              <TransactionEventList
                filters={filter}
                hideCreateButton={true}
                hideActions={true}
                parentView={ResourceType.TRANSACTION_EVENTS}
              />
            }
            viewTitle={`Transaction events for transaction: ${record.id}`}
          />
        );
      }) as any,
    },
    {
      dataIndex: 'chargingState',
      title: 'Charging State',
      render: ((_: any, record: Transactions) => {
        return (
          <GenericTag
            enumValue={record.chargingState as ChargingStateEnumType}
            enumType={ChargingStateEnumType}
            colorMap={{
              Charging: DefaultColors.GREEN,
              EVConnected: DefaultColors.BLUE,
              SuspendedEV: DefaultColors.RED,
              SuspendedEVSE: DefaultColors.VOLCANO,
              Idle: DefaultColors.ORANGE,
            }}
          />
        );
      }) as any,
    },
    {
      dataIndex: 'timeSpentCharging',
      title: 'Time Spent Charging (s)',
    },
    {
      dataIndex: 'totalKwh',
      title: 'Total kWh',
      render: (_: any, record: Transaction) => (
        <ValueDisplay value={record.totalKwh} suffix="kWh" />
      ),
    },
    {
      dataIndex: 'stoppedReason',
      title: 'Stopped Reason',
      render: ((_: any, record: Transactions) => {
        return (
          <GenericTag
            enumValue={record.stoppedReason as ReasonEnumType}
            enumType={ReasonEnumType}
          />
        );
      }) as any,
    },
    {
      dataIndex: 'remoteStartId',
      title: 'Remote Start ID',
    },
    {
      dataIndex: 'createdAt',
      title: 'Created At',
      sorter: true,
      render: (_: any, record: Transactions) => (
        <TimestampDisplay isoTimestamp={record.createdAt} />
      ),
    },
    {
      dataIndex: 'updatedAt',
      title: 'Updated At',
      sorter: true,
      render: (_: any, record: Transactions) => (
        <TimestampDisplay isoTimestamp={record.updatedAt} />
      ),
    },
    // todo: handle custom data
    // customData?: CustomDataType | null;
  ];

  if (withActions) {
    baseColumns.unshift({
      dataIndex: 'actions',
      title: 'Actions',
      className: 'actions-column',
      render: (_: any, record: Transactions) => (
        <ActionsColumn
          record={record}
          gqlDeleteMutation={TRANSACTION_DELETE_MUTATION}
        />
      ),
    });
  }

  return baseColumns;
};
