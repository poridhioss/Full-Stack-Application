import api from './api';

export interface User {
  id: number;
  username: string;
  email: string;
  created_at: string;
}

export interface CreateUserData {
  username: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface UpdateUserData {
  username?: string;
  email?: string;
}

export interface UpdatePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

export const userService = {
  register: async (userData: CreateUserData): Promise<AuthResponse> => {
    const response = await api.post('/users/register', userData);
    return response.data;
  },

  login: async (loginData: LoginData): Promise<AuthResponse> => {
    const response = await api.post('/users/login', loginData);
    return response.data;
  },

  getAllUsers: async (): Promise<User[]> => {
    const response = await api.get('/users');
    return response.data;
  },

  getUserById: async (id: number): Promise<User> => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  updateUser: async (id: number, userData: UpdateUserData): Promise<User> => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },

  updatePassword: async (id: number, passwordData: UpdatePasswordData): Promise<{ message: string }> => {
    const response = await api.put(`/users/${id}/password`, passwordData);
    return response.data;
  },

  deleteUser: async (id: number): Promise<{ message: string }> => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },
};