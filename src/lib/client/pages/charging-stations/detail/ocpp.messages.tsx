// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0
'use client';

import type { OCPPMessageDto } from '@citrineos/base';
import {
  MessageOrigin,
  OCPP1_6_CallAction,
  OCPP2_0_1_CallAction,
  OCPPMessageProps,
} from '@citrineos/base';
import { Button } from '@lib/client/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@lib/client/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@lib/client/components/ui/tooltip';
import { OCPPMessageClass } from '@lib/cls/ocpp.message.dto';
import { GET_OCPP_MESSAGES_LIST_FOR_STATION } from '@lib/queries/ocpp.messages';
import { ResourceType } from '@lib/utils/access.types';
import { getPlainToInstanceOptions } from '@lib/utils/tables';
import { type LogicalFilter, useTranslate } from '@refinedev/core';
import { useList } from '@refinedev/core';
import { Copy, Download, Link } from 'lucide-react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { CollapsibleOCPPMessageViewer } from './collapsible.ocpp.message.viewer';
import { buttonIconSize } from '@lib/client/styles/icon';
import { formatDate } from '@lib/client/components/timestamp-display';
import { Table } from '@lib/client/components/table';
import type { CellContext } from '@tanstack/react-table';
import { copy } from '@lib/utils/copy';
import { DebounceSearch } from '@lib/client/components/debounce-search';
import { MultiSelect } from '@lib/client/components/multi-select';
import { OCPPMessagesExportDialog } from '@lib/client/pages/charging-stations/detail/ocpp.messages.export.dialog';
import { DateTimePicker } from '@lib/client/components/ui/date-time-picker';

export interface OCPPMessagesProps {
  stationId: string;
}

const actionOptions = [
  ...Array.from(
    new Set([
      ...Object.values(OCPP1_6_CallAction),
      ...Object.values(OCPP2_0_1_CallAction),
    ]),
  ),
];

const allOption = 'all';

const originOptions = [
  { label: 'All Origins', value: allOption },
  ...Object.values(MessageOrigin).map((o) => ({
    label: o.toUpperCase(),
    value: o,
  })),
];

export const OCPPMessages: React.FC<OCPPMessagesProps> = ({ stationId }) => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [searchCid, setSearchCid] = useState<string>('');
  const [selectedActions, setSelectedActions] = useState<string[]>([]);
  const [selectedOrigin, setSelectedOrigin] = useState<string>(allOption);
  const [filters, setFilters] = useState<LogicalFilter[]>([]);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);

  const translate = useTranslate();

  const {
    query: { data },
  } = useList<OCPPMessageDto>({
    resource: ResourceType.OCPP_MESSAGES,
    sorters: [{ field: OCPPMessageProps.timestamp, order: 'desc' }],
    meta: {
      gqlQuery: GET_OCPP_MESSAGES_LIST_FOR_STATION,
      gqlVariables: { stationId },
    },
    filters,
    queryOptions: getPlainToInstanceOptions(OCPPMessageClass),
  });

  const messages = useMemo(() => data?.data ?? [], [data?.data]);

  useEffect(() => {
    const newFilters: LogicalFilter[] = [];
    if (searchCid.trim()) {
      newFilters.push({
        field: OCPPMessageProps.correlationId,
        operator: 'contains',
        value: searchCid,
      });
    }
    if (startDate) {
      newFilters.push({
        field: OCPPMessageProps.timestamp,
        operator: 'gte',
        value: startDate.toISOString(),
      });
    }
    if (endDate) {
      newFilters.push({
        field: OCPPMessageProps.timestamp,
        operator: 'lte',
        value: endDate.toISOString(),
      });
    }
    if (selectedActions.length > 0) {
      newFilters.push({
        field: OCPPMessageProps.action,
        operator: 'in',
        value: selectedActions,
      });
    }
    if (selectedOrigin && selectedOrigin !== allOption) {
      newFilters.push({
        field: OCPPMessageProps.origin,
        operator: 'eq',
        value: selectedOrigin,
      });
    }

    setFilters(newFilters);
  }, [startDate, endDate, searchCid, selectedActions, selectedOrigin]);

  const findRelatedMessages = useCallback(
    (record: OCPPMessageDto) => {
      // Find and select the row with the same correlationId but different origin
      const relatedMessageIndex = messages.findIndex(
        (msg) =>
          msg.correlationId === record.correlationId &&
          msg.origin !== record.origin,
      );
      if (relatedMessageIndex !== -1) {
        // Scroll to the related message
        const element = document.getElementById(
          `table-row-${relatedMessageIndex}`,
        );
        if (element)
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    },
    [messages],
  );

  const getRowClassName = (record: OCPPMessageDto) =>
    record.origin === MessageOrigin.ChargingStation
      ? 'bg-secondary/25'
      : 'bg-success/25';

  return (
    <>
      <div className="flex flex-col gap-4 w-full">
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={() => setExportDialogOpen(true)}>
            <Download className={buttonIconSize} />
            {translate('buttons.exportToCsv')}
          </Button>
        </div>
        <div className="grid grid-cols-5 gap-2 w-full">
          <DebounceSearch
            onSearch={setSearchCid}
            placeholder="Search Correlation ID"
            className="relative w-full"
          />
          <MultiSelect
            options={actionOptions}
            selectedValues={selectedActions}
            setSelectedValues={setSelectedActions}
            placeholder="Select Actions"
            searchPlaceholder="Search Actions"
          />
          <Select
            value={selectedOrigin ?? ''}
            onValueChange={setSelectedOrigin}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filter Origins" />
            </SelectTrigger>
            <SelectContent>
              {originOptions.map((opt) => (
                <SelectItem key={opt.label} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <DateTimePicker
            date={startDate ?? undefined}
            onSelectDateAction={(date) => setStartDate(date ?? null)}
            placeholder="Pick Start Date"
          />
          <DateTimePicker
            date={endDate ?? undefined}
            onSelectDateAction={(date) => setEndDate(date ?? null)}
            placeholder="Pick End Date"
          />
        </div>

        <Table<OCPPMessageDto>
          refineCoreProps={{
            resource: ResourceType.OCPP_MESSAGES,
            sorters: {
              initial: [{ field: OCPPMessageProps.timestamp, order: 'desc' }],
            },
            filters: {
              permanent: filters,
            },
            meta: {
              gqlQuery: GET_OCPP_MESSAGES_LIST_FOR_STATION,
              gqlVariables: { stationId },
            },
            queryOptions: getPlainToInstanceOptions(OCPPMessageClass),
          }}
          rowClassName={(record) => getRowClassName(record)}
          enableFilters
          showHeader
        >
          {[
            <Table.Column
              id="correlationId"
              key="correlationId"
              accessorKey="correlationId"
              header="Correlation ID"
              cell={({ row }: CellContext<OCPPMessageDto, unknown>) => {
                return (
                  <TooltipProvider>
                    <div className="flex items-center gap-2">
                      <code className="text-xs bg-muted px-2 py-1 rounded">
                        {row.original.correlationId ?? '-'}
                      </code>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="xs"
                            onClick={(e) => {
                              e.stopPropagation();
                              findRelatedMessages(row.original);
                            }}
                          >
                            <Link className={buttonIconSize} />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Find related message</TooltipContent>
                      </Tooltip>
                      {row.original.correlationId && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="xs"
                              onClick={async (e) => {
                                e.stopPropagation();
                                await copy(row.original.correlationId);
                              }}
                            >
                              <Copy className={buttonIconSize} />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Copy Correlation ID</TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                  </TooltipProvider>
                );
              }}
            />,
            <Table.Column
              id="action"
              key="action"
              accessorKey="action"
              header="Action - Origin"
              cell={({ row }: CellContext<OCPPMessageDto, unknown>) => {
                return (
                  <span>
                    {row.original.action ?? 'Unknown Action'} -{' '}
                    {row.original.origin}
                  </span>
                );
              }}
            />,
            <Table.Column
              id="timestamp"
              key="timestamp"
              accessorKey="timestamp"
              header="Timestamp"
              cell={({ row }: CellContext<OCPPMessageDto, unknown>) => {
                return (
                  <span>
                    {formatDate(
                      row.original.timestamp,
                      'YYYY-MM-DD HH:mm:ss.SSS',
                    )}
                  </span>
                );
              }}
            />,
            <Table.Column
              id="message"
              key="message"
              accessorKey="message"
              header="Content"
              cell={({ row }: CellContext<OCPPMessageDto, unknown>) => {
                return (
                  <CollapsibleOCPPMessageViewer
                    ocppMessageDto={row.original}
                    unparsed={typeof row.original.message === 'string'}
                  />
                );
              }}
            />,
          ]}
        </Table>
      </div>

      <OCPPMessagesExportDialog
        open={exportDialogOpen}
        onOpenChangeAction={setExportDialogOpen}
        stationId={stationId}
        filters={filters}
      />
    </>
  );
};
