// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0
'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@lib/client/components/ui/dialog';
import { Dayjs } from 'dayjs';
import { Button } from '@lib/client/components/ui/button';

const createFilterListItem = (label: string, value: string) => (
  <li>
    <span className="font-semibold">{label}:</span> {value}
  </li>
);

const dateFormat = 'YYYY-MM-DD HH:mm:ss';

export const OCPPMessagesExportDialog = ({
  open,
  onOpenChangeAction,
  stationId,
  correlationIdFilter,
  actionsFilter,
  originFilter,
  startDateFilter,
  endDateFilter,
}: {
  open: boolean;
  onOpenChangeAction: (open: boolean) => void;
  stationId: string;
  correlationIdFilter?: string;
  actionsFilter?: string[];
  originFilter?: string;
  startDateFilter?: Dayjs;
  endDateFilter?: Dayjs;
}) => {
  const [loading, setLoading] = useState(false);

  // TODO add lazy query here

  const getMessageBasedOnFilters = () => {
    if (
      !(
        correlationIdFilter ||
        (actionsFilter ?? []).length > 0 ||
        originFilter ||
        startDateFilter ||
        endDateFilter
      )
    ) {
      return `You will download all OCPP messages for charger ${stationId}.`;
    }

    const messagePrefix = `You will download OCPP messages for charger ${stationId} with the following filters: `;
    const messageItems = [];

    if (correlationIdFilter) {
      messageItems.push(
        createFilterListItem('Correlation ID', correlationIdFilter),
      );
    }
    if (actionsFilter && actionsFilter.length > 0) {
      messageItems.push(
        createFilterListItem('Actions', actionsFilter.join(', ')),
      );
    }
    if (originFilter) {
      messageItems.push(createFilterListItem('Origin', originFilter));
    }
    if (startDateFilter) {
      messageItems.push(
        createFilterListItem('Start Date', startDateFilter.format(dateFormat)),
      );
    }
    if (endDateFilter) {
      messageItems.push(
        createFilterListItem('End Date', endDateFilter.format(dateFormat)),
      );
    }

    return (
      <div>
        {messagePrefix}
        <ul>{messageItems}</ul>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChangeAction}>
      <DialogContent className="w-250" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Export OCPP Messages to CSV</DialogTitle>
        </DialogHeader>
        {getMessageBasedOnFilters()}
        <DialogFooter>
          <Button
            variant="outline"
            disabled={loading}
            onClick={() => onOpenChangeAction(false)}
          >
            Cancel
          </Button>
          <Button
            variant="secondary"
            disabled={loading}
            onClick={() => console.log('exporting')}
          >
            Export to CSV
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
