"use client";

import { useAuth } from "@/hooks/redux/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Dashboard from "./dashboard";
import { redirectToHome } from "@/config";

export default function Home() {
  const { isAuthenticated, loading, session, error } = useAuth();
  const router = useRouter();

  // Logs detalhados para debug
  console.log('=== DASHBOARD DEBUG ===');
  console.log('isAuthenticated:', isAuthenticated);
  console.log('loading:', loading);
  console.log('session:', session);
  console.log('error:', error);
  console.log('localStorage session:', localStorage.getItem('bank-app-session'));
  
  useEffect(() => {
    console.log('=== useEffect DASHBOARD ===');
    console.log('loading:', loading);
    console.log('isAuthenticated:', isAuthenticated);
    console.log('session:', session);
    
    // REMOVIDO: Redirecionamento automático para debug
    // if (!loading && !isAuthenticated) {
    //   console.log('Dashboard: Usuário não autenticado, redirecionando para Home App...');
    //   redirectToHome();
    // }
  }, [isAuthenticated, loading, session, router]);

  if (loading) {
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
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">Redirecionando...</h2>
          <p className="text-gray-600">Você será redirecionado para a página de login.</p>
        </div>
      </div>
    );
  }

  return <main className="min-h-screen flex flex-col">
    <Dashboard />
  </main>;
}

