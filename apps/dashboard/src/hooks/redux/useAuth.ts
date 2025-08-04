import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loginAsync, logoutAsync, clearError } from '@/store/slices/authSlice';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { session, isAuthenticated, loading, error } = useAppSelector((state) => state.auth);

  const login = async (email: string, password: string) => {
    return dispatch(loginAsync({ email, password }));
  };

  const logout = () => {
    dispatch(logoutAsync());
  };

  const clearAuthError = () => {
    dispatch(clearError());
  };

  return {
    session,
    isAuthenticated,
    loading,
    error,
    login,
    logout,
    clearError: clearAuthError,
  };
};
