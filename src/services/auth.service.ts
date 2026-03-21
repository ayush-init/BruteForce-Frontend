import axios, { AxiosResponse } from 'axios';
import { LoginCredentials, StudentLoginCredentials, LoginResponse, User } from '@/types/auth.types';
import { getAccessToken, useAuthStore } from '@/store/authStore';

// Function 1: Create API instance with interceptors
export const createApiInstance = () => {
  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
    withCredentials: true,
  });

  // Request interceptor - adds token automatically
  api.interceptors.request.use((config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // Response interceptor - handles 401 and refresh
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          await refreshToken();
          const newToken = getAccessToken();
          if (newToken) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
          }
          return api(originalRequest);
        } catch (refreshError) {
          useAuthStore.getState().logout();
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );

  return api;
};

// Create singleton API instance
export const api = createApiInstance();

// Function 2: Student login
export const studentLogin = async (credentials: StudentLoginCredentials): Promise<LoginResponse> => {
  try {
    const response: AxiosResponse<LoginResponse> = await api.post(
      '/api/auth/student/login',
      credentials
    );
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

// Function 3: Admin login
export const adminLogin = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  try {
    const response: AxiosResponse<LoginResponse> = await api.post(
      '/api/auth/admin/login',
      credentials
    );
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

// Function 4: Refresh token
export const refreshToken = async (): Promise<void> => {
  try {
    const response: AxiosResponse<{ accessToken: string }> = await api.post(
      '/api/auth/refresh-token'
    );
    
    // Update memory token
    (window as any).__ACCESS_TOKEN__ = response.data.accessToken;
    
    // Just update token in store - no type conflicts
    useAuthStore.setState({
      accessToken: response.data.accessToken,
    });
  } catch (error) {
    throw handleError(error);
  }
};
// Function 5: Logout
export const logout = async (role: 'student' | 'admin'): Promise<void> => {
  try {
    await api.post(`/api/auth/${role}/logout`);
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    useAuthStore.getState().logout();
  }
};

// Function 6: Get current user
export const getCurrentUser = async (): Promise<User> => {
  try {
    const response: AxiosResponse<User> = await api.get('/api/auth/me');
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

// Function 7: Error handling helper
const handleError = (error: any): Error => {
  if (error.response?.data?.error) {
    return new Error(error.response.data.error);
  }
  if (error.response?.data?.message) {
    return new Error(error.response.data.message);
  }
  return new Error('An unexpected error occurred');
};