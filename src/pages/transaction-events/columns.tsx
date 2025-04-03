import {Table} from "antd";
import React from "react";
import {TransactionEventDtoProps} from "../../dtos/transaction.event.dto";
import {formatDate, TimestampDisplay} from "../../components/timestamp-display";

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
        sorter={true}
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
        sorter={true}
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
}