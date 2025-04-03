import {useTable} from "@refinedev/antd";
import {ResourceType} from "../../../resource-type";
import {getPlainToInstanceOptions} from "@util/tables";
import {TransactionEventDto, TransactionEventDtoProps} from "../../../dtos/transaction.event.dto";
import {GET_TRANSACTION_EVENTS_FOR_TRANSACTION_LIST_QUERY, TRANSACTION_EVENT_LIST_QUERY} from "../queries";
import {Row, Table} from "antd";
import React, {useMemo, useState} from "react";
import {getTransactionEventColumns} from "../columns";
import {MeterValuesList} from "../../meter-values/list/meter.values.list";
import {ArrowDownIcon} from "../../../components/icons/arrow.down.icon";

export const TransactionEventsList = ({
  transactionDatabaseId
}: any) => {
  const { tableProps } = useTable<TransactionEventDto>({
    resource: ResourceType.TRANSACTION_EVENTS,
    sorters: { initial: [{ field: TransactionEventDtoProps.timestamp, order: 'desc' }] },
    meta: {
      gqlQuery: transactionDatabaseId ?
        GET_TRANSACTION_EVENTS_FOR_TRANSACTION_LIST_QUERY :
        TRANSACTION_EVENT_LIST_QUERY,
      gqlVariables: transactionDatabaseId ? { transactionDatabaseId } : undefined,
    },
    queryOptions: getPlainToInstanceOptions(TransactionEventDto),
  });

  const [expandedRowByToggle, setExpandedRowByToggle] = useState<number>();

  const handleExpandToggle = (record: TransactionEventDto) => {
    setExpandedRowByToggle((prev) =>
      prev === record.id ? undefined : record.id,
    );
  };

  const columns = useMemo(() => getTransactionEventColumns(), []);

  return (
    <Table
      rowKey="id"
      className={'full-width'}
      expandable={{
        expandIconColumnIndex: -1,
        expandedRowKeys: expandedRowByToggle ? [expandedRowByToggle] : [],
        expandedRowRender: (record) => {
          if (expandedRowByToggle === record.id) {
            return (<MeterValuesList transactionEventId={record.id} />);
          }
          return null;
        },
      }}
      rowClassName={(record) =>
        expandedRowByToggle === record.id ? 'selected-row' : ''
      }
      {...tableProps}
    >
      {columns}
      <Table.Column
        key={TransactionEventDtoProps.meterValues}
        dataIndex={TransactionEventDtoProps.meterValues}
        title="Meter Values"
        onCell={() => ({
          className: `column-${TransactionEventDtoProps.meterValues}`,
        })}
        render={(_: any, record: TransactionEventDto) => (
          <Row
            className="view-meter-values"
            align="middle"
            onClick={() => handleExpandToggle(record)}
          >
            View Meter Values
            <ArrowDownIcon
              className={
                expandedRowByToggle === record.id ? 'arrow rotate' : 'arrow'
              }
            />
          </Row>
        )}
      />
    </Table>
  )
}