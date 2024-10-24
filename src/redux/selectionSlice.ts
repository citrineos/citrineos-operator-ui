import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';
import { instanceToPlain } from 'class-transformer';

interface SelectionState {
  models: { [key: string]: any };
}

const initialState: SelectionState = {
  models: {},
};

const selectedAssociatedItems = createSlice({
  name: 'selectedAssociatedItems',
  initialState,
  reducers: {
    setSelectedAssociatedItems: (
      state,
      action: PayloadAction<{ storageKey: string; selectedRows: any }>,
    ) => {
      const { storageKey, selectedRows } = action.payload;
      state.models[storageKey] = instanceToPlain(selectedRows);
    },
  },
});

export const getSelectedAssociatedItems = (storageKey: string) =>
  createSelector(
    (state: RootState) => state.selectedAssociatedItems.models,
    (models) => (models[storageKey] ? JSON.parse(models[storageKey]) : []),
  );

export const { setSelectedAssociatedItems } = selectedAssociatedItems.actions;
export default selectedAssociatedItems.reducer;
