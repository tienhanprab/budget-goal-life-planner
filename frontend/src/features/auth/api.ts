import api from '@/lib/axios';
import { User } from '@/types';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  display_name: string;
  password: string;
}

export const authApi = {
  login: (data: LoginRequest) =>
    api.post<User>('/auth/login', data).then((r) => r.data),

  register: (data: RegisterRequest) =>
    api.post<User>('/auth/register', data).then((r) => r.data),

  logout: () =>
    api.post<{ message: string }>('/auth/logout').then((r) => r.data),

  getMe: () =>
    api.get<User>('/auth/me').then((r) => r.data),
};
