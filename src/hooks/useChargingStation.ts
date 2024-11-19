import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { plainToInstance } from 'class-transformer';

import { RootState } from '../redux/store';
import { ChargingStation } from '../pages/charging-stations/ChargingStation';
import { getChargingStations } from '../redux/selectedChargingStationSlice';

// Selector to extract charging stations from the state
const selectChargingStations = (state: RootState) => getChargingStations(state);

// Custom hooks for handling Charging Station
export function useSelectedChargingStation(index?: number) {
  const selectedChargingStation = useSelector(selectChargingStations);

  const station = useMemo(() => {
    if (!selectedChargingStation) return [];

    return plainToInstance(
      ChargingStation,
      Array.isArray(selectedChargingStation)
        ? selectedChargingStation
        : [selectedChargingStation],
    );
  }, [selectedChargingStation]);

  return index !== undefined ? station[index] : station;
}

export function useSelectedChargingStationIds() {
  const selectedChargingStation = useSelectedChargingStation();
  return (
    Array.isArray(selectedChargingStation)
      ? selectedChargingStation
      : [selectedChargingStation]
  )
    .map((station) => station.id)
    .join(',');
}

export function useSelectedChargingStationCount(length: number) {
  const selectedChargingStation = useSelectedChargingStation();
  return (
    (Array.isArray(selectedChargingStation)
      ? selectedChargingStation
      : [selectedChargingStation]
    ).length === length
  );
}
