"use client";

import { useAuth } from "@/hooks/redux/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Dashboard from "./dashboard";
import { redirectToHome } from "@/config";
import { populateDB } from "@/lib/populate";

export default function Home() {
  const { isAuthenticated, loading, session, error } = useAuth();
  const router = useRouter();
  const [countdown, setCountdown] = useState(3);
  const [isPopulating, setIsPopulating] = useState(false);
  const [_, setPopulateCountdown] = useState(3);

  // Logs detalhados para debug (apenas em desenvolvimento)
  if (process.env.NODE_ENV === 'development') {
    console.log('=== DASHBOARD DEBUG ===');
    console.log('isAuthenticated:', isAuthenticated);
    console.log('loading:', loading);
    console.log('session:', session);
    console.log('error:', error);
    console.log('localStorage session:', localStorage.getItem('bank-app-session'));
  }
  
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('=== useEffect DASHBOARD ===');
      console.log('loading:', loading);
      console.log('isAuthenticated:', isAuthenticated);
      console.log('session:', session);
    }
    
    // Popular dados após login
    if (!loading && isAuthenticated && !isPopulating) {
      if (process.env.NODE_ENV === 'development') {
        console.log('Dashboard: Usuário autenticado, populando dados...');
      }
      
      setIsPopulating(true);
      
      // Countdown para popular dados (3 segundos)
      const populateTimer = setInterval(() => {
        setPopulateCountdown(prev => {
          if (prev <= 1) {
            clearInterval(populateTimer);
            // Popular dados após countdown
            populateDB().then(() => {
              if (process.env.NODE_ENV === 'development') {
                console.log('Dashboard: Dados populados com sucesso!');
              }
              setIsPopulating(false);
            }).catch(error => {
              console.error('Erro ao popular dados:', error);
              setIsPopulating(false);
            });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(populateTimer);
    }
    
    // Redirecionar se não autenticado
    if (!loading && !isAuthenticated) {
      if (process.env.NODE_ENV === 'development') {
        console.log('Dashboard: Usuário não autenticado, redirecionando para Home App...');
      }
      
      // Countdown para redirecionamento
      const countdownTimer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(countdownTimer);
            redirectToHome();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(countdownTimer);
    }
  }, [isAuthenticated, loading, session, router, isPopulating]);

  if (loading || isPopulating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
        <div className="text-center">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-800">Carregando Dashboard</h2>
            <p className="text-gray-600">Verificando sua sessão...</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-pulse">
            <h2 className="text-2xl font-bold text-gray-800">Redirecionando...</h2>
            <p className="text-gray-600 mt-2">Você será redirecionado para a página de login em {countdown} segundos.</p>
          </div>
          <div className="flex justify-center">
            <div className="w-8 h-8 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
          </div>
          <button 
            onClick={() => redirectToHome()}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
          >
            Ir agora
          </button>
        </div>
      </div>
    );
  }

  return <main className="min-h-screen flex flex-col">
    <Dashboard />
  </main>;
}

