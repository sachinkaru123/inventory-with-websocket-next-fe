import { configureStore } from '@reduxjs/toolkit';
import inventoryReducer from './inventorySlice';
import notificationReducer from './notificationSlice';

export const store = configureStore({
  reducer: {
    inventory: inventoryReducer,
    notifications: notificationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});
