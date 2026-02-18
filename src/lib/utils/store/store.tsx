// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { combineSlices, configureStore } from '@reduxjs/toolkit';
import { associationSelectionSlice } from '@lib/utils/store/association.selection.slice';
import { selectedChargingStationSlice } from '@lib/utils/store/selected.charging.station.slice';
import { modalSlice } from '@lib/utils/store/modal.slice';
import { mapsSlice } from '@lib/utils/store/maps.slice';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// https://github.com/rt2zz/redux-persist/blob/master/docs/api.md#type-persistconfig
const persistConfig = {
  key: 'root',
  storage,
  whitelist: [],
};

const slices = [
  associationSelectionSlice,
  selectedChargingStationSlice,
  modalSlice,
  mapsSlice,
];

export const store = configureStore({
  reducer: persistReducer(persistConfig, combineSlices(...slices)),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['counter/addModelsToStorage'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
