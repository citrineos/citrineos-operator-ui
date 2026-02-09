// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0
'use client';

import { CanAccess, useTranslate } from '@refinedev/core';
import { ActionType, CommandType, ResourceType } from '@lib/utils/access.types';
import { Button } from '@lib/client/components/ui/button';

/**
 * Intended to trigger the "Start Transaction" modal; used by charging stations views.
 */
export const StartTransactionButton = ({
  stationId,
  onClickAction,
  disabled = false,
}: {
  stationId: string;
  onClickAction: () => void;
  disabled?: boolean;
}) => {
  const translate = useTranslate();

  return (
    <CanAccess
      resource={ResourceType.CHARGING_STATIONS}
      action={ActionType.COMMAND}
      params={{
        id: stationId,
        commandType: CommandType.START_TRANSACTION,
      }}
    >
      <Button disabled={disabled} onClick={onClickAction}>
        {translate('ChargingStations.startTransaction')}
      </Button>
    </CanAccess>
  );
};
