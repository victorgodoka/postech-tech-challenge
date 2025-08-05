import { Middleware, AnyAction } from '@reduxjs/toolkit';
import type { RootState } from '../index';

// Logging middleware for development
export const loggingMiddleware: Middleware<object, RootState> = (_store) => (next) => (action) => {
  const typedAction = action as AnyAction;
  
  if (process.env.NODE_ENV === 'development') {
    console.group(`🔄 Action: ${typedAction.type}`);
    console.log('Previous State:', _store.getState());
    console.log('Action:', typedAction);
  }
  
  const result = next(action);
  
  if (process.env.NODE_ENV === 'development') {
    console.log('Next State:', _store.getState());
    console.groupEnd();
  }
  
  return result;
};

// Analytics middleware for tracking user actions
export const analyticsMiddleware: Middleware<object, RootState> = (_store) => (next) => (action) => {
  const result = next(action);
  const typedAction = action as AnyAction;
  
  const trackableActions = [
    'auth/login/fulfilled',
    'auth/logout/fulfilled',
    'transactions/addTransaction/fulfilled',
    'transactions/updateTransaction/fulfilled',
    'transactions/deleteTransaction/fulfilled',
    'accounts/updateAccount/fulfilled'
  ];
  
  if (trackableActions.includes(typedAction.type)) {
    // Here you would send analytics data to your analytics service
    // Example: analytics.track(typedAction.type, { ...typedAction.payload });
    console.log(`📊 Analytics: ${typedAction.type}`, typedAction.payload);
  }
  
  return result;
};

// Error tracking middleware
export const errorTrackingMiddleware: Middleware<object, RootState> = (_store) => (next) => (action) => {
  const result = next(action);
  const typedAction = action as AnyAction;
  
  // Track errors from async thunks
  if (typedAction.type.endsWith('/rejected')) {
    console.error(`❌ Error in ${typedAction.type}:`, typedAction.payload);
    // Here you would send error data to your error tracking service
    // Example: errorTracker.captureException(typedAction.payload);
  }
  
  return result;
};

// Performance monitoring middleware
export const performanceMiddleware: Middleware<object, RootState> = (_store) => (next) => (action) => {
  const typedAction = action as AnyAction;
  const start = performance.now();
  const result = next(action);
  const end = performance.now();
  
  const duration = end - start;
  
  // Log slow actions (> 100ms)
  if (duration > 100) {
    console.warn(`⚠️ Slow action detected: ${typedAction.type} took ${duration.toFixed(2)}ms`);
  }
  
  return result;
};
