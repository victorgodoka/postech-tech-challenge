"use client";
import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from './index';
import { initializeAuth } from './slices/authSlice';

interface ReduxProviderProps {
  children: React.ReactNode;
}

export const ReduxProvider: React.FC<ReduxProviderProps> = ({ children }) => {
  useEffect(() => {
    // Initialize auth state when the app starts
    store.dispatch(initializeAuth());
  }, []);

  return <Provider store={store}>{children}</Provider>;
};
