import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './selectionSlice';

const store = configureStore({
  reducer: {
    selectedAssociatedItems: counterReducer,
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
