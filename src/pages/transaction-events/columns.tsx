// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { Table } from 'antd';
import React from 'react';
import { TransactionEventDtoProps } from '../../dtos/transaction.event.dto';
import {
  formatDate,
  TimestampDisplay,
} from '../../components/timestamp-display';

export const getTransactionEventColumns = () => {
  return (
    <>
      <Table.Column
        key={TransactionEventDtoProps.eventType}
        dataIndex={TransactionEventDtoProps.eventType}
        title="Event Type"
        onCell={() => ({
          className: `column-${TransactionEventDtoProps.eventType}`,
        })}
      />
      <Table.Column
        key={TransactionEventDtoProps.timestamp}
        dataIndex={TransactionEventDtoProps.timestamp}
        title="Timestamp"
        sorter={(a, b) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        }
        sortDirections={['descend', 'ascend']}
        onCell={() => ({
          className: `column-${TransactionEventDtoProps.timestamp}`,
        })}
        render={(timestamp) => {
          return <TimestampDisplay isoTimestamp={timestamp} />;
        }}
      />
      <Table.Column
        key={TransactionEventDtoProps.seqNo}
        dataIndex={TransactionEventDtoProps.seqNo}
        title="Seq. #"
        sorter={(a, b) => a.seqNo - b.seqNo}
        sortDirections={['descend', 'ascend']}
        onCell={() => ({
          className: `column-${TransactionEventDtoProps.seqNo}`,
        })}
      />
      <Table.Column
        key={TransactionEventDtoProps.triggerReason}
        dataIndex={TransactionEventDtoProps.triggerReason}
        title="Trigger Reason"
        onCell={() => ({
          className: `column-${TransactionEventDtoProps.triggerReason}`,
        })}
      />
    </>
  );
};
