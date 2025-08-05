// Configuração de URLs para diferentes ambientes
export const config = {
  // URL do Dashboard Next.js
  dashboardUrl: import.meta.env.VITE_DASHBOARD_URL || 
    (import.meta.env.DEV ? 'http://localhost:3000' : ''),
  
  // URL do Home Vue (para referência)
  homeUrl: import.meta.env.VITE_HOME_URL || 
    (import.meta.env.DEV ? 'http://localhost:4001' : ''),
  
  // Ambiente atual
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
};

// Função para redirecionar para o dashboard
export function redirectToDashboard() {
  window.location.href = config.dashboardUrl;
}

// Função para obter URL do dashboard
export function getDashboardUrl() {
  return config.dashboardUrl;
}
