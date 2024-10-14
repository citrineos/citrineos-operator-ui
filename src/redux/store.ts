import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './counterSlice';

// add reducers here
const store = configureStore({
  reducer: {
    counter: counterReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['counter/appendToSessionStorage'],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['payload.selectedRows'],
        // Ignore these paths in the state
        ignoredPaths: ['counter.uniqueIds'],
      },
    }),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;