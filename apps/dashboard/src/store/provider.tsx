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
    console.log('=== REDUX PROVIDER DEBUG ===');
    console.log('Redux: Inicializando autenticação...');
    console.log('Store state antes:', store.getState().auth);
    console.log('localStorage antes:', localStorage.getItem('bank-app-session'));
    
    // Verificar IndexedDB
    if (typeof window !== 'undefined' && 'indexedDB' in window) {
      console.log('IndexedDB disponível');
    } else {
      console.error('IndexedDB NÃO disponível');
    }
    
    store.dispatch(initializeAuth())
      .then((result) => {
        console.log('initializeAuth resultado:', result);
        console.log('Store state depois:', store.getState().auth);
      })
      .catch((error) => {
        console.error('Erro no initializeAuth:', error);
      });
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
