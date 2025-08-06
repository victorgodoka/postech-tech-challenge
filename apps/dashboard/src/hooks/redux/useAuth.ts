// import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loginAsync, logoutAsync, clearError } from '@/store/slices/authSlice';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { session, isAuthenticated, loading, error } = useAppSelector((state) => state.auth);

  // Logs detalhados do hook useAuth
  console.log('=== USEAUTH HOOK DEBUG ===');
  console.log('useAuth - session:', session);
  console.log('useAuth - isAuthenticated:', isAuthenticated);
  console.log('useAuth - loading:', loading);
  console.log('useAuth - error:', error);
  console.log('useAuth - state.auth completo:', useAppSelector((state) => state.auth));
  console.log('=== FIM USEAUTH HOOK ===');

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
