// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { useMemo, useState } from 'react';
import { Table, Row } from 'antd';
import { useTable } from '@refinedev/antd';
import { ResourceType } from '@util/auth';
import { getPlainToInstanceOptions } from '@util/tables';
import {
  TransactionEventDto,
  TransactionEventDtoProps,
} from '../../../dtos/transaction.event.dto';
import {
  GET_TRANSACTION_EVENTS_FOR_TRANSACTION_LIST_QUERY,
  TRANSACTION_EVENT_LIST_QUERY,
  GET_OCPPMESSAGES_FOR_TRANSACTION_LIST_QUERY,
} from '../queries';
import { getTransactionEventColumns } from '../columns';
import { MeterValuesList } from '../../meter-values/list/meter.values.list';
import { ArrowDownIcon } from '../../../components/icons/arrow.down.icon';
import { OCPPMessageDto } from '../../../dtos/ocpp.message.dto';
import { TransactionEventEnumType } from '@OCPP2_0_1';

type SortField =
  | TransactionEventDtoProps.timestamp
  | TransactionEventDtoProps.seqNo;
type SortOrder = 'ascend' | 'descend';

export const TransactionEventsList = ({ transactionDatabaseId }: any) => {
  const { tableProps } = useTable<TransactionEventDto>({
    resource: ResourceType.TRANSACTION_EVENTS,
    sorters: {
      initial: [{ field: TransactionEventDtoProps.timestamp, order: 'desc' }],
    },
    meta: {
      gqlQuery: transactionDatabaseId
        ? GET_TRANSACTION_EVENTS_FOR_TRANSACTION_LIST_QUERY
        : TRANSACTION_EVENT_LIST_QUERY,
      gqlVariables: transactionDatabaseId
        ? { transactionDatabaseId }
        : undefined,
    },
    queryOptions: getPlainToInstanceOptions(TransactionEventDto),
  });

  const {
    dataSource: events = [],
    pagination: _pag,
    onChange: _onChange,
    ...restTableProps
  } = tableProps;

  const { tableProps: msgTable } = useTable<OCPPMessageDto>({
    resource: ResourceType.OCPP_MESSAGES,
    sorters: { initial: [{ field: 'timestamp', order: 'desc' }] },
    meta: {
      gqlQuery: GET_OCPPMESSAGES_FOR_TRANSACTION_LIST_QUERY,
      gqlVariables: { transactionDatabaseId },
    },
    queryOptions: getPlainToInstanceOptions(OCPPMessageDto),
  });

  const [expandedRow, setExpandedRow] = useState<string | number>();

  const merged = useMemo<TransactionEventDto[]>(() => {
    const messageRows: TransactionEventDto[] = (msgTable.dataSource || []).map(
      (m: any) => ({
        id: -Number(m.id),
        stationId: String(m.stationId ?? ''),
        evseId: m.message?.connectorId ?? null,
        transactionDatabaseId: String(transactionDatabaseId),
        eventType: 'OCPPMessage' as TransactionEventDto['eventType'],
        meterValues: [],
        timestamp: new Date(m.timestamp),
        triggerReason: m.action as TransactionEventDto['triggerReason'],
        seqNo: -1 as TransactionEventDto['seqNo'],
        offline: false as TransactionEventDto['offline'],
        numberOfPhasesUsed: 0 as TransactionEventDto['numberOfPhasesUsed'],
        cableMaxCurrent: 0 as TransactionEventDto['cableMaxCurrent'],
        reservationId: 0 as TransactionEventDto['reservationId'],
        idTokenId: null as TransactionEventDto['idTokenId'],
        idToken: undefined as TransactionEventDto['idToken'],
      }),
    );
    return [...events, ...messageRows];
  }, [events, msgTable.dataSource, transactionDatabaseId]);

  const [sorter, setSorter] = useState<{ field: SortField; order: SortOrder }>({
    field: TransactionEventDtoProps.timestamp,
    order: 'descend',
  });

  const sorted = useMemo<TransactionEventDto[]>(() => {
    return [...merged].sort((a, b) => {
      const { field, order } = sorter;
      let diff = 0;
      if (field === TransactionEventDtoProps.timestamp) {
        diff =
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
      } else {
        diff = a.seqNo - b.seqNo;
      }
      return order === 'ascend' ? diff : -diff;
    });
  }, [merged, sorter]);

  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(
    typeof tableProps.pagination === 'object' && tableProps.pagination.pageSize
      ? tableProps.pagination.pageSize
      : 10,
  );

  const pagedData = useMemo<TransactionEventDto[]>(() => {
    const start = (current - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [sorted, current, pageSize]);

  const columns = useMemo(
    () => (
      <>
        {getTransactionEventColumns()}
        <Table.Column
          key="meterValues"
          dataIndex={TransactionEventDtoProps.meterValues}
          title="Meter Values"
          render={(_: any, record: TransactionEventDto) =>
            record.eventType! in TransactionEventEnumType ? (
              <Row
                className="view-meter-values"
                align="middle"
                onClick={() =>
                  setExpandedRow((prev) =>
                    prev === record.id ? undefined : record.id,
                  )
                }
              >
                View Meter Values
                <ArrowDownIcon
                  className={
                    expandedRow === record.id ? 'arrow rotate' : 'arrow'
                  }
                />
              </Row>
            ) : null
          }
        />
      </>
    ),
    [expandedRow],
  );

  const handleChange = (pagination: any, _filters: any, sorterInfo: any) => {
    setCurrent(pagination.current || 1);
    setPageSize(pagination.pageSize || pageSize);
    if (!Array.isArray(sorterInfo) && sorterInfo.field) {
      const field = sorterInfo.field as SortField;
      if (
        field === TransactionEventDtoProps.timestamp ||
        field === TransactionEventDtoProps.seqNo
      ) {
        setSorter({ field, order: sorterInfo.order });
      }
    }
  };

  return (
    <Table
      {...restTableProps}
      dataSource={pagedData}
      rowKey="id"
      className="full-width"
      onChange={handleChange}
      pagination={{
        current,
        pageSize,
        total: sorted.length,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50'],
      }}
      expandable={{
        expandIconColumnIndex: -1,
        expandedRowKeys: expandedRow ? [expandedRow] : [],
        expandedRowRender: (record) =>
          expandedRow === record.id ? (
            <MeterValuesList transactionEventId={record.id} />
          ) : null,
      }}
      rowClassName={(record) =>
        expandedRow === record.id ? 'selected-row' : ''
      }
    >
      {columns}
    </Table>
  );
};
