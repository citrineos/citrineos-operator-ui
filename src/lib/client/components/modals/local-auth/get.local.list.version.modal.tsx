// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0
'use client';

import { type ChargingStationDto, OCPPVersion } from '@citrineos/base';
import { Button } from '@lib/client/components/ui/button';
import { ChargingStationClass } from '@lib/cls/charging.station.dto';
import type { MessageConfirmation } from '@lib/utils/MessageConfirmation';
import { triggerMessageAndHandleResponse } from '@lib/utils/messages.utils';
import { closeModal } from '@lib/utils/store/modal.slice';
import { plainToInstance } from 'class-transformer';
import { useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useTenantId } from '@lib/client/hooks/useTenantId';

export interface GetLocalListVersionModalProps {
  station: any;
}

export const GetLocalListVersionModal = ({
  station,
}: GetLocalListVersionModalProps) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const tenantId = useTenantId();

  const parsedStation: ChargingStationDto = useMemo(
    () => plainToInstance(ChargingStationClass, station),
    [station],
  ) as ChargingStationDto;

  const handleSubmit = async () => {
    if (!parsedStation?.id) {
      return;
    }
    await triggerMessageAndHandleResponse<MessageConfirmation[]>({
      url: `/evdriver/getLocalListVersion?identifier=${parsedStation.id}&tenantId=${tenantId}`,
      data: {},
      setLoading,
      ocppVersion: parsedStation.protocol as OCPPVersion,
    });
    dispatch(closeModal());
  };

  return (
    <div className="space-y-6">
      <div className="text-sm text-muted-foreground">
        <p>
          Ask the charger to report the version number of its current local
          authorization list. The persisted version on the server will be
          updated when the response arrives.
        </p>
      </div>
      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => dispatch(closeModal())}
        >
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? 'Sending...' : 'Get Version'}
        </Button>
      </div>
    </div>
  );
};
