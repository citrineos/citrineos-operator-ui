import { TableColumnsType } from 'antd';
import { ActionsColumn } from '../../components/data-model-table/actions-column';
import { TRANSACTION_EVENT_DELETE_MUTATION } from './queries';
import { ResourceType } from '../../resource-type';
import { StatusIcon } from '../../components/status-icon';
import {
  TransactionEventEnumType,
  TriggerReasonEnumType,
} from '@citrineos/base';
import GenericTag from '../../components/tag';

import React from 'react';
import { renderAssociatedStationId } from '../charging-stations';
import { TimestampDisplay } from '../../components/timestamp-display';
import { renderAssociatedTransactionId } from '../transactions';
import { ExpandableColumn } from '../../components/data-model-table/expandable-column';
import { DEFAULT_EXPANDED_DATA_FILTER } from '../../components/defaults';
import { MeterValueList } from '../meter-values';
import { TransactionEvent } from './TransactionEvent';

export const TRANSACTION_EVENT_COLUMNS = (
  withActions: boolean,
  _parentView?: ResourceType,
): TableColumnsType<TransactionEvent> => {
  const baseColumns: TableColumnsType<TransactionEvent> = [
    {
      dataIndex: 'id',
      title: 'ID',
      sorter: true,
    },
    {
      dataIndex: 'stationId',
      title: 'Station ID',
      sorter: true,
      render: renderAssociatedStationId as any,
    },
    {
      dataIndex: 'transactionDatabaseId',
      title: 'Transaction ID',
      sorter: true,
      render: renderAssociatedTransactionId as any,
    },
    {
      dataIndex: 'evseId', // todo enhance
      title: 'Evse ID',
    },
    {
      dataIndex: 'idTokenId', // todo enhance
      title: 'IdToken ID',
    },
    {
      dataIndex: 'eventType',
      title: 'Event Type',
      sorter: true,
      render: (_: any, record: TransactionEvent) => {
        return (
          <GenericTag
            enumValue={record.eventType as any}
            enumType={TransactionEventEnumType}
          />
        );
      },
    },
    {
      dataIndex: 'meterValues',
      title: 'MeterValues',
      render: (_: any, record: TransactionEvent) => {
        if (!record?.id) {
          return '';
        }
        const filter = DEFAULT_EXPANDED_DATA_FILTER(
          'transactionEventId',
          'eq',
          record.id,
        );
        return (
          <ExpandableColumn
            initialContent={record.id}
            expandedContent={
              <MeterValueList
                filters={filter}
                hideCreateButton={true}
                hideActions={true}
                parentView={ResourceType.TRANSACTION_EVENTS}
              />
            }
            viewTitle={`Meter values linked with ID ${record.id}`}
          />
        );
      },
    },
    {
      dataIndex: 'timestamp',
      title: 'Timestamp',
      sorter: true,
      render: (_: any, record: TransactionEvent) => (
        <TimestampDisplay isoTimestamp={record.timestamp} />
      ),
    },
    {
      dataIndex: 'triggerReason',
      title: 'Trigger reason',
      sorter: true,
      render: (_: any, record: TransactionEvent) => {
        return (
          <GenericTag
            enumValue={record.triggerReason as TriggerReasonEnumType}
            enumType={TriggerReasonEnumType}
          />
        );
      },
    },
    {
      dataIndex: 'seqNo',
      title: 'SeqNo',
    },
    {
      dataIndex: 'seqNo',
      title: 'SeqNo',
      sorter: true,
    },
    {
      dataIndex: 'offline',
      title: 'Offline',
      align: 'center',
      render: (_: any, record: TransactionEvent) => (
        <StatusIcon value={record?.offline} />
      ),
    },
    {
      dataIndex: 'numberOfPhasesUsed',
      title: 'Phases Used',
    },
    {
      dataIndex: 'cableMaxCurrent',
      title: 'Cable Max Current',
    },
    {
      dataIndex: 'reservationId',
      title: 'Reservation ID',
    },
    // { // todo
    //   dataIndex: 'transactionInfo',
    //   title: 'Transaction info',
    // },
  ] as TableColumnsType<TransactionEvent>;

  if (withActions) {
    baseColumns.unshift({
      dataIndex: 'actions',
      title: 'Actions',
      className: 'actions-column',
      render: (_: any, record: TransactionEvent) => (
        <ActionsColumn
          record={record}
          gqlDeleteMutation={TRANSACTION_EVENT_DELETE_MUTATION}
        />
      ),
    });
  }

  return baseColumns;
};
