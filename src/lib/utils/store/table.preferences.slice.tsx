// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0
import { ResourceType } from '@lib/utils/access.types';
import {
  createSelector,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit';

/**
 * On a table-by-table basis for more flexibility. If a table
 * is not represented in this state, assumes default values.
 */
interface TablePreferencesState {
  visibleColumns: Partial<Record<ResourceType, string[]>>;
}

export const tablePreferencesSliceKey = 'tablePreferences';

const initialState: TablePreferencesState = {
  visibleColumns: {},
};

export const tablePreferencesSlice = createSlice({
  name: tablePreferencesSliceKey,
  initialState,
  reducers: {
    setVisibleColumnsPreference: (
      state,
      action: PayloadAction<{
        resource: ResourceType;
        columns: string[];
      }>,
    ) => {
      state.visibleColumns = {
        ...state.visibleColumns,
        [action.payload.resource]: [...action.payload.columns],
      };
    },
  },
});

export const getVisibleColumnsPreference = createSelector(
  [(state) => state[tablePreferencesSliceKey], (_state, resource) => resource],
  (state: TablePreferencesState, resource: ResourceType) =>
    state.visibleColumns[resource] ?? null,
);

export const { setVisibleColumnsPreference } = tablePreferencesSlice.actions;
