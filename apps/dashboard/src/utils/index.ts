
'use client';

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

export type Session = {
  id: string;
  email: string;
  token: string;
  expiresAt: number;
};

const SESSION_KEY = "bank-app-session";

export function createSession(email: string, id: string, durationMinutes = 30): Session {
  const now = Date.now();
  const expiresAt = now + durationMinutes * 60 * 1000;
  const token = crypto.randomUUID();

  const session: Session = { email, token, expiresAt, id };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

export function getSession(): Session | null {
  const isDev = process.env.NODE_ENV === 'development';
  
  if (isDev) {
    console.log('=== UTILS GETSESSION DEBUG ===');
  }
  
  // Primeiro verificar localStorage
  const raw = localStorage.getItem(SESSION_KEY);
  if (isDev) console.log('utils getSession - raw localStorage:', raw);
  
  if (raw) {
    try {
      const session = JSON.parse(raw) as Session;
      if (isDev) {
        console.log('utils getSession - session parsed:', session);
        console.log('utils getSession - agora:', Date.now());
        console.log('utils getSession - expira em:', session.expiresAt);
        console.log('utils getSession - expirou?', Date.now() > session.expiresAt);
      }
      
      if (Date.now() > session.expiresAt) {
        if (isDev) console.log('utils getSession - sessão expirada, limpando');
        clearSession();
        return null;
      }
      if (isDev) console.log('utils getSession - sessão válida do localStorage, retornando');
      return session;
    } catch (error) {
      if (isDev) console.error('utils getSession - erro ao parsear localStorage:', error);
      clearSession();
    }
  }
  
  // Se não encontrou no localStorage, verificar cookies
  if (isDev) console.log('utils getSession - localStorage vazio, verificando cookies...');
  
  try {
    const cookieSession = getSessionCookie();
    if (isDev) console.log('utils getSession - cookie session:', cookieSession);
    
    if (cookieSession) {
      // Verificar se cookie não expirou
      if (Date.now() > cookieSession.expiresAt) {
        if (isDev) console.log('utils getSession - cookie expirado');
        removeSessionCookie();
        return null;
      }
      
      // Sincronizar cookie com localStorage
      localStorage.setItem(SESSION_KEY, JSON.stringify(cookieSession));
      if (isDev) console.log('utils getSession - cookie válido, sincronizado com localStorage');
      return cookieSession;
    }
  } catch (error) {
    if (isDev) console.error('utils getSession - erro ao ler cookie:', error);
  }
  
  if (isDev) console.log('utils getSession - nenhuma sessão encontrada');
  return null;
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
  removeSessionCookie();
}

export function setSessionCookie(session: Session) {
  const encoded = btoa(JSON.stringify(session));
  const isProduction = process.env.NODE_ENV === 'production';
  
  if (isProduction) {
    // Produção: cookies compartilhados entre subdomínios
    document.cookie = `session=${encoded}; domain=.victorgodoka.com.br; path=/; max-age=1800; SameSite=Lax; Secure`;
    console.log('Cookie de sessão configurado para domínio compartilhado: .victorgodoka.com.br');
  } else {
    // Desenvolvimento: cookies para localhost
    document.cookie = `session=${encoded}; path=/; max-age=1800; SameSite=Lax`;
    console.log('Cookie de sessão configurado para desenvolvimento');
  }
}

export function removeSessionCookie() {
  document.cookie = "session=; path=/; max-age=0";
}

export function getSessionCookie(): Session | null {
  if (typeof document === "undefined") return null;

  const cookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith("session="));

  if (!cookie) return null;

  try {
    // O valor do cookie está codificado em base64
    const encoded = cookie.split("=")[1];
    const decoded = atob(encoded);
    return JSON.parse(decoded) as Session;
  } catch (error) {
    console.error('Erro ao decodificar cookie de sessão:', error);
    return null;
  }
}
