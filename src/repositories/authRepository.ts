import api from './apiClient';
import { AuthResponse } from '@/types/inventory';

export const authRepository = {
  login: async (username: string, password: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', { username, password });
    return response.data;
  }
};
