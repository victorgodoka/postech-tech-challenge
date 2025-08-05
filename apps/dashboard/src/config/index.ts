// Configuração de URLs para diferentes ambientes
function getHomeUrlInternal(): string {
  const envUrl = process.env.NEXT_PUBLIC_HOME_URL;
  const defaultUrl = process.env.NODE_ENV === 'development' 
    ? 'http://localhost:4001' 
    : 'https://your-home-domain.vercel.app';
  
  return envUrl || defaultUrl;
}

function getDashboardUrlInternal(): string {
  const envUrl = process.env.NEXT_PUBLIC_DASHBOARD_URL;
  const defaultUrl = process.env.NODE_ENV === 'development' 
    ? 'http://localhost:3000' 
    : 'https://your-dashboard-domain.vercel.app';
  
  return envUrl || defaultUrl;
}

export const config = {
  // URL do Home Vue.js
  homeUrl: getHomeUrlInternal(),
  
  // URL do Dashboard (para referência)
  dashboardUrl: getDashboardUrlInternal(),
  
  // Ambiente atual
  isDev: process.env.NODE_ENV === 'development',
  isProd: process.env.NODE_ENV === 'production',
} as const;

// Função para redirecionar para o home
export function redirectToHome(): void {
  const homeUrl = config.homeUrl;
  console.log('Redirecionando para:', homeUrl);
  console.log('Tipo de homeUrl:', typeof homeUrl);
  console.log('Valor de homeUrl:', JSON.stringify(homeUrl));
  
  // Verificar se é uma URL válida
  if (!homeUrl || homeUrl === 'undefined') {
    console.error('URL do home inválida:', homeUrl);
    return;
  }
  
  // Usar replace para evitar problemas de navegação
  if (typeof window !== 'undefined') {
    try {
      // Forçar URL absoluta
      const absoluteUrl = homeUrl.startsWith('http') ? homeUrl : `http://${homeUrl}`;
      console.log('URL absoluta:', absoluteUrl);
      window.location.replace(absoluteUrl);
    } catch (error) {
      console.error('Erro ao redirecionar:', error);
      // Fallback
      window.location.href = homeUrl;
    }
  }
}

// Função para obter URL do home
export function getHomeUrl(): string {
  return config.homeUrl;
}
