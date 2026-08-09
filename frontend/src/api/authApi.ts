import apiClient from './client';
import type { LoginCredentials, RegisterData, User } from '../types';

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export function mapUserResponseToUser(raw: any): User {
  return {
    id: String(raw.id),
    name: raw.name || '',
    email: raw.email || '',
    phone: raw.phone || '',
    role: raw.role === 'admin' ? 'admin' : 'user',
    createdAt: raw.created_at || new Date().toISOString(),
    status: 'active',
  };
}

export const authApi = {
  async login(credentials: LoginCredentials): Promise<{ token: string }> {
    const { data } = await apiClient.post<TokenResponse>('/auth/login', {
      email: credentials.email,
      password: credentials.password,
    });
    return { token: data.access_token };
  },

  async register(userData: RegisterData): Promise<User> {
    const { data } = await apiClient.post('/auth/register', {
      name: userData.name,
      email: userData.email,
      password: userData.password,
      phone: userData.phone || undefined,
    });
    return mapUserResponseToUser(data);
  },

  async getCurrentUser(): Promise<User> {
    const { data } = await apiClient.get('/auth/me');
    return mapUserResponseToUser(data);
  },

  logout(): void {
    localStorage.removeItem('ecodrop_token');
  },
};
