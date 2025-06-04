// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './association.selection.slice';
import selectedChargingStationSlice from './selected.charging.station.slice';
import modalReducer from './modal.slice';

export const store = configureStore({
  reducer: {
    selectedAssociatedItems: counterReducer,
    selectedChargingStationSlice,
    modal: modalReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['counter/addModelsToStorage'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
