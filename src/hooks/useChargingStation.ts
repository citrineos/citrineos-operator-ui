import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { plainToInstance } from 'class-transformer';

import { ChargingStation } from '../pages/charging-stations/ChargingStation';
import { getSelectedChargingStation } from '../redux/selectedChargingStationSlice';

// Custom hook for handling selected Charging Station
export function useSelectedChargingStation() {
  const selectedChargingStation = useSelector((state: RootState) =>
    getSelectedChargingStation()(state),
  );

  const station = useMemo(() => {
    return plainToInstance(
      ChargingStation,
      Array.isArray(selectedChargingStation)
        ? selectedChargingStation
        : [selectedChargingStation],
    )[0];
  }, [selectedChargingStation]);

  return station;
}
