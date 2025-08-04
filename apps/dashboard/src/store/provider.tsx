"use client";
import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { store } from './index';
import { initializeAuth } from './slices/authSlice';

interface ReduxProviderProps {
  children: React.ReactNode;
}

export const ReduxProvider: React.FC<ReduxProviderProps> = ({ children }) => {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Ensure we're on the client side before initializing
    setIsHydrated(true);
    // Initialize auth state after hydration
    store.dispatch(initializeAuth());
  }, []);

  // Prevent hydration mismatch by not rendering until client-side
  if (!isHydrated) {
    return <Provider store={store}>{children}</Provider>;
  }

  return <Provider store={store}>{children}</Provider>;
};
