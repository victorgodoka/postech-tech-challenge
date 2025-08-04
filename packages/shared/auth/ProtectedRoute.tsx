/**
 * Componente de Rota Protegida para Microfrontends
 * Baseado nos conceitos da Aula 4 - Postech
 */

import React, { useEffect, useState, ReactNode } from 'react';
import { authService } from './AuthService';
import { eventBus } from '../events/EventBus';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredPermissions?: string[];
  requiredRoles?: string[];
  fallback?: ReactNode;
  redirectTo?: string;
}

interface LoadingSpinnerProps {
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message = 'Verificando permissões...' }) => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-600">{message}</p>
    </div>
  </div>
);

const AccessDenied: React.FC = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <div className="text-6xl mb-4">🚫</div>
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Acesso Negado</h1>
      <p className="text-gray-600 mb-4">
        Você não tem permissão para acessar esta página.
      </p>
      <button
        onClick={() => window.history.back()}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
      >
        Voltar
      </button>
    </div>
  </div>
);

const LoginRequired: React.FC<{ redirectTo?: string }> = ({ redirectTo }) => {
  useEffect(() => {
    // Salvar URL atual para redirecionamento após login
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('redirect_after_login', window.location.pathname);
    }

    // Redirecionar para página de login se especificado
    if (redirectTo) {
      window.location.href = redirectTo;
    }
  }, [redirectTo]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="text-6xl mb-4">🔐</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Login Necessário</h1>
        <p className="text-gray-600 mb-4">
          Você precisa fazer login para acessar esta página.
        </p>
        {!redirectTo && (
          <button
            onClick={() => {
              // Emitir evento para mostrar modal de login ou redirecionar
              eventBus.emit('navigation:change', {
                from: window.location.pathname,
                to: '/login',
                microfrontend: 'auth'
              });
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Fazer Login
          </button>
        )}
      </div>
    </div>
  );
};

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredPermissions = [],
  requiredRoles = [],
  fallback,
  redirectTo
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [authState, setAuthState] = useState(authService.getAuthState());

  useEffect(() => {
    // Verificar estado inicial
    const checkAuth = () => {
      const currentState = authService.getAuthState();
      setAuthState(currentState);
      setIsLoading(false);
    };

    checkAuth();

    // Escutar mudanças de autenticação
    const unsubscribeLogin = eventBus.on('user:login', () => {
      setAuthState(authService.getAuthState());
    });

    const unsubscribeLogout = eventBus.on('user:logout', () => {
      setAuthState(authService.getAuthState());
    });

    return () => {
      unsubscribeLogin();
      unsubscribeLogout();
    };
  }, []);

  // Mostrar loading enquanto verifica autenticação
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Verificar se usuário está autenticado
  if (!authState.isAuthenticated) {
    if (fallback) {
      return <>{fallback}</>;
    }
    return <LoginRequired redirectTo={redirectTo} />;
  }

  // Verificar permissões necessárias
  if (requiredPermissions.length > 0) {
    const hasAllPermissions = requiredPermissions.every(permission =>
      authService.hasPermission(permission)
    );

    if (!hasAllPermissions) {
      if (fallback) {
        return <>{fallback}</>;
      }
      return <AccessDenied />;
    }
  }

  // Verificar roles necessárias
  if (requiredRoles.length > 0) {
    const hasRequiredRole = requiredRoles.some(role =>
      authService.hasRole(role)
    );

    if (!hasRequiredRole) {
      if (fallback) {
        return <>{fallback}</>;
      }
      return <AccessDenied />;
    }
  }

  // Usuário autenticado e autorizado
  return <>{children}</>;
};

// Hook para usar em componentes funcionais
export const useAuth = () => {
  const [authState, setAuthState] = useState(authService.getAuthState());

  useEffect(() => {
    const unsubscribeLogin = eventBus.on('user:login', () => {
      setAuthState(authService.getAuthState());
    });

    const unsubscribeLogout = eventBus.on('user:logout', () => {
      setAuthState(authService.getAuthState());
    });

    return () => {
      unsubscribeLogin();
      unsubscribeLogout();
    };
  }, []);

  return {
    ...authState,
    login: authService.login.bind(authService),
    logout: authService.logout.bind(authService),
    hasPermission: authService.hasPermission.bind(authService),
    hasRole: authService.hasRole.bind(authService),
  };
};

// HOC para componentes de classe (se necessário)
export const withAuth = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options: Omit<ProtectedRouteProps, 'children'> = {}
) => {
  return (props: P) => (
    <ProtectedRoute {...options}>
      <WrappedComponent {...props} />
    </ProtectedRoute>
  );
};
