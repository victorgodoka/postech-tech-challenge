// Configuração de URLs para diferentes ambientes
function getDashboardUrlInternal(): string {
  return import.meta.env.VITE_DASHBOARD_URL || 'https://dashboard.victorgodoka.com.br';
}

function getHomeUrlInternal(): string {
  const envUrl = import.meta.env.VITE_HOME_URL;
  const defaultUrl = import.meta.env.DEV 
    ? 'http://localhost:4001' 
    : 'https://home.victorgodoka.com.br';
    
  return envUrl || defaultUrl;
}

export const config: {
  readonly dashboardUrl: string;
  readonly homeUrl: string;
  readonly isDev: boolean;
  readonly isProd: boolean;
} = {
  // URL do Dashboard Next.js
  dashboardUrl: getDashboardUrlInternal(),
  
  // URL do Home Vue (para referência)
  homeUrl: getHomeUrlInternal(),
  
  // Ambiente atual
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
} as const;

// Função para redirecionar para o dashboard
export function redirectToDashboard(): void {
  const dashboardUrl = config.dashboardUrl;
  console.log('Redirecionando para dashboard:', dashboardUrl);
  
  if (!dashboardUrl || dashboardUrl === '') {
    console.error('URL do dashboard inválida:', dashboardUrl);
    return;
  }
  
  // Garantir URL absoluta
  const absoluteUrl = dashboardUrl.startsWith('http') ? dashboardUrl : `https://${dashboardUrl}`;
  
  // Em produção, transferir sessão via localStorage (mesmo banco IndexedDB)
  if (config.isProd) {
    console.log('Produção: redirecionando com sessão compartilhada via localStorage');
  }
  
  console.log('URL absoluta do dashboard:', absoluteUrl);
  window.location.replace(absoluteUrl);
}

// Função para obter URL do dashboard
export function getDashboardUrl(): string {
  return config.dashboardUrl;
}
