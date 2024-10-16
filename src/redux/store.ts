import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './selectionSlice';
import selectedChargingStationSlice from './selectedChargingStationSlice';

const store = configureStore({
  reducer: {
    counter: counterReducer,
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
