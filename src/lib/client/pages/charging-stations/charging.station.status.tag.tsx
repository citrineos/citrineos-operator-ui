// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import GenericTag from '@lib/client/components/tag';
import {
  ChargingStationStatus,
  getChargingStationStatus,
  type ChargingStationStatusCountsDto,
} from '@lib/cls/charging.station.dto';

export interface ChargingStationStatusTagProps {
  station: ChargingStationStatusCountsDto;
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
