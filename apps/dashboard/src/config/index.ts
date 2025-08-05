// Configuração de URLs para diferentes ambientes
export const config = {
  // URL do Home Vue.js
  homeUrl: process.env.NEXT_PUBLIC_HOME_URL || 
    (process.env.NODE_ENV === 'development' ? 'http://localhost:4001' : 'https://your-home-domain.vercel.app'),
  
  // URL do Dashboard (para referência)
  dashboardUrl: process.env.NEXT_PUBLIC_DASHBOARD_URL || 
    (process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://your-dashboard-domain.vercel.app'),
  
  // Ambiente atual
  isDev: process.env.NODE_ENV === 'development',
  isProd: process.env.NODE_ENV === 'production',
};

// Função para redirecionar para o home
export function redirectToHome() {
  window.location.href = config.homeUrl;
}

// Função para obter URL do home
export function getHomeUrl() {
  return config.homeUrl;
}
