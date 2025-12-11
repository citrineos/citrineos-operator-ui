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
import { Input } from '@lib/client/components/ui/input';
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
import type { CrudFilter } from '@refinedev/core';
import { useList } from '@refinedev/core';
import { Dayjs } from 'dayjs';
import { Link } from 'lucide-react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { CollapsibleOCPPMessageViewer } from './collapsible.ocpp.message.viewer';
import {
  TableHead,
  TableHeader,
  TableRow,
  Table as TableUi,
  TableBody,
  TableCell,
} from '@lib/client/components/ui/table';
import { Skeleton } from '@lib/client/components/ui/skeleton';
import { buttonIconSize } from '@lib/client/styles/icon';
import { formatDate } from '@lib/client/components/timestamp-display';

export interface OCPPMessagesProps {
  stationId: string;
}

const smallColumnWidth = 'w-1/7';
const bigColumnWidth = 'w-4/7';

export const OCPPMessages: React.FC<OCPPMessagesProps> = ({ stationId }) => {
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [searchCid, setSearchCid] = useState<string>('');
  const [searchContent, setSearchContent] = useState<string>('');
  const [selectedActions, setSelectedActions] = useState<string>('all');
  const [selectedOrigins, setSelectedOrigins] = useState<string>('all');
  const [filters, setFilters] = useState<CrudFilter[]>([]);

  const {
    query: { data, isLoading },
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

  const actionOptions = useMemo(
    () => [
      { label: 'All', value: 'all' },
      ...Array.from(
        new Set([
          ...Object.values(OCPP1_6_CallAction),
          ...Object.values(OCPP2_0_1_CallAction),
        ]),
      ).map((a) => ({
        label: a,
        value: a,
      })),
    ],
    [],
  );
  const originOptions = useMemo(
    () => [
      { label: 'All', value: 'all' },
      ...Object.values(MessageOrigin).map((o) => ({
        label: o.toUpperCase(),
        value: o,
      })),
    ],
    [],
  );

  useEffect(() => {
    const updateFilters = () => {
      const newFilters: CrudFilter[] = [];
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
      if (searchCid.trim()) {
        newFilters.push({
          field: OCPPMessageProps.correlationId,
          operator: 'contains',
          value: searchCid,
        });
      }
      if (selectedActions !== 'all') {
        newFilters.push({
          field: OCPPMessageProps.action,
          operator: 'eq',
          value: selectedActions,
        });
      }
      if (selectedOrigins !== 'all') {
        newFilters.push({
          field: OCPPMessageProps.origin,
          operator: 'eq',
          value: selectedOrigins,
        });
      }
      setFilters(
        newFilters.length > 1
          ? [{ operator: 'and', value: newFilters }]
          : newFilters,
      );
    };
    updateFilters();
  }, [startDate, endDate, searchCid, selectedActions, selectedOrigins]);

  const filteredData: OCPPMessageDto[] = messages.filter((item) =>
    searchContent.trim()
      ? JSON.stringify(item.message)
          .toLowerCase()
          .includes(searchContent.toLowerCase())
      : true,
  );

  const findRelatedMessages = useCallback(
    (record: OCPPMessageDto) => {
      // Find and select the row with the same correlationId but different origin
      const relatedMessage = messages.find(
        (msg) =>
          msg.correlationId === record.correlationId &&
          msg.origin !== record.origin,
      );
      if (relatedMessage) {
        // Scroll to the related message
        const element = document.getElementById(
          `ocpp-row-${relatedMessage.id}`,
        );
        if (element)
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    },
    [messages],
  );

  const getRowClassName = (record: OCPPMessageDto) =>
    record.origin === MessageOrigin.ChargingStation
      ? 'bg-blue-50 dark:bg-blue-950'
      : 'bg-green-50 dark:bg-green-950';

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-4">
        <Input
          placeholder="Search correlation ID"
          value={searchCid}
          onChange={(e) => setSearchCid(e.target.value)}
          className="w-[250px]"
        />
        <Select value={selectedActions} onValueChange={setSelectedActions}>
          <SelectTrigger className="min-w-[200px]">
            <SelectValue placeholder="Filter Actions" />
          </SelectTrigger>
          <SelectContent>
            {actionOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedOrigins} onValueChange={setSelectedOrigins}>
          <SelectTrigger className="min-w-[200px]">
            <SelectValue placeholder="Filter Origins" />
          </SelectTrigger>
          <SelectContent>
            {originOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          placeholder="Search content"
          value={searchContent}
          onChange={(e) => setSearchContent(e.target.value)}
          className="w-[250px]"
        />
        <div className="text-sm text-muted-foreground self-center">
          (Date pickers: start/end dates placeholder)
        </div>
        <Button
          variant="outline"
          onClick={() => {
            setStartDate(null);
            setEndDate(null);
          }}
        >
          Live
        </Button>
      </div>

      {isLoading && <Skeleton className="w-full h-50" />}
      {!isLoading && filteredData.length === 0 && <div>No messages.</div>}
      {!isLoading && filteredData.length > 0 && (
        <TableUi>
          <TableHeader className="bg-muted border rounded-lg">
            <TableRow>
              <TableHead className={smallColumnWidth}>Correlation ID</TableHead>
              <TableHead className={smallColumnWidth}>Action-Origin</TableHead>
              <TableHead className={smallColumnWidth}>Timestamp</TableHead>
              <TableHead className={bigColumnWidth}>Content</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((record) => (
              <TableRow
                key={record.id}
                id={`ocpp-row-${record.id}`}
                className={getRowClassName(record)}
              >
                <TableCell className={smallColumnWidth}>
                  <div className="flex items-center gap-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <code className="text-xs bg-muted px-2 py-1 rounded">
                            {record.correlationId?.substring(0, 12) || '-'}…
                          </code>
                        </TooltipTrigger>
                        <TooltipContent>{record.correlationId}</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              findRelatedMessages(record);
                            }}
                          >
                            <Link className={buttonIconSize} />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Find related message</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </TableCell>
                <TableCell className={smallColumnWidth}>
                  <span>
                    {record.action} - {record.origin}
                  </span>
                </TableCell>
                <TableCell className={smallColumnWidth}>
                  {formatDate(record.timestamp, 'YYYY-MM-DD HH:mm:ss.SSS')}
                </TableCell>
                <TableCell className={bigColumnWidth}>
                  <CollapsibleOCPPMessageViewer
                    ocppMessage={record.message}
                    unparsed={typeof record.message === 'string'}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </TableUi>
      )}
    </div>
  );
};
