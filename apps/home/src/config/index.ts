// Configuração de URLs para diferentes ambientes
function getDashboardUrl(): string {
  const envUrl = import.meta.env.VITE_DASHBOARD_URL;
  const defaultUrl = import.meta.env.DEV 
    ? 'http://localhost:3000' 
    : 'https://postech-tech-challenge-dashboard.vercel.app';
  
  return envUrl || defaultUrl;
}

function getHomeUrl(): string {
  if (typeof window === 'undefined') {
    return import.meta.env.VITE_HOME_URL || 'http://localhost:5173';
  }
  
  return import.meta.env.VITE_HOME_URL || 'https://postech-home.vercel.app';
}

export const config: {
  readonly dashboardUrl: string;
  readonly homeUrl: string;
  readonly isDev: boolean;
  readonly isProd: boolean;
} = {
  // URL do Dashboard Next.js
  dashboardUrl: getDashboardUrl(),
  
  // URL do Home Vue (para referência)
  homeUrl: getHomeUrl(),
  
  // Ambiente atual
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
} as const;

// Função para redirecionar para o dashboard
export function redirectToDashboard(sessionToken?: string): void {
  let dashboardUrl = config.dashboardUrl;
  
  console.log('Redirecionando para dashboard:', dashboardUrl);
  
  if (!dashboardUrl || dashboardUrl === '') {
    console.error('URL do dashboard inválida:', dashboardUrl);
    return;
  }
  
  // Em produção, incluir token de sessão na URL
  if (config.isProd && sessionToken) {
    const separator = dashboardUrl.includes('?') ? '&' : '?';
    dashboardUrl = `${dashboardUrl}${separator}session=${encodeURIComponent(sessionToken)}`;
    console.log('Redirecionando para dashboard com token de sessão');
  }
  
  // Garantir URL absoluta
  const absoluteUrl = dashboardUrl.startsWith('http') ? dashboardUrl : `https://${dashboardUrl}`;
  
  console.log('URL absoluta do dashboard:', absoluteUrl);
  
  if (typeof window !== 'undefined') {
    window.location.replace(absoluteUrl);
  }
}

// Função para obter URL do dashboard (removida - duplicada)
// export function getDashboardUrl(): string {
//   return config.dashboardUrl;
// }
