import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';

import { ChargingStations } from '@interfaces';
import { ChargingStation } from '../pages/charging-stations/ChargingStation';

interface SelectedChargingStationState {
  // Store the full data set of charging stations
  chargingStations: ChargingStations[];

  // Store the currently selected charging station
  currentValue: ChargingStations | undefined;

  selectedChargingStation: ChargingStation | undefined;
}

const initialState: SelectedChargingStationState = {
  chargingStations: [],
  currentValue: undefined,
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
    setChargingStations: (state, action: PayloadAction<ChargingStations[]>) => {
      state.chargingStations = action.payload;
    },
    setCurrentValue: (state, action: PayloadAction<{ value: string }>) => {
      state.currentValue = state.chargingStations.find(
        (station) => station.id === action.payload.value,
      );
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

// Selector to get the current selected value
export const getCurrentValue = createSelector(
  (state: RootState) => state.selectedChargingStationSlice.currentValue,
  (currentValue: ChargingStations | undefined) => currentValue,
);

// Selector to get the full list of charging stations
export const getChargingStations = createSelector(
  (state: RootState) => state.selectedChargingStationSlice.chargingStations,
  (chargingStations: ChargingStations[]) => chargingStations,
);

export const {
  setSelectedChargingStation,
  setChargingStations,
  setCurrentValue,
} = selectedChargingStationSlice.actions;

export default selectedChargingStationSlice.reducer;
