// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import {
  ChargingStationStatus,
  getChargingStationStatus,
} from '../../dtos/charging.station.dto';
import GenericTag from '../../components/tag';
import React from 'react';
import { IChargingStationDto } from '@citrineos/base';

export interface ChargingStationStatusTagProps {
  station: IChargingStationDto;
}
export const ChargingStationStatusTag = ({
  station,
}: ChargingStationStatusTagProps) => {
  const status = getChargingStationStatus(station);
  return (
    <GenericTag
      colorMap={{
        [ChargingStationStatus.AVAILABLE]: 'green',
        [ChargingStationStatus.CHARGING]: 'blue',
        [ChargingStationStatus.CHARGING_SUSPENDED]: 'violet',
        [ChargingStationStatus.UNAVAILABLE]: 'gray',
        [ChargingStationStatus.FAULTED]: 'red',
      }}
      enumType={ChargingStationStatus}
      enumValue={status}
    />
  );
};
