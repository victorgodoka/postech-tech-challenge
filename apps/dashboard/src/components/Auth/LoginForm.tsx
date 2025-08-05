import React, { useState } from 'react';
import { useAuth } from '../../../../../packages/shared/auth/ProtectedRoute';
import { eventBus } from '../../../../../packages/shared/events/EventBus';

interface LoginFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, onError }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const success = await login(email, password);
      
      if (success) {
        // Emitir notificação de sucesso
        eventBus.emit('notification:show', {
          message: 'Login realizado com sucesso!',
          type: 'success'
        });
        
        onSuccess?.();
      } else {
        const errorMsg = 'Credenciais inválidas. Tente novamente.';
        setError(errorMsg);
        onError?.(errorMsg);
        
        // Emitir notificação de erro
        eventBus.emit('notification:show', {
          message: errorMsg,
          type: 'error'
        });
      }
    } catch (err) {
      console.error('Erro ao fazer login:', err);
      const errorMsg = 'Erro interno. Tente novamente mais tarde.';
      setError(errorMsg);
      onError?.(errorMsg);
      
      eventBus.emit('notification:show', {
        message: errorMsg,
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
        Login - Postech Banking
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="seu@email.com"
            disabled={isLoading}
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Senha
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="••••••••"
            disabled={isLoading}
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Entrando...
            </div>
          ) : (
            'Entrar'
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <div className="text-sm text-gray-600 mb-2">Credenciais de teste:</div>
        <div className="text-xs text-gray-500 space-y-1">
          <div><strong>Admin:</strong> admin@postech.com / admin123</div>
          <div><strong>User:</strong> user@postech.com / user123</div>
        </div>
      </div>
    </div>
  );
};
