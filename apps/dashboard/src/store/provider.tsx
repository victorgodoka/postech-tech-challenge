import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from './index';
import { initializeAuth } from './slices/authSlice';

interface ReduxProviderProps {
  children: React.ReactNode;
}

// Componente interno para inicializar auth
const AuthInitializer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    console.log('Redux: Inicializando autenticação...');
    store.dispatch(initializeAuth());
  }, []);

  return <>{children}</>;
};

export const ReduxProvider: React.FC<ReduxProviderProps> = ({ children }) => {
  return (
    <Provider store={store}>
      <AuthInitializer>
        {children}
      </AuthInitializer>
    </Provider>
  );
};
