import { authService } from './auth.service';

export class BaseService {
  protected baseUrl = 'http://localhost:5000';

  protected async authenticatedFetch(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    
    // Get current access token
    let token = authService.getAccessToken();
    
    const makeRequest = async (authToken: string) => {
      return fetch(url, {
        ...options,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
          ...options.headers,
        },
      });
    };
    
    let response = await makeRequest(token);
    
    // If 401, try to refresh token
    if (response.status === 401) {
      try {
        token = await authService.refreshToken();
        response = await makeRequest(token);
      } catch (refreshError) {
        // Refresh failed, redirect to login
        window.location.href = '/login';
        throw new Error('Session expired');
      }
    }
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response;
  }
}
