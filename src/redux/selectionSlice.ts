import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';

interface Model {
  id: string;
  [key: string]: any;
}

interface SelectionState {
  models: Record<string, string>;
}

const initialState: SelectionState = {
  models: {},
};

const selectionSlice = createSlice({
  name: 'selections',
  initialState,
  reducers: {
    addModelsToStorage: (
      state,
      action: PayloadAction<{ storageKey: string; selectedRows: Model[] }>,
    ) => {
      const { storageKey, selectedRows } = action.payload;

      const existingModelsString = state.models[storageKey];
      const existingModels: Model[] = existingModelsString
        ? JSON.parse(existingModelsString)
        : [];

      selectedRows.forEach((row) => {
        if (!existingModels.some((model) => model.id === row.id)) {
          existingModels.push(row);
        }
      });
      state.models[storageKey] = JSON.stringify(existingModels);
    },
  },
});

export const selectModelsByKey = (storageKey: string) =>
  createSelector(
    (state: RootState) => state.counter.models,
    (models: any) => models[storageKey],
  );

export const getAllUniqueNames = (storageKey: string) =>
  createSelector(
    (state: RootState) => state.counter.models,
    (models: any) => {
      if (models[storageKey] !== undefined) {
        return (JSON.parse(models[storageKey]) as Model[])
          .map((model) => model.name)
          .join(', ');
      }
    },
  );

export const { addModelsToStorage } = selectionSlice.actions;
export default selectionSlice.reducer;
