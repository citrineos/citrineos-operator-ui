// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0
'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@lib/client/components/ui/dialog';
import { Button } from '@lib/client/components/ui/button';
import {
  type CrudFilter,
  type LogicalFilter,
  useExport,
  useTranslate,
} from '@refinedev/core';
import { type OCPPMessageDto, OCPPMessageProps } from '@citrineos/base';
import { ResourceType } from '@lib/utils/access.types';
import { GET_OCPP_MESSAGES_LIST_FOR_STATION } from '@lib/queries/ocpp.messages';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const createFilterListItem = (label: string, value: string) => (
  <li key={label}>
    <span className="font-semibold">{label}:</span> {value}
  </li>
);

const dateFormat = 'YYYY-MM-DD HH:mm:ss';

export const OCPPMessagesExportDialog = ({
  open,
  onOpenChangeAction,
  stationId,
  filters,
}: {
  open: boolean;
  onOpenChangeAction: (open: boolean) => void;
  stationId: string;
  filters: CrudFilter[];
}) => {
  const translate = useTranslate();

  const { triggerExport, isLoading } = useExport<OCPPMessageDto>({
    resource: ResourceType.OCPP_MESSAGES,
    sorters: [{ field: OCPPMessageProps.timestamp, order: 'desc' }],
    meta: {
      gqlQuery: GET_OCPP_MESSAGES_LIST_FOR_STATION,
      gqlVariables: { stationId },
    },
    filters,
    download: true,
    filename: `ocpp-messages-${stationId}-${Date.now()}`,
    pageSize: 100,
    mapData: (ocppMessage) => {
      return {
        stationId: ocppMessage.stationId,
        correlationId: ocppMessage.correlationId,
        timestamp: ocppMessage.timestamp,
        origin: ocppMessage.origin,
        protocol: ocppMessage.protocol,
        action: ocppMessage.action,
        message: JSON.stringify(ocppMessage.message),
      };
    },
  });

  const getMessageBasedOnFilters = () => {
    if (filters.length === 0) {
      return `You will download all OCPP messages for charger ${stationId}.`;
    }

    const messagePrefix = `You will download OCPP messages for charger ${stationId} with the following filters: `;
    const messageItems = [];

    const filterList: LogicalFilter[] = filters[0].value;

    const correlationIdFilter = filterList.find(
      (f) => f.field === OCPPMessageProps.correlationId,
    );
    const actionsFilter = filterList.find(
      (f) => f.field === OCPPMessageProps.action,
    );
    const originFilter = filterList.find(
      (f) => f.field === OCPPMessageProps.origin,
    );
    const startDateFilter = filterList.find(
      (f) => f.field === OCPPMessageProps.timestamp && f.operator === 'gte',
    );
    const endDateFilter = filterList.find(
      (f) => f.field === OCPPMessageProps.timestamp && f.operator === 'lte',
    );

    if (correlationIdFilter) {
      messageItems.push(
        createFilterListItem('Correlation ID', correlationIdFilter.value),
      );
    }
    if (actionsFilter && actionsFilter.value.length > 0) {
      messageItems.push(
        createFilterListItem('Actions', actionsFilter.value.join(', ')),
      );
    }
    if (originFilter) {
      messageItems.push(createFilterListItem('Origin', originFilter.value));
    }
    if (startDateFilter) {
      messageItems.push(
        createFilterListItem(
          'Start Date',
          startDateFilter.value.format(dateFormat),
        ),
      );
    }
    if (endDateFilter) {
      messageItems.push(
        createFilterListItem(
          'End Date',
          endDateFilter.value.format(dateFormat),
        ),
      );
    }

    return (
      <div>
        {messagePrefix}
        <ul>{messageItems}</ul>
      </div>
    );
  };

  const exportToCsv = () => {
    triggerExport()
      .then(() => {
        onOpenChangeAction(false);
      })
      .catch((err) => {
        toast.error(`Could export to CSV due to error: ${JSON.stringify(err)}`);
      });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChangeAction}>
      <DialogContent className="w-250" showCloseButton={false}>
        <DialogHeader>
          <div className="flex items-center gap-1">
            <DialogTitle>Export OCPP Messages to CSV</DialogTitle>
            {isLoading && <Loader2 className="size-6 animate-spin" />}
          </div>
        </DialogHeader>
        {getMessageBasedOnFilters()}
        <DialogFooter>
          <Button
            variant="outline"
            disabled={isLoading}
            onClick={() => onOpenChangeAction(false)}
          >
            {translate('buttons.cancel')}
          </Button>
          <Button
            variant="secondary"
            disabled={isLoading}
            onClick={exportToCsv}
          >
            {translate('buttons.exportToCsv')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
