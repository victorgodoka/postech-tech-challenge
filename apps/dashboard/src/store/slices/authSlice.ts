import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Session, getSession, createSession, clearSession as destroySession } from '@/utils';
import { loginUser } from '@/lib/api';
import { setSessionCookie, removeSessionCookie } from '@/utils';

interface AuthState {
  session: Session | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  session: null,
  isAuthenticated: false,
  loading: true,
  error: null,
};

// Async thunks
export const initializeAuth = createAsyncThunk(
  'auth/initialize',
  async () => {
    const currentSession = getSession();
    return currentSession;
  }
);

export const loginAsync = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }) => {
    const user = await loginUser(email, password);
    const newSession = createSession(user.email, user.id);
    setSessionCookie(newSession);
    return newSession;
  }
);

export const logoutAsync = createAsyncThunk(
  'auth/logout',
  async () => {
    destroySession();
    removeSessionCookie();
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
        state.loading = false;
        state.session = action.payload;
        state.isAuthenticated = !!action.payload;
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
