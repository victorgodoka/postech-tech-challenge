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
    // Produção: cookies seguros
    document.cookie = `session=${encoded}; path=/; max-age=1800; SameSite=Strict; Secure`;
  } else {
    // Desenvolvimento: cookies mais permissivos para localhost
    document.cookie = `session=${encoded}; path=/; max-age=1800; SameSite=Lax`;
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
export function createSession(email: string, userId: string): Session {
  const token = btoa(`${email}:${Date.now()}`);
  const expiresAt = Date.now() + 30 * 60 * 1000; // 30 minutes

  const newSession: Session = { id: userId, email, token, expiresAt };
  localStorage.setItem(SESSION_KEY, JSON.stringify(newSession));
  setSessionCookie(newSession);
  return newSession;
}

export function getSession(): Session | null {
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;

  try {
    const sessionData = JSON.parse(raw) as Session;
    if (Date.now() > sessionData.expiresAt) {
      clearSession();
      return null;
    }
    return sessionData;
  } catch {
    clearSession();
    return null;
  }
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
  removeSessionCookie();
}

// Import API functions from lib
import { loginUser as apiLoginUser, createUser as apiCreateUser, type User as ApiUser } from '../lib/api';

// Composable principal - equivalente ao useAuth do React
export function useAuth() {
  // Initialize auth on first use
  const initializeAuth = () => {
    loading.value = true;
    try {
      const currentSession = getSession();
      session.value = currentSession;
    } catch (err) {
      console.error('Error initializing auth:', err);
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
      const newSession = createSession(user.email, user.id!);
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
      const newSession = createSession(user.email, user.id!);
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
  const logout = () => {
    clearSession();
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
