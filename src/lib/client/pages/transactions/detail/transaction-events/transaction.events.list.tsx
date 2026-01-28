// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0
'use client';

import type { TransactionEventDto } from '@citrineos/base';
import { TransactionEventEnum, TransactionEventProps } from '@citrineos/base';
import { Table } from '@lib/client/components/table';
import { MeterValuesList } from '@lib/client/pages/transactions/detail/meter-values/meter.values.list';
import { getTransactionEventColumns } from '@lib/client/pages/transactions/detail/transaction-events/columns';
import { OCPPMessageClass } from '@lib/cls/ocpp.message.dto';
import { TransactionEventClass } from '@lib/cls/transaction.event.dto';
import { GET_OCPP_MESSAGES_FOR_TRANSACTION_LIST_QUERY } from '@lib/queries/ocpp.messages';
import {
  GET_TRANSACTION_EVENTS_FOR_TRANSACTION_LIST_QUERY,
  TRANSACTION_EVENT_LIST_QUERY,
} from '@lib/queries/transaction.events';
import { ResourceType } from '@lib/utils/access.types';
import { getPlainToInstanceOptions } from '@lib/utils/tables';
import { useList } from '@refinedev/core';
import { ChevronDownIcon } from 'lucide-react';
import { useMemo, useState } from 'react';

export const TransactionEventsList = ({ transactionDatabaseId }: any) => {
  const {
    query: { data: eventsData },
  } = useList<TransactionEventDto>({
    resource: ResourceType.TRANSACTION_EVENTS,
    sorters: [{ field: TransactionEventProps.timestamp, order: 'desc' }],
    meta: {
      gqlQuery: transactionDatabaseId
        ? GET_TRANSACTION_EVENTS_FOR_TRANSACTION_LIST_QUERY
        : TRANSACTION_EVENT_LIST_QUERY,
      gqlVariables: transactionDatabaseId
        ? { transactionDatabaseId }
        : undefined,
    },
    queryOptions: getPlainToInstanceOptions(TransactionEventClass),
    pagination: { pageSize: 1000 },
  });

  const {
    query: { data: messagesData },
  } = useList<OCPPMessageClass>({
    resource: ResourceType.OCPP_MESSAGES,
    sorters: [{ field: 'timestamp', order: 'desc' }],
    meta: {
      gqlQuery: GET_OCPP_MESSAGES_FOR_TRANSACTION_LIST_QUERY,
      gqlVariables: { transactionDatabaseId },
    },
    queryOptions: getPlainToInstanceOptions(OCPPMessageClass),
    pagination: { pageSize: 1000 },
  });

  const [expandedRow, setExpandedRow] = useState<string | number>();

  const merged = useMemo<TransactionEventDto[]>(() => {
    const events = eventsData?.data || [];
    const messages = messagesData?.data || [];

    const messageRows: TransactionEventDto[] = messages.map((m: any) => ({
      id: -m.id,
      stationId: String(m.stationId ?? ''),
      evseId: m.message?.connectorId ?? null,
      transactionDatabaseId: transactionDatabaseId,
      eventType: 'OCPPMessage' as TransactionEventDto['eventType'],
      meterValues: [],
      timestamp: String(m.timestamp),
      triggerReason: m.action as TransactionEventDto['triggerReason'],
      seqNo: -1 as TransactionEventDto['seqNo'],
      offline: false as TransactionEventDto['offline'],
      numberOfPhasesUsed: 0 as TransactionEventDto['numberOfPhasesUsed'],
      cableMaxCurrent: 0 as TransactionEventDto['cableMaxCurrent'],
      reservationId: 0 as TransactionEventDto['reservationId'],
      tenantId: 1,
    }));
    return [...events, ...messageRows];
  }, [eventsData?.data, messagesData?.data, transactionDatabaseId]);

  const columns = useMemo(
    () => [
      ...getTransactionEventColumns(),
      <Table.Column
        id="meterValues"
        key="meterValues"
        accessorKey={TransactionEventProps.meterValue}
        header="Meter Values"
        cell={({ row }) =>
          row.original.eventType! in TransactionEventEnum ? (
            <div
              className="flex items-center cursor-pointer hover:text-primary"
              onClick={() =>
                setExpandedRow((prev) =>
                  prev === row.original.id ? undefined : row.original.id,
                )
              }
            >
              View Meter Values
              <ChevronDownIcon
                className={
                  expandedRow === row.original.id
                    ? 'ml-2 transform rotate-180 transition-transform'
                    : 'ml-2 transition-transform'
                }
              />
            </div>
          ) : null
        }
      />,
    ],
    [expandedRow],
  );

  return (
    <div className="space-y-4">
      <Table
        refineCoreProps={{
          resource: ResourceType.TRANSACTION_EVENTS,
          sorters: {
            initial: [
              { field: TransactionEventProps.timestamp, order: 'desc' },
            ],
          },
          meta: {
            gqlQuery: transactionDatabaseId
              ? GET_TRANSACTION_EVENTS_FOR_TRANSACTION_LIST_QUERY
              : TRANSACTION_EVENT_LIST_QUERY,
            gqlVariables: transactionDatabaseId
              ? { transactionDatabaseId }
              : undefined,
          },
          queryOptions: {
            ...getPlainToInstanceOptions(TransactionEventClass),
            select: () => ({ data: merged, total: merged.length }),
          },
        }}
        enableSorting
        enableFilters
        showHeader
      >
        {columns}
      </Table>

      {/* Render expanded meter values separately */}
      {expandedRow && (
        <div className="ml-8 p-4 border-l-2 border-primary bg-muted/50 rounded">
          <MeterValuesList transactionEventId={expandedRow} />
        </div>
      )}
    </div>
  );
};
