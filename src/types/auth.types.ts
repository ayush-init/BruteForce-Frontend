export interface User {
  id: number;
  name: string;
  email: string;
  role: 'SUPERADMIN' | 'ADMIN' | 'TEACHER' | 'INTERN' | 'STUDENT';
  city?: string;
  batch?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface StudentLoginCredentials {
  email?: string;
  username?: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
  message: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}