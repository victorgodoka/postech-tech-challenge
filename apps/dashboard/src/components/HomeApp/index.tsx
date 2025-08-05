'use client';

import React, { Suspense, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Carregamento dinâmico do home app com tratamento de erro
const HomeApp = dynamic(
  () => 
    import('home/App').catch((error) => {
      console.error('Erro ao carregar Home App:', error);
      return {
        default: () => (
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Erro ao carregar Home App
              </h2>
              <p className="text-gray-600 mb-4">
                Verifique se o Home App está rodando em http://localhost:4001
              </p>
              <button
                onClick={() => window.location.reload()}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              >
                Tentar Novamente
              </button>
            </div>
          </div>
        ),
      };
    }),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando Home App...</p>
          <p className="text-sm text-gray-400 mt-2">
            Conectando com http://localhost:4001
          </p>
        </div>
      </div>
    ),
  }
);

// Wrapper para o Home App
export const HomeAppWrapper: React.FC = () => {
  return (
    <div className="w-full h-full">
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Carregando Home App...</p>
            </div>
          </div>
        }
      >
        <HomeApp />
      </Suspense>
    </div>
  );
};

export default HomeAppWrapper;
