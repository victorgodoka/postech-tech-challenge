import { ref, computed } from 'vue';

// Types - equivalente aos tipos do React
export interface Session {
  id: string;
  email: string;
  token: string;
  expiresAt: number;
}

export interface User {
  id?: string;
  email: string;
  name: string;
  password?: string;
}

// Constants
const SESSION_KEY = 'bank-app-session';

// Estado global reativo
const session = ref<Session | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);

// Computed properties
const isAuthenticated = computed(() => !!session.value);

// Cookie utility functions - compatibilidade com Dashboard
export function setSessionCookie(session: Session) {
  const encoded = btoa(JSON.stringify(session));
  const isProduction = import.meta.env.PROD;
  
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
  
  const cookies = document.cookie.split(';');
  const sessionCookie = cookies.find(cookie => cookie.trim().startsWith('session='));
  
  if (!sessionCookie) return null;
  
  try {
    const encoded = sessionCookie.split('=')[1];
    const decoded = atob(encoded);
    const session = JSON.parse(decoded) as Session;
    
    if (Date.now() > session.expiresAt) {
      removeSessionCookie();
      return null;
    }
    
    return session;
  } catch {
    removeSessionCookie();
    return null;
  }
}

// Utility functions - equivalente às funções do React
export async function createSession(user: User): Promise<Session> {
  if (!user.id) {
    throw new Error('User ID is required to create session');
  }
  
  const newSession: Session = {
    id: user.id,
    email: user.email,
    token: btoa(`${user.email}:${Date.now()}`),
    expiresAt: Date.now() + (30 * 60 * 1000) // 30 minutos
  };
  
  // Salvar no localStorage (backup)
  localStorage.setItem(SESSION_KEY, JSON.stringify(newSession));
  
  // Salvar no IndexedDB (principal)
  const idbSession = createSessionData(user.id, user.email);
  await saveSessionToIDB(idbSession);
  
  // Cookies apenas em desenvolvimento
  if (!import.meta.env.PROD) {
    setSessionCookie(newSession);
  }
  
  console.log('Sessão criada e salva no IndexedDB');
  return newSession;
}

export async function getSession(): Promise<Session | null> {
  // Primeiro tentar IndexedDB (principal)
  try {
    const idbSession = await getActiveSessionFromIDB();
    if (idbSession) {
      // Sincronizar com localStorage
      const session: Session = {
        id: idbSession.userId,
        email: idbSession.email,
        token: idbSession.token,
        expiresAt: idbSession.expiresAt
      };
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      return session;
    }
  } catch (error) {
    console.error('Erro ao buscar sessão no IndexedDB:', error);
  }
  
  // Fallback para localStorage
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  
  try {
    const session = JSON.parse(raw) as Session;
    
    // Verificar se a sessão não expirou
    if (session.expiresAt < Date.now()) {
      localStorage.removeItem(SESSION_KEY);
      removeSessionCookie();
      return null;
    }
    
    return session;
  } catch {
    localStorage.removeItem(SESSION_KEY);
    return null;
  }
}

export async function clearSession(): Promise<void> {
  // Limpar localStorage
  localStorage.removeItem(SESSION_KEY);
  
  // Limpar cookies
  removeSessionCookie();
  
  // Limpar IndexedDB
  try {
    await clearAllSessionsFromIDB();
    console.log('Todas as sessões removidas do IndexedDB');
  } catch (error) {
    console.error('Erro ao limpar sessões do IndexedDB:', error);
  }
}

// Import session service
import { 
  saveSessionToIDB, 
  getActiveSessionFromIDB, 
  clearAllSessionsFromIDB,
  createSessionData,
  type Session as IDBSession
} from '../lib/sessionService';

// Import API functions from lib
import { loginUser as apiLoginUser, createUser as apiCreateUser, type User as ApiUser } from '../lib/api';

// Composable principal - equivalente ao useAuth do React
export function useAuth() {
  // Initialize auth on first use
  const initializeAuth = async () => {
    loading.value = true;
    try {
      const currentSession = await getSession();
      session.value = currentSession;
      if (currentSession) {
        console.log('Sessão existente encontrada');
      }
    } catch (err) {
      console.error('Erro ao inicializar autenticação:', err);
      session.value = null;
    } finally {
      loading.value = false;
    }
  };

  // Login function
  const login = async (email: string, password: string) => {
    loading.value = true;
    error.value = null;
    
    try {
      const user = await apiLoginUser(email, password);
      const newSession = await createSession(user);
      session.value = newSession;
      return newSession;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro inesperado ao fazer login';
      error.value = errorMessage;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Register function
  const register = async (userData: { name: string; email: string; password: string }) => {
    loading.value = true;
    error.value = null;
    
    try {
      const user = await apiCreateUser(userData);
      const newSession = await createSession(user);
      session.value = newSession;
      return newSession;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro inesperado ao criar conta';
      error.value = errorMessage;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Logout function
  const logout = async () => {
    await clearSession();
    session.value = null;
    error.value = null;
  };

  // Clear error function
  const clearError = () => {
    error.value = null;
  };

  return {
    // State
    session: computed(() => session.value),
    isAuthenticated,
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    
    // Actions
    initializeAuth,
    login,
    register,
    logout,
    clearError
  };
}
