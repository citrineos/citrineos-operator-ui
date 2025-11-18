// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0
'use client';

import type { EvseDto } from '@citrineos/base';
import { MenuSection } from '@lib/client/components/main-menu/main.menu';
import { ChargerStatusEnum } from '@lib/client/pages/overview/charger-activity/charger.activity.card';
import { Circle } from '@lib/client/pages/overview/circle/circle';
import type { ChargingStationDetailsDto } from '@lib/cls/charging.station.dto';
import { useRouter } from 'next/navigation';
import React from 'react';

export interface ChargerRowProps {
  chargingStation: ChargingStationDetailsDto;
  evse?: EvseDto;
  lastStatus?: ChargerStatusEnum;
  circleColor?: string;
}

export const ChargerRow: React.FC<ChargerRowProps> = ({
  chargingStation,
  evse,
  lastStatus,
  circleColor,
}) => {
  const { push } = useRouter();
  const label = evse
    ? `${chargingStation.id}:EVSE ${evse.id}`
    : chargingStation.id;

  return (
    <div className="flex">
      <div className="flex flex-col flex-1">
        <div
          className="flex justify-between cursor-pointer"
          onClick={() =>
            push(`/${MenuSection.CHARGING_STATIONS}/${chargingStation.id}`)
          }
        >
          <div className="flex items-center gap-2">
            <strong>
              Station: <span className="link">{label}</span>
            </strong>
            <Circle color={circleColor} status={lastStatus} />
          </div>
        </div>
        <div
          className="flex justify-between cursor-pointer"
          onClick={() =>
            push(`/${MenuSection.LOCATIONS}/${chargingStation.location?.id}`)
          }
        >
          <div>
            Location:{' '}
            <span className="link">{chargingStation.location?.name}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
