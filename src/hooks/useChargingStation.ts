import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { plainToInstance } from 'class-transformer';

import { selectedChargingStation, RootState } from '@redux';
import { ChargingStation } from '../pages/charging-stations/ChargingStation';

// Selector to extract charging stations from the state
const selectChargingStations = (state: RootState) =>
  selectedChargingStation(state);

// Custom hooks for handling Charging Station
export function useSelectedChargingStation(index?: number) {
  const selectedChargingStations = useSelector(selectChargingStations);

  const station = useMemo(() => {
    if (!selectedChargingStations) return [];

    return plainToInstance(ChargingStation, [selectedChargingStations]);
  }, [selectedChargingStations]);

  return index !== undefined ? station[index] : station;
}

export function useSelectedChargingStationIds() {
  const selectedChargingStations = useSelector(selectChargingStations);
  return selectedChargingStations.map((station) => station.id).join(',');
}

export function useSelectedChargingStationCount(length: number) {
  const selectedChargingStations = useSelector(selectChargingStations);

  return selectedChargingStations.length === length;
}
