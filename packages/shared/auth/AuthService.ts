/**
 * Serviço de Autenticação Centralizado para Microfrontends
 * Baseado nos conceitos da Aula 4 - Postech
 */

import { eventBus } from '../events/EventBus';

export interface User {
  id: string;
  email: string;
  name: string;
  roles: string[];
  permissions: string[];
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  refreshToken: string | null;
}

export class AuthService {
  private static instance: AuthService;
  private state: AuthState = {
    isAuthenticated: false,
    user: null,
    token: null,
    refreshToken: null,
  };

  private constructor() {
    this.loadFromStorage();
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  /**
   * Realiza login do usuário
   */
  public async login(email: string, password: string): Promise<boolean> {
    try {
      // Simular chamada API (substituir por API real)
      const response = await this.mockLoginAPI(email, password);
      
      if (response.success && response.user) {
        this.setState({
          isAuthenticated: true,
          user: response.user,
          token: response.token,
          refreshToken: response.refreshToken,
        });

        this.saveToStorage();
        
        // Emitir evento para outros microfrontends
        eventBus.emit('user:login', {
          userId: response.user.id,
          email: response.user.email,
          timestamp: Date.now(),
        });

        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  }

  /**
   * Realiza logout do usuário
   */
  public async logout(): Promise<void> {
    try {
      // Chamar API de logout se necessário
      await this.mockLogoutAPI();
      
      this.setState({
        isAuthenticated: false,
        user: null,
        token: null,
        refreshToken: null,
      });

      this.clearStorage();
      
      // Emitir evento para outros microfrontends
      eventBus.emit('user:logout', {
        timestamp: Date.now(),
      });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }

  /**
   * Verifica se usuário está autenticado
   */
  public isAuthenticated(): boolean {
    return this.state.isAuthenticated && !!this.state.token;
  }

  /**
   * Verifica se usuário tem permissão específica
   */
  public hasPermission(permission: string): boolean {
    if (!this.isAuthenticated() || !this.state.user) {
      return false;
    }
    
    return this.state.user.permissions.includes(permission);
  }

  /**
   * Verifica se usuário tem role específica
   */
  public hasRole(role: string): boolean {
    if (!this.isAuthenticated() || !this.state.user) {
      return false;
    }
    
    return this.state.user.roles.includes(role);
  }

  /**
   * Obtém usuário atual
   */
  public getCurrentUser(): User | null {
    return this.state.user;
  }

  /**
   * Obtém token atual
   */
  public getToken(): string | null {
    return this.state.token;
  }

  /**
   * Obtém estado completo de autenticação
   */
  public getAuthState(): AuthState {
    return { ...this.state };
  }

  /**
   * Atualiza estado interno
   */
  private setState(newState: Partial<AuthState>): void {
    this.state = { ...this.state, ...newState };
  }

  /**
   * Salva estado no localStorage
   */
  private saveToStorage(): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('auth_state', JSON.stringify(this.state));
      } catch (error) {
        console.error('Failed to save auth state:', error);
      }
    }
  }

  /**
   * Carrega estado do localStorage
   */
  private loadFromStorage(): void {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('auth_state');
        if (saved) {
          const parsedState = JSON.parse(saved);
          // Validar se token ainda é válido
          if (this.isTokenValid(parsedState.token)) {
            this.state = parsedState;
          } else {
            this.clearStorage();
          }
        }
      } catch (error) {
        console.error('Failed to load auth state:', error);
        this.clearStorage();
      }
    }
  }

  /**
   * Limpa dados do localStorage
   */
  private clearStorage(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_state');
    }
  }

  /**
   * Verifica se token é válido (implementar validação real)
   */
  private isTokenValid(token: string | null): boolean {
    if (!token) return false;
    
    try {
      // Implementar validação JWT real aqui
      // Por enquanto, apenas verifica se existe
      return token.length > 0;
    } catch {
      return false;
    }
  }

  /**
   * Mock da API de login (substituir por implementação real)
   */
  private async mockLoginAPI(email: string, password: string): Promise<{
    success: boolean;
    user?: User;
    token?: string;
    refreshToken?: string;
  }> {
    // Simular delay de rede
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simular validação
    if (email === 'admin@postech.com' && password === 'admin123') {
      return {
        success: true,
        user: {
          id: '1',
          email: 'admin@postech.com',
          name: 'Admin User',
          roles: ['admin', 'user'],
          permissions: ['read', 'write', 'delete', 'admin'],
        },
        token: 'mock_jwt_token_' + Date.now(),
        refreshToken: 'mock_refresh_token_' + Date.now(),
      };
    }
    
    if (email === 'user@postech.com' && password === 'user123') {
      return {
        success: true,
        user: {
          id: '2',
          email: 'user@postech.com',
          name: 'Regular User',
          roles: ['user'],
          permissions: ['read', 'write'],
        },
        token: 'mock_jwt_token_' + Date.now(),
        refreshToken: 'mock_refresh_token_' + Date.now(),
      };
    }
    
    return { success: false };
  }

  /**
   * Mock da API de logout
   */
  private async mockLogoutAPI(): Promise<void> {
    // Simular delay de rede
    await new Promise(resolve => setTimeout(resolve, 500));
  }
}

// Instância singleton
export const authService = AuthService.getInstance();
