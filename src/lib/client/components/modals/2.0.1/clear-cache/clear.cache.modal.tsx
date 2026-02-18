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

export interface ClearCacheModalProps {
  station: any;
}

export const ClearCacheModal = ({ station }: ClearCacheModalProps) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const parsedStation: ChargingStationDto = useMemo(
    () => plainToInstance(ChargingStationClass, station),
    [station],
  ) as ChargingStationDto;

  const handleSubmit = async () => {
    if (!parsedStation?.id) {
      console.error(
        'Error: Cannot submit Clear Cache request because station ID is missing.',
      );
      return;
    }

    await triggerMessageAndHandleResponse<MessageConfirmation[]>({
      url: `/evdriver/clearCache?identifier=${parsedStation.id}&tenantId=1`,
      data: {},
      setLoading,
      ocppVersion: OCPPVersion.OCPP2_0_1,
    });

    dispatch(closeModal());
  };

  return (
    <div className="space-y-6">
      <div className="text-sm text-muted-foreground">
        <p>
          This will send a Clear Cache request to the charging station. The
          station will clear its authorization cache.
        </p>
        <p className="mt-2">Do you want to proceed?</p>
      </div>

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => dispatch(closeModal())}
        >
          Cancel
        </Button>
        <Button variant="secondary" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Clearing...' : 'Clear Cache'}
        </Button>
      </div>
    </div>
  );
};
