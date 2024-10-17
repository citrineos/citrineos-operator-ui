import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';
import { instanceToPlain } from 'class-transformer';
import { LABEL_FIELD } from '../util/decorators/LabelField';
import { PRIMARY_KEY_FIELD_NAME } from '../util/decorators/PrimaryKeyFieldName';

interface Model {
  id: string;
  [key: string]: any;
}

interface SelectionState {
  models: { [key: string]: any };
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
      action: PayloadAction<{ storageKey: string; selectedRows: string }>,
    ) => {
      const { storageKey, selectedRows } = action.payload;
      const existingModelsString = state.models[storageKey];
      const existingModels: Model[] = existingModelsString
        ? JSON.parse(existingModelsString)
        : JSON.parse(selectedRows);

      const selectedRowsArray: Model[] = JSON.parse(selectedRows);
      selectedRowsArray.forEach((row) => {
        if (!existingModels.some((model) => model.id === row.id)) {
          existingModels.push(row);
        }
      });

      state.models[storageKey] = JSON.stringify(
        instanceToPlain(existingModels),
      );
    },
  },
});

export const getSelectedKeyValue = (storageKey: string, associatedRecordClassInstance: object) =>
  createSelector(
    (state: RootState) => state.selectedAssociatedItems.models,
    (models: any) => {
      const label = Reflect.getMetadata(
        LABEL_FIELD,
        associatedRecordClassInstance,
      );
      const primaryKeyFieldName: string = Reflect.getMetadata(
        PRIMARY_KEY_FIELD_NAME,
        associatedRecordClassInstance,
      );
      const labelKey = label || primaryKeyFieldName;
      if (models[storageKey] !== undefined) {
        const parsedModels = JSON.parse(models[storageKey]) as Model[];
        return parsedModels.map((model) => model[labelKey]).join(', ');
      }
    },
  );

export const { addModelsToStorage } = selectionSlice.actions;
export default selectionSlice.reducer;
