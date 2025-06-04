// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import {
  ChargignStationStatus,
  ChargingStationDto,
  getChargingStationStatus,
} from '../../dtos/charging.station.dto';
import GenericTag from '../../components/tag';
import React from 'react';

export interface ChargingStationStatusTagProps {
  station: ChargingStationDto;
}
export const ChargingStationStatusTag = ({
  station,
}: ChargingStationStatusTagProps) => {
  const status = getChargingStationStatus(station);
  return (
    <GenericTag
      colorMap={{
        [ChargignStationStatus.AVAILABLE]: 'green',
        [ChargignStationStatus.CHARGING]: 'blue',
        [ChargignStationStatus.CHARGING_SUSPENDED]: 'violet',
        [ChargignStationStatus.UNAVAILABLE]: 'gray',
        [ChargignStationStatus.FAULTED]: 'red',
      }}
      enumType={ChargignStationStatus}
      enumValue={status}
    />
  );
};
