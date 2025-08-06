import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Session, getSession, createSession, clearSession as destroySession } from '@/utils';
import { loginUser } from '@/lib/api';
import { setSessionCookie, removeSessionCookie } from '@/utils';
import { 
  getActiveSessionFromIDB, 
  saveSessionToIDB, 
  clearAllSessionsFromIDB,
  createSessionData
} from '@/lib/sessionService';
// import { authService, User } from '../../../../../packages/shared/auth/AuthService';
// import { eventBus } from '../../../../../packages/shared/events/EventBus';

interface AuthState {
  session: Session | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  user: Record<string, unknown> | null;
  token: string | null;
}

const initialState: AuthState = {
  session: null,
  isAuthenticated: false,
  loading: true,
  error: null,
  user: null,
  token: null,
};

// Async thunks
export const initializeAuth = createAsyncThunk(
  'auth/initialize',
  async () => {
    const isDev = process.env.NODE_ENV === 'development';
    
    if (isDev) {
      console.log('=== INITIALIZE AUTH DEBUG ===');
      console.log('Redux: Verificando sessão existente...');
    }
    
    // Primeiro tentar localStorage (mais rápido)
    if (isDev) console.log('Verificando localStorage primeiro...');
    const localSession = getSession();
    if (isDev) console.log('Sessão localStorage:', localSession);
    
    if (localSession && localSession.expiresAt > Date.now()) {
      if (isDev) console.log('Redux: Sessão válida encontrada no localStorage');
      return localSession;
    }
    
    // Se não encontrou no localStorage, tentar IndexedDB
    try {
      if (isDev) console.log('Tentando acessar IndexedDB...');
      const idbSession = await getActiveSessionFromIDB();
      if (isDev) console.log('Resultado IndexedDB:', idbSession);
      
      if (idbSession) {
        if (isDev) console.log('Redux: Sessão encontrada no IndexedDB:', idbSession);
        
        // Converter formato do IndexedDB para formato do Dashboard
        const session: Session = {
          id: idbSession.userId,
          email: idbSession.email,
          token: idbSession.token,
          expiresAt: idbSession.expiresAt
        };
        
        if (isDev) console.log('Sessão convertida:', session);
        
        // Sincronizar com localStorage para próximas verificações
        localStorage.setItem('bank-app-session', JSON.stringify(session));
        if (isDev) console.log('Sessão sincronizada com localStorage');
        
        return session;
      } else {
        if (isDev) console.log('Nenhuma sessão ativa encontrada no IndexedDB');
      }
    } catch (error) {
      if (isDev) {
        console.error('Redux: Erro ao buscar sessão no IndexedDB:', error);
        if (error instanceof Error) {
          console.error('Stack trace:', error.stack);
        }
      }
    }
    
    // Verificar se há dados de usuário no IndexedDB (compatibilidade com Home)
    try {
      if (isDev) console.log('Verificando usuários no IndexedDB para compatibilidade...');
      const db = await import('@/lib/db').then(m => m.getDB());
      const users = await db.getAll('users');
      if (isDev) console.log('Usuários encontrados:', users.length);
      
      if (users.length > 0 && isDev) {
        console.log('Usuários disponíveis mas sem sessão ativa');
      }
    } catch (error) {
      if (isDev) console.error('Erro ao verificar usuários:', error);
    }
    
    if (isDev) console.log('=== FIM INITIALIZE AUTH - NENHUMA SESSÃO ENCONTRADA ===');
    return null;
  }
);

export const loginAsync = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }) => {
    const user = await loginUser(email, password);
    const newSession = createSession(user.email, user.id);
    
    // Salvar no IndexedDB
    try {
      const idbSession = createSessionData(user.id, user.email);
      await saveSessionToIDB(idbSession);
      console.log('Redux: Sessão salva no IndexedDB');
    } catch (error) {
      console.error('Redux: Erro ao salvar sessão no IndexedDB:', error);
    }
    
    // Cookies apenas em desenvolvimento
    if (process.env.NODE_ENV !== 'production') {
      setSessionCookie(newSession);
    }
    
    return newSession;
  }
);

export const logoutAsync = createAsyncThunk(
  'auth/logout',
  async () => {
    // Limpar localStorage
    destroySession();
    
    // Limpar cookies
    removeSessionCookie();
    
    // Limpar IndexedDB
    try {
      await clearAllSessionsFromIDB();
      console.log('Redux: Todas as sessões removidas do IndexedDB');
    } catch (error) {
      console.error('Redux: Erro ao limpar sessões do IndexedDB:', error);
    }
    
    return null;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Initialize auth
      .addCase(initializeAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        console.log('Redux: initializeAuth fulfilled com payload:', action.payload);
        state.loading = false;
        state.session = action.payload;
        state.isAuthenticated = !!action.payload;
        console.log('Redux: Estado atualizado - isAuthenticated:', state.isAuthenticated);
      })
      .addCase(initializeAuth.rejected, (state) => {
        state.loading = false;
        state.session = null;
        state.isAuthenticated = false;
      })
      // Login
      .addCase(loginAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.session = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Login failed';
      })
      // Logout
      .addCase(logoutAsync.fulfilled, (state) => {
        state.session = null;
        state.isAuthenticated = false;
        state.error = null;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
