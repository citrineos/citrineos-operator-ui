import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';
import { ChargingStation } from '../pages/charging-stations/ChargingStation';

interface SelectedChargingStationState {
  selectedChargingStation: ChargingStation | undefined;
}

const initialState: SelectedChargingStationState = {
  selectedChargingStation: undefined,
};

const selectedChargingStationSlice = createSlice({
  name: 'selectedChargingStation',
  initialState,
  reducers: {
    setSelectedChargingStation: (
      state,
      action: PayloadAction<{ selectedChargingStation: ChargingStation }>,
    ) => {
      (state as any).selectedChargingStation =
        action.payload.selectedChargingStation;
    },
  },
});

export const getSelectedChargingStation = () =>
  createSelector(
    (state: RootState) =>
      state.selectedChargingStationSlice.selectedChargingStation,
    (selectedChargingStation: any) => JSON.parse(selectedChargingStation),
  );

export const { setSelectedChargingStation } =
  selectedChargingStationSlice.actions;
export default selectedChargingStationSlice.reducer;