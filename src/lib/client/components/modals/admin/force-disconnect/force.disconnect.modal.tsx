// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { HttpMethod, type ChargingStationDto } from '@citrineos/base';
import { ChargingStationClass } from '@lib/cls/charging.station.dto';
import type { MessageConfirmation } from '@lib/utils/MessageConfirmation';
import { triggerMessageAndHandleResponse } from '@lib/utils/messages.utils';
import { closeModal } from '@lib/utils/modal.slice';
import { plainToInstance } from 'class-transformer';
import React, { useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import z from 'zod';
import { Button } from '@lib/client/components/ui/button';

export interface ForceDisconnectModalProps {
  station: ChargingStationDto;
}

export const ForceDisconnectModal = ({
  station,
}: ForceDisconnectModalProps) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const parsedStation: ChargingStationDto = useMemo(
    () => plainToInstance(ChargingStationClass, station),
    [station],
  ) as ChargingStationDto;

  const onOkay = async () => {
    await triggerMessageAndHandleResponse<MessageConfirmation[]>({
      url: `/ocpprouter/connection?stationId=${parsedStation.id}&tenantId=${parsedStation.tenantId}`,
      data: undefined,
      setLoading,
      ocppVersion: null,
      method: HttpMethod.Delete,
    });

    dispatch(closeModal());
  };

  const onCancel = async () => {
    dispatch(closeModal());
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          Force Disconnect Station
        </h3>
        <div className="mt-2">
          <p className="text-sm text-gray-500">
            Are you sure you want to force disconnect charging station{' '}
            <span className="font-medium">{parsedStation.id}</span>?
          </p>
          <p className="text-sm text-gray-500 mt-1">
            This will immediately close the connection to the station.
          </p>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <Button variant="outline" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button variant="destructive" onClick={onOkay} disabled={loading}>
          {loading ? 'Disconnecting...' : 'Force Disconnect'}
        </Button>
      </div>
    </div>
  );
};
