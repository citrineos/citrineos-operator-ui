import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { RootState } from './store';
import { ChargingStation } from '../pages/charging-stations/ChargingStation';

interface SelectedChargingStationState {
  chargingStations: ChargingStation[];
  selectedChargingStation: ChargingStation | undefined;
}

const initialState: SelectedChargingStationState = {
  chargingStations: [],
  selectedChargingStation: undefined,
};

const selectedChargingStationSlice = createSlice({
  name: 'selectedChargingStation',
  initialState,
  reducers: {
    setSelectedChargingStation: (
      state,
      action: PayloadAction<{ selectedChargingStation: string }>,
    ) => {
      (state as any).selectedChargingStation =
        action.payload.selectedChargingStation;
    },
    setChargingStations: (state, action: PayloadAction<ChargingStation[]>) => {
      state.chargingStations = action.payload;
    },
  },
});

export const getSelectedChargingStation = () =>
  createSelector(
    (state: RootState) =>
      state.selectedChargingStationSlice.selectedChargingStation,
    (selectedChargingStation: any) =>
      selectedChargingStation ? JSON.parse(selectedChargingStation) : undefined,
  );

// Selector to get the full list of charging stations
export const getChargingStations = createSelector(
  (state: RootState) => state.selectedChargingStationSlice.chargingStations,
  (chargingStations: ChargingStation[]) => chargingStations,
);

export const { setSelectedChargingStation, setChargingStations } =
  selectedChargingStationSlice.actions;

export default selectedChargingStationSlice.reducer;
