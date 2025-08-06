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
    console.log('=== INITIALIZE AUTH DEBUG ===');
    console.log('Redux: Verificando sessão existente...');
    
    // Primeiro tentar IndexedDB
    try {
      console.log('Tentando acessar IndexedDB...');
      const idbSession = await getActiveSessionFromIDB();
      console.log('Resultado IndexedDB:', idbSession);
      
      if (idbSession) {
        console.log('Redux: Sessão encontrada no IndexedDB:', idbSession);
        const session: Session = {
          id: idbSession.userId,
          email: idbSession.email,
          token: idbSession.token,
          expiresAt: idbSession.expiresAt
        };
        console.log('Sessão convertida:', session);
        // Sincronizar com localStorage
        localStorage.setItem('bank-app-session', JSON.stringify(session));
        console.log('Sessão sincronizada com localStorage');
        return session;
      } else {
        console.log('Nenhuma sessão ativa encontrada no IndexedDB');
      }
    } catch (error) {
      console.error('Redux: Erro ao buscar sessão no IndexedDB:', error);
      if (error instanceof Error) {
        console.error('Stack trace:', error.stack);
      }
    }
    
    // Fallback para localStorage
    console.log('Tentando localStorage como fallback...');
    const currentSession = getSession();
    console.log('Redux: Sessão encontrada no localStorage:', currentSession);
    console.log('=== FIM INITIALIZE AUTH ===');
    return currentSession;
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
