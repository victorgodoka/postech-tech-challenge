import { Middleware } from '@reduxjs/toolkit';
import type { RootState } from '../index';

// Logging middleware for development
export const loggingMiddleware: Middleware<{}, RootState> = (store) => (next) => (action) => {
  if (process.env.NODE_ENV === 'development') {
    console.group(`🔄 Action: ${action.type}`);
    console.log('Previous State:', store.getState());
    console.log('Action:', action);
  }
  
  const result = next(action);
  
  if (process.env.NODE_ENV === 'development') {
    console.log('Next State:', store.getState());
    console.groupEnd();
  }
  
  return result;
};

// Analytics middleware for tracking user actions
export const analyticsMiddleware: Middleware<{}, RootState> = (store) => (next) => (action) => {
  const result = next(action);
  
  // Track important user actions
  const trackableActions = [
    'auth/login/fulfilled',
    'auth/logout/fulfilled',
    'transactions/addTransaction/fulfilled',
    'transactions/updateTransaction/fulfilled',
    'transactions/deleteTransaction/fulfilled',
    'accounts/updateAccount/fulfilled'
  ];
  
  if (trackableActions.includes(action.type)) {
    // Here you would send analytics data to your analytics service
    // Example: analytics.track(action.type, { ...action.payload });
    console.log(`📊 Analytics: ${action.type}`, action.payload);
  }
  
  return result;
};

// Error tracking middleware
export const errorTrackingMiddleware: Middleware<{}, RootState> = (store) => (next) => (action) => {
  const result = next(action);
  
  // Track errors from async thunks
  if (action.type.endsWith('/rejected')) {
    console.error(`❌ Error in ${action.type}:`, action.payload);
    
    // Here you would send error data to your error tracking service
    // Example: errorTracker.captureException(action.payload);
  }
  
  return result;
};

// Performance monitoring middleware
export const performanceMiddleware: Middleware<{}, RootState> = (store) => (next) => (action) => {
  const start = performance.now();
  const result = next(action);
  const end = performance.now();
  
  const duration = end - start;
  
  // Log slow actions (> 100ms)
  if (duration > 100) {
    console.warn(`⚠️ Slow action detected: ${action.type} took ${duration.toFixed(2)}ms`);
  }
  
  return result;
};
