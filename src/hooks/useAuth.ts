import { useCallback } from 'react';
import { useAuthStore } from '@/store/authStore';
import { studentLogin, adminLogin, logout } from '@/services/auth.service';
import { LoginCredentials, StudentLoginCredentials } from '@/types/auth.types';

export const useAuth = () => {
  const {
    user,
    accessToken,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout: storeLogout,
    setLoading,
    setError,
    clearError,
  } = useAuthStore();

  // Function 1: Handle student login
  const handleStudentLogin = useCallback(async (credentials: StudentLoginCredentials) => {
    setLoading(true);
    clearError();
    
    try {
      const response = await studentLogin(credentials);
      login(response);
      return response;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Login failed');
      throw error;
    }
  }, [login, setLoading, setError, clearError]);

  // Function 2: Handle admin login
  const handleAdminLogin = useCallback(async (credentials: LoginCredentials) => {
    setLoading(true);
    clearError();
    
    try {
      const response = await adminLogin(credentials);
      login(response);
      return response;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Login failed');
      throw error;
    }
  }, [login, setLoading, setError, clearError]);

  // Function 3: Handle logout
  const handleLogout = useCallback(async (role: 'student' | 'admin') => {
    setLoading(true);
    
    try {
      await logout(role);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      storeLogout();
      setLoading(false);
    }
  }, [storeLogout, setLoading]);

  // Function 4: Check specific role
  const hasRole = useCallback((role: string) => {
    return user?.role === role;
  }, [user]);

  // Function 5: Check if admin
  const isAdmin = useCallback(() => {
    return user?.role === 'ADMIN' || user?.role === 'TEACHER' || user?.role === 'INTERN';
  }, [user]);

  // Function 6: Check if superadmin
  const isSuperadmin = useCallback(() => {
    return user?.role === 'SUPERADMIN';
  }, [user]);

  // Function 7: Check if student
  const isStudent = useCallback(() => {
    return user?.role === 'STUDENT';
  }, [user]);

  return {
    // State
    user,
    accessToken,
    isAuthenticated,
    isLoading,
    error,
    
    // Actions
    handleStudentLogin,
    handleAdminLogin,
    handleLogout,
    clearError,
    
    // Role helpers
    hasRole,
    isAdmin,
    isSuperadmin,
    isStudent,
  };
};