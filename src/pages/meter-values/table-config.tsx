import { TableColumnsType } from 'antd';
import { ActionsColumn } from '../../components/data-model-table/actions-column';
import { METER_VALUE_DELETE_MUTATION } from './queries';
import { ResourceType } from '../../resource-type';
import React from 'react';
import { renderAssociatedTransactionId } from '../transactions';
import { renderAssociatedTransactionEventId } from '../transaction-events';
import { TimestampDisplay } from '../../components/timestamp-display';
import { ExpandableColumn } from '../../components/data-model-table/expandable-column';
import { SampledValuesListView } from './sampled-value';
import { MeterValue } from './MeterValue';

export const METER_VALUE_COLUMNS = (
  withActions: boolean,
  _parentView?: ResourceType,
): TableColumnsType<MeterValue> => {
  const baseColumns: TableColumnsType<MeterValue> = [
    {
      dataIndex: 'id',
      title: 'ID',
      sorter: true,
    },
    {
      dataIndex: 'transactionDatabaseId',
      title: 'Transaction ID',
      sorter: true,
      render: (_: any, record: any) => {
        return renderAssociatedTransactionId(_, record);
      },
    },
    {
      dataIndex: 'transactionEventId',
      title: 'Transaction Event ID',
      sorter: true,
      render: renderAssociatedTransactionEventId as any,
    },
    {
      dataIndex: 'timestamp',
      title: 'Timestamp',
      sorter: true,
      render: (_: any, record: MeterValue) => (
        <TimestampDisplay isoTimestamp={record.timestamp} />
      ),
    },
    {
      dataIndex: 'sampledValue',
      title: 'Sampled Values',
      sorter: true,
      render: (_: any, record: MeterValue) => (
        <ExpandableColumn
          expandedContent={
            <SampledValuesListView sampledValues={record.sampledValue} />
          }
          viewTitle={`Meter values for transaction event: ${record.id}`}
        />
      ),
    },
  ] as TableColumnsType<MeterValue>;

  if (withActions) {
    baseColumns.unshift({
      dataIndex: 'actions',
      title: 'Actions',
      className: 'actions-column',
      render: (_: any, record: MeterValue) => (
        <ActionsColumn
          record={record}
          gqlDeleteMutation={METER_VALUE_DELETE_MUTATION}
        />
      ),
    });
  }

  return baseColumns;
};
