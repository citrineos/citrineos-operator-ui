import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { RootState } from './store';
import { SelectedChargingStationState } from '@interfaces';
import { ChargingStation } from '../pages/charging-stations/ChargingStation';

const initialState: SelectedChargingStationState = {
  chargingStations: new Map(),
};

const selectedChargingStationSlice = createSlice({
  name: 'selectedChargingStation',
  initialState,
  reducers: {
    /**
     * Adds or updates selected charging stations in the state.
     * Converts an array of ChargingStation into a Map for efficient lookups.
     */
    setSelectedChargingStations: (
      state,
      action: PayloadAction<ChargingStation[]>,
    ) => {
      state.chargingStations = new Map(
        action.payload.map((station) => [station.id, station]),
      );
    },
  },
});

// Memoized selector to get an array of ChargingStation from the Map
export const selectedChargingStation = createSelector(
  (state: RootState) => state.selectedChargingStationSlice.chargingStations,
  (chargingStations) => Array.from(chargingStations.values()),
);

export const getSelectedChargingStation = () =>
  createSelector(
    (state: RootState) => state.selectedChargingStationSlice.chargingStations,
    (chargingStations) => Array.from(chargingStations.values()),
  );

export const { setSelectedChargingStations } =
  selectedChargingStationSlice.actions;

export default selectedChargingStationSlice.reducer;
