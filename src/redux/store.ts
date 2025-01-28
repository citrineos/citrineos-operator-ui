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
        ignoredActions: ['counter/addModelsToStorage'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
