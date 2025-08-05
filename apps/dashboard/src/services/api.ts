import { RateLimiter } from '@/utils/validation';

// Base API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';
const API_TIMEOUT = 10000; // 10 seconds

// Rate limiter for API calls
const rateLimiter = new RateLimiter(10, 60000); // 10 calls per minute

// Base API client with error handling and retry logic
class ApiClient {
  private baseURL: string;
  private timeout: number;
  private defaultHeaders: Record<string, string>;

  constructor(baseURL: string = API_BASE_URL, timeout: number = API_TIMEOUT) {
    this.baseURL = baseURL;
    this.timeout = timeout;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    retries: number = 3
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const identifier = `${options.method || 'GET'}-${endpoint}`;

    // Rate limiting
    if (!rateLimiter.isAllowed(identifier)) {
      const remainingTime = rateLimiter.getRemainingTime(identifier);
      throw new Error(`Rate limit exceeded. Try again in ${Math.ceil(remainingTime / 1000)} seconds.`);
    }

    const config: RequestInit = {
      ...options,
      headers: {
        ...this.defaultHeaders,
        ...options.headers,
      },
      signal: AbortSignal.timeout(this.timeout),
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (retries > 0 && error instanceof Error) {
        // Retry on network errors, but not on 4xx errors
        if (error.message.includes('fetch') || error.message.includes('timeout')) {
          console.warn(`Retrying request to ${endpoint}. Retries left: ${retries - 1}`);
          await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
          return this.request<T>(endpoint, options, retries - 1);
        }
      }
      throw error;
    }
  }

  async get<T>(endpoint: string, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET', headers });
  }

  async post<T>(endpoint: string, data?: unknown, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
      headers,
    });
  }

  async put<T>(endpoint: string, data?: unknown, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
      headers,
    });
  }

  async delete<T>(endpoint: string, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE', headers });
  }

  setAuthToken(token: string) {
    this.defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  removeAuthToken() {
    delete this.defaultHeaders['Authorization'];
  }
}

// Create API client instance
export const apiClient = new ApiClient();

// Service interfaces
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: {
    id: string;
    email: string;
    name: string;
  };
  token: string;
  expiresAt: number;
}

export interface TransactionRequest {
  accountId: string;
  value: number;
  description: string;
  type: 'income' | 'expense';
  category?: string;
}

export interface TransactionResponse {
  id: string;
  accountId: string;
  value: number;
  description: string;
  type: 'income' | 'expense';
  category?: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

// API Services
export const authService = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    return apiClient.post<LoginResponse>('/auth/login', credentials);
  },

  async logout(): Promise<void> {
    return apiClient.post<void>('/auth/logout');
  },

  async refreshToken(): Promise<LoginResponse> {
    return apiClient.post<LoginResponse>('/auth/refresh');
  },

  async validateSession(): Promise<{ valid: boolean }> {
    return apiClient.get<{ valid: boolean }>('/auth/validate');
  },
};

export const transactionService = {
  async getTransactions(accountId: string, page = 1, limit = 50): Promise<{
    transactions: TransactionResponse[];
    total: number;
    hasMore: boolean;
  }> {
    return apiClient.get<{
      transactions: TransactionResponse[];
      total: number;
      hasMore: boolean;
    }>(`/transactions?accountId=${accountId}&page=${page}&limit=${limit}`);
  },

  async createTransaction(transaction: TransactionRequest): Promise<TransactionResponse> {
    return apiClient.post<TransactionResponse>('/transactions', transaction);
  },

  async updateTransaction(id: string, transaction: Partial<TransactionRequest>): Promise<TransactionResponse> {
    return apiClient.put<TransactionResponse>(`/transactions/${id}`, transaction);
  },

  async deleteTransaction(id: string): Promise<void> {
    return apiClient.delete<void>(`/transactions/${id}`);
  },
};

export const accountService = {
  async getAccount(id: string): Promise<{
    id: string;
    balance: number;
    balanceVisible: boolean;
    name: string;
    type: string;
  }> {
    return apiClient.get<{
      id: string;
      balance: number;
      balanceVisible: boolean;
      name: string;
      type: string;
    }>(`/accounts/${id}`);
  },

  async updateAccount(id: string, data: {
    balanceVisible?: boolean;
    name?: string;
  }): Promise<{
    id: string;
    balance: number;
    balanceVisible: boolean;
    name: string;
    type: string;
  }> {
    return apiClient.put<{
      id: string;
      balance: number;
      balanceVisible: boolean;
      name: string;
      type: string;
    }>(`/accounts/${id}`, data);
  },
};
