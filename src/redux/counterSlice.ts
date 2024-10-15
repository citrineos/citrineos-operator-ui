import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';

interface Model {
  id: string;
  [key: string]: any;
}

interface CounterState {
  models: Record<string, string>;
}

const initialState: CounterState = {
  models: {},
};

const counterSlice = createSlice({
  name: 'counter',
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

export const getAllUniqueIDs = (storageKey: string) =>
  createSelector(
    (state: RootState) => state.counter.models,
    (models: any) => {
      if (models[storageKey] !== undefined) {
        return (JSON.parse(models[storageKey]) as Model[])
          .map((model) => model.id)
          .join(', ');
      }
    },
  );

export const { addModelsToStorage } = counterSlice.actions;
export default counterSlice.reducer;
