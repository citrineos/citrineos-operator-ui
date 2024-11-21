import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './associationSelectionSlice';
import selectedChargingStationSlice from './selectedChargingStationSlice';

const store = configureStore({
  reducer: {
    selectedAssociatedItems: counterReducer,
    selectedChargingStationSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['selectedChargingStation/setSelectedChargingStations'],
        // Ignore these field paths in all actions
        ignoredActionPaths: [
          'meta.arg',
          'payload.createdAt',
          'payload.updatedAt',
        ],
        // Ignore these paths in the state
        ignoredPaths: ['selectedChargingStationSlice.chargingStations'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
