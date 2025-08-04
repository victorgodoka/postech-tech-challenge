'use client';

import React from 'react';
import { ProtectedRoute, useAuth } from '../../../../../packages/shared/auth/ProtectedRoute';

const AdminContent: React.FC = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">
              Painel de Administração
            </h1>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h2 className="text-xl font-semibold text-blue-800 mb-2">
                Informações do Usuário
              </h2>
              <div className="space-y-2 text-sm">
                <p><strong>Nome:</strong> {user?.name}</p>
                <p><strong>Email:</strong> {user?.email}</p>
                <p><strong>ID:</strong> {user?.id}</p>
                <p><strong>Roles:</strong> {user?.roles.join(', ')}</p>
                <p><strong>Permissões:</strong> {user?.permissions.join(', ')}</p>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <h2 className="text-xl font-semibold text-green-800 mb-2">
                Funcionalidades Admin
              </h2>
              <div className="space-y-2">
                <button className="block w-full text-left bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700 transition-colors">
                  Gerenciar Usuários
                </button>
                <button className="block w-full text-left bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700 transition-colors">
                  Configurações do Sistema
                </button>
                <button className="block w-full text-left bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700 transition-colors">
                  Relatórios Avançados
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">
              🔒 Área Protegida
            </h3>
            <p className="text-yellow-700 text-sm">
              Esta página só é acessível por usuários com role 'admin' e permissão 'admin'.
              O sistema de autenticação centralizado garante que apenas usuários autorizados
              possam visualizar este conteúdo.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function AdminPage() {
  return (
    <ProtectedRoute
      requiredRoles={['admin']}
      requiredPermissions={['admin']}
    >
      <AdminContent />
    </ProtectedRoute>
  );
}
