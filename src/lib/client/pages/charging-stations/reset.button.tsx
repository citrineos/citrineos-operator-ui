// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0
'use client';

import { ActionType, CommandType, ResourceType } from '@lib/utils/access.types';
import { Button } from '@lib/client/components/ui/button';
import { CanAccess, useTranslate } from '@refinedev/core';

/**
 * Intended to trigger the "Reset" modal; used by charging stations views.
 */
export const ResetButton = ({
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
        commandType: CommandType.RESET,
      }}
    >
      <Button variant="outline" disabled={disabled} onClick={onClickAction}>
        {translate('ChargingStations.reset')}
      </Button>
    </CanAccess>
  );
};
