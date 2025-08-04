import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import transactionSlice from './slices/transactionSlice';
import accountSlice from './slices/accountSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    transactions: transactionSlice,
    accounts: accountSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
